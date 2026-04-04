import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/' +
  'gemini-2.5-flash:generateContent'

const VALID_SLUGS = [
  'all-or-nothing-thinking',
  'catastrophising',
  'mind-reading',
  'fortune-telling',
  'emotional-reasoning',
  'personalisation',
  'should-statements',
  'overgeneralisation',
  'mental-filter',
  'discounting-positives',
  'labelling',
  'magnification',
] as const

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { thought } = await request.json()

  if (!thought || typeof thought !== 'string' || thought.trim().length < 10) {
    return NextResponse.json(
      { error: 'Thought must be at least 10 characters' },
      { status: 400 }
    )
  }

  const prompt = `You are a clinical CBT assistant. Analyze the following automatic thought written by a user during a CBT journaling exercise.

Automatic thought: "${thought.trim()}"

From the list below, identify which cognitive distortions are present.
Return ONLY a JSON array of slugs from this exact list, ranked by
confidence, maximum 3 items. No explanation, no extra text, just
the JSON array.

Valid slugs:
${VALID_SLUGS.join('\n')}

Rules:
- Only return slugs from the list above
- Maximum 3 slugs
- Most confident match first
- If no clear distortion is present, return an empty array []
- Return raw JSON only, no markdown, no backticks`

  const response = await fetch(
    `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 512,
          topP: 0.8,
        },
      }),
    }
  )

  if (!response.ok) {
    console.error('Gemini API error:', response.status, await response.text())
    return NextResponse.json(
      { error: 'Classification failed' },
      { status: 500 }
    )
  }

  const data = await response.json()

  // gemini-2.5-flash is a thinking model — parts include thought parts
  // (marked with thought: true) followed by the actual answer part.
  // Exclude thought parts and take the last remaining text.
  const parts: Array<{ text?: string; thought?: boolean }> =
    data.candidates?.[0]?.content?.parts ?? []
  const rawText =
    parts
      .filter((p) => !p.thought && p.text)
      .map((p) => p.text!)
      .at(-1) ?? '[]'


  // Strip markdown fences the model sometimes adds despite instructions
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  let slugs: string[] = []
  try {
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed)) {
      slugs = parsed
        .filter((s): s is string => VALID_SLUGS.includes(s as never))
        .slice(0, 3)
    }
  } catch {
    slugs = []
  }

  return NextResponse.json({ slugs })
}
