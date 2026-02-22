import type { ChatRequest } from '../types'

export async function uploadArticle(file: File): Promise<{ filename: string; chunks_added: number }> {
  const form = new FormData()
  form.append('file', file)

  const response = await fetch('/api/ingest', {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Ingest failed: ${text}`)
  }

  return response.json()
}

// Re-export the type so callers can import from a single place
export type { ChatRequest }
