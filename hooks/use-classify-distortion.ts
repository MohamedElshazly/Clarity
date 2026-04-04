'use client'
import { useState, useCallback } from 'react'

type ClassificationState = {
  slugs: string[]
  isLoading: boolean
  error: string | null
  hasRun: boolean
}

export function useClassifyDistortion() {
  const [state, setState] = useState<ClassificationState>({
    slugs: [],
    isLoading: false,
    error: null,
    hasRun: false,
  })

  const classify = useCallback(async (thought: string) => {
    if (thought.trim().length < 10) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/ai/classify-distortion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thought }),
      })

      if (!response.ok) throw new Error('Classification failed')

      const { slugs } = await response.json()
      setState({ slugs, isLoading: false, error: null, hasRun: true })
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Could not classify. You can still select manually.',
        hasRun: true,
      }))
    }
  }, [])

  const reset = useCallback(() => {
    setState({ slugs: [], isLoading: false, error: null, hasRun: false })
  }, [])

  return { ...state, classify, reset }
}
