import ky from 'ky'
import { API_BASE_URL } from './config'

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 15000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeError: [
      (error) => {
        console.error(`[API Error] ${error.request.url}:`, error.message)
        return error
      },
    ],
  },
})
