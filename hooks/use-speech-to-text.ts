"use client"
import { useState, useRef, useCallback, useEffect } from "react"

type SpeechToTextOptions = {
  lang?: string
  continuous?: boolean
  onResult: (transcript: string) => void
  onError?: (error: string) => void
}

export function useSpeechToText({
  lang = "en-US",
  continuous = false,
  onResult,
  onError,
}: SpeechToTextOptions) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Keep refs so recognition event handlers always call the latest callbacks
  // without needing to restart recognition when props change
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const start = useCallback(
    (currentLang?: string) => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        onErrorRef.current?.("Speech recognition is not supported on this device.")
        return
      }

      const recognition = new SpeechRecognition()
      recognition.lang = currentLang ?? lang
      recognition.continuous = continuous
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => setIsListening(true)

      recognition.onresult = (event) => {
        // Iterate only new results starting at resultIndex.
        // Check isFinal on each — en-US fires onresult far more frequently
        // than ar-EG and can deliver the same words across multiple events
        // before a segment is truly finalized.
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript.trim()
            if (transcript) onResultRef.current(transcript)
          }
        }
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        if (event.error === "aborted") return
        const messages: Record<string, string> = {
          "not-allowed": "Microphone access was denied.",
          "no-speech": "No speech was detected. Try again.",
          network: "Network error during recognition.",
          "audio-capture": "No microphone was found on this device.",
        }
        onErrorRef.current?.(messages[event.error] ?? "Speech recognition failed.")
      }

      recognition.onend = () => setIsListening(false)

      recognitionRef.current = recognition
      recognition.start()
    },
    [lang, continuous]
  )

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  useEffect(() => {
    return () => recognitionRef.current?.abort()
  }, [])

  return { start, stop, isListening, isSupported }
}
