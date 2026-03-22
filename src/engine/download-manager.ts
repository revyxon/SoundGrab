import type { Song, QualityValue } from '@/types'
import { useDownloadStore } from '@/stores/download-store'
import { useSettingsStore } from '@/stores/settings-store'
import { getSongById } from '@/services/song.service'
import { writeId3Tags, getTagDataFromSong } from './id3-tagger'
import { generateFileName, getFileNameParams } from './file-namer'
import { getImageUrl } from '@/lib/utils'

class DownloadManager {
  private processing = false

  async enqueueSong(song: Song, quality?: QualityValue, trackNumber?: number) {
    const store = useDownloadStore.getState()
    const settings = useSettingsStore.getState()

    if (store.isInQueue(song.id)) return

    const selectedQuality = quality || settings.defaultQuality
    const primaryArtist = song.artists?.primary?.map((a) => a.name).join(', ') || 'Unknown'

    store.enqueue({
      songId: song.id,
      songName: song.name,
      artistName: primaryArtist,
      albumName: song.album?.name || 'Unknown',
      quality: selectedQuality,
      coverUrl: getImageUrl(song.image, 'medium'),
      duration: song.duration,
      year: song.year,
    })

    this.processQueue()
  }

  async enqueueSongs(songs: Song[], quality?: QualityValue) {
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i]
      if (song) {
        await this.enqueueSong(song, quality, i + 1)
      }
    }
  }

  async processQueue() {
    if (this.processing) return
    this.processing = true

    try {
      while (true) {
        const store = useDownloadStore.getState()
        const settings = useSettingsStore.getState()
        const activeCount = store.getActiveCount()

        if (activeCount >= settings.concurrentDownloads) break

        const nextItem = store.queue.find((item) => item.status === 'queued')
        if (!nextItem) break

        store.updateStatus(nextItem.id, 'downloading')
        this.downloadSingle(nextItem.id, nextItem.songId, nextItem.quality).catch(() => {})
      }
    } finally {
      this.processing = false
    }
  }

  private async downloadSingle(downloadId: string, songId: string, quality: QualityValue) {
    const settings = useSettingsStore.getState()

    try {
      // 1. Fetch full song details
      const songs = await getSongById(songId)
      const song = songs[0]
      if (!song) throw new Error('Song not found')

      // 2. Find download URL for requested quality
      const downloadUrl = song.downloadUrl?.find((d) => d.quality === quality)
        ?? song.downloadUrl?.[song.downloadUrl.length - 1]
      if (!downloadUrl?.url) throw new Error('No download URL available')

      // 3. Fetch audio data as a complete blob (more reliable than streaming for CORS audio)
      useDownloadStore.getState().updateProgress(downloadId, 10)

      const response = await fetch(downloadUrl.url)
      if (!response.ok) throw new Error(`Download failed: ${response.status}`)

      useDownloadStore.getState().updateProgress(downloadId, 50)

      // Get the complete array buffer directly — more reliable than streaming chunks
      const audioArrayBuffer = await response.arrayBuffer()

      useDownloadStore.getState().updateProgress(downloadId, 80)

      let finalBuffer: ArrayBuffer = audioArrayBuffer

      // 4. Write ID3 tags (only if enabled and audio data looks valid)
      if (settings.autoTag && audioArrayBuffer.byteLength > 0) {
        try {
          useDownloadStore.getState().updateStatus(downloadId, 'tagging')
          useDownloadStore.getState().updateProgress(downloadId, 85)
          const tagData = getTagDataFromSong(song)
          finalBuffer = await writeId3Tags(audioArrayBuffer, tagData)
        } catch (tagErr) {
          // If tagging fails, still save the untagged file
          console.warn('ID3 tagging failed, saving untagged file:', tagErr)
          finalBuffer = audioArrayBuffer
        }
      }

      useDownloadStore.getState().updateProgress(downloadId, 95)

      // 5. Generate filename & trigger download
      const params = getFileNameParams(song)
      const fileName = generateFileName(settings.fileNamePattern, params)

      const blob = new Blob([finalBuffer], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()

      // Clean up after a brief delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 1000)

      // 6. Mark complete & add to history
      useDownloadStore.getState().updateStatus(downloadId, 'complete')
      useDownloadStore.getState().addToHistory({
        songId: song.id,
        songName: song.name,
        artistName: song.artists?.primary?.map((a) => a.name).join(', ') || 'Unknown',
        albumName: song.album?.name || 'Unknown',
        quality,
        coverUrl: getImageUrl(song.image, 'medium'),
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Download failed'
      useDownloadStore.getState().updateStatus(downloadId, 'failed', message)
    } finally {
      // Process next in queue
      setTimeout(() => this.processQueue(), 100)
    }
  }
}

export const downloadManager = new DownloadManager()
