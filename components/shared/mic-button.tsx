"use client"
import { useState, useRef } from "react"
import { Mic, MicOff } from "lucide-react"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const LANG_MAP = { en: "en-US", ar: "ar-EG" }

function detectDefaultLang(): "en" | "ar" {
  if (typeof navigator === "undefined") return "en"
  return navigator.language.startsWith("ar") ? "ar" : "en"
}

export function MicButton({
  fieldValue,
  onTranscript,
}: {
  fieldValue: string
  onTranscript: (text: string) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState<"en" | "ar">(detectDefaultLang)

  const fieldValueRef = useRef(fieldValue)
  fieldValueRef.current = fieldValue

  const { start, stop, isListening, isSupported } = useSpeechToText({
    lang: LANG_MAP[lang],
    continuous: true,
    onResult: (transcript) => {
      const current = fieldValueRef.current
      const separator = current.trim().length > 0 ? " " : ""
      onTranscript(current + separator + transcript)
      setError(null)
    },
    onError: (err) => setError(err),
  })

  if (!isSupported) return null

  const Icon = isListening ? MicOff : Mic

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {/* Language toggle */}
      <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", border: "1px solid var(--surface-container-highest)" }}>
        {(["en", "ar"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            style={{
              background: lang === l ? "var(--surface-container-highest)" : "transparent",
              color: lang === l ? "var(--on-surface)" : "var(--tertiary)",
              border: "none",
              padding: "3px 9px",
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 120ms ease",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Mic button */}
      <Tooltip>
        <TooltipTrigger>
          <button
            type="button"
            onClick={() => (isListening ? stop() : start())}
            style={{
              background: isListening ? "var(--primary-container)" : "transparent",
              color: isListening ? "var(--on-primary-container)" : "var(--tertiary)",
              border: "none",
              borderRadius: 999,
              padding: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 150ms ease",
            }}
          >
            <Icon size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {isListening ? "Stop recording" : "Dictate"}
        </TooltipContent>
      </Tooltip>

      {isListening && (
        <span style={{ fontSize: 10, color: "var(--primary)", fontStyle: "italic" }}>
          listening...
        </span>
      )}

      {error && (
        <span style={{ fontSize: 10, color: "var(--tertiary)", lineHeight: 1.4 }}>
          {error}
        </span>
      )}
    </div>
  )
}
