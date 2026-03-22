import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import type { Song } from '@/types'
import { getImageUrl, decodeHtmlEntities } from '@/lib/utils'

interface TagData {
  title: string
  artist: string
  albumArtist: string
  album: string
  year?: string | null
  trackNumber?: number
  genre?: string
  language?: string
  label?: string
  copyright?: string
  coverUrl?: string
}

let ffmpeg: FFmpeg | null = null

async function getFFmpeg() {
  if (ffmpeg) return ffmpeg
  ffmpeg = new FFmpeg()
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })
  return ffmpeg
}

/**
 * Fetch image data bypassing CORS if needed via an <img> + canvas strategy.
 */
async function fetchImageAsArrayBuffer(url: string): Promise<ArrayBuffer | null> {
  // Try direct fetch first
  try {
    const response = await fetch(url, { mode: 'cors' })
    if (response.ok) return await response.arrayBuffer()
  } catch {
    // CORS blocked
  }

  // Fallback to crossOrigin img + canvas
  return new Promise<ArrayBuffer | null>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(null); return }

        ctx.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (!blob) { resolve(null); return }
          blob.arrayBuffer().then(resolve).catch(() => resolve(null))
        }, 'image/jpeg', 0.95)
      } catch {
        resolve(null)
      }
    }

    img.onerror = () => {
      // Third strategy: CORS proxy
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`
      fetch(proxyUrl, { mode: 'cors' })
        .then(r => r.ok ? r.arrayBuffer() : null)
        .then(buf => resolve(buf))
        .catch(() => resolve(null))
    }

    img.src = url
  })
}

export async function writeId3Tags(audioBuffer: ArrayBuffer, tagData: TagData): Promise<ArrayBuffer> {
  const ff = await getFFmpeg()
  
  const inputName = 'input.m4a'
  const outputName = 'out.m4a'
  const coverName = 'cover.jpg'

  // Write original file to in-memory FS
  await ff.writeFile(inputName, new Uint8Array(audioBuffer))

  const args = ['-i', inputName]
  let hasCover = false

  if (tagData.coverUrl) {
    const coverBuf = await fetchImageAsArrayBuffer(tagData.coverUrl)
    if (coverBuf && coverBuf.byteLength > 0) {
      await ff.writeFile(coverName, new Uint8Array(coverBuf))
      args.push('-i', coverName)
      hasCover = true
    }
  }

  // If there's cover art, map it as the 2nd stream and disposition it
  args.push('-map', '0:a')
  if (hasCover) {
    args.push('-map', '1:v')
    args.push('-disposition:v', 'attached_pic')
  }

  // Copy audio codec directly — NO re-encoding so it's instant and loss-less
  args.push('-c', 'copy')

  // Set M4A (iTunes) metadata atoms
  if (tagData.title) args.push('-metadata', `title=${tagData.title}`)
  if (tagData.artist) args.push('-metadata', `artist=${tagData.artist}`)
  if (tagData.albumArtist) args.push('-metadata', `album_artist=${tagData.albumArtist}`)
  if (tagData.album) args.push('-metadata', `album=${tagData.album}`)
  if (tagData.year) args.push('-metadata', `date=${tagData.year}`)
  if (tagData.trackNumber) args.push('-metadata', `track=${tagData.trackNumber}`)
  if (tagData.genre) args.push('-metadata', `genre=${tagData.genre}`)
  if (tagData.copyright) args.push('-metadata', `copyright=${tagData.copyright}`)
  if (tagData.label) args.push('-metadata', `publisher=${tagData.label}`)
  args.push('-metadata', `encoder=SoundGrab Music Platform`)

  args.push(outputName)

  // Run the conversion!
  await ff.exec(args)

  // Read back the result
  const outData = await ff.readFile(outputName)
  
  // Cleanup virtual FS
  await ff.deleteFile(inputName)
  await ff.deleteFile(outputName)
  if (hasCover) await ff.deleteFile(coverName)

  return (outData as Uint8Array).buffer as ArrayBuffer
}

export function getTagDataFromSong(song: Song, overrides?: Partial<TagData>): TagData {
  const primaryArtists = song.artists?.primary?.map((a) => decodeHtmlEntities(a.name)).join(', ') || 'Unknown Artist'
  const featuredArtists = song.artists?.featured?.map((a) => decodeHtmlEntities(a.name)).join(', ') || ''
  const allArtists = featuredArtists
    ? `${primaryArtists}, ${featuredArtists}`
    : primaryArtists

  return {
    title: decodeHtmlEntities(song.name),
    artist: allArtists,
    albumArtist: primaryArtists,
    album: decodeHtmlEntities(song.album?.name) || 'Unknown Album',
    year: song.year || song.releaseDate?.split('-')[0] || null,
    language: song.language || undefined,
    label: decodeHtmlEntities(song.label) || undefined,
    copyright: decodeHtmlEntities(song.copyright) || undefined,
    coverUrl: getImageUrl(song.image, 'high'),
    ...overrides,
  }
}
