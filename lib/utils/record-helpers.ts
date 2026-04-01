import { z } from "zod";
import type { ThoughtRecordInsert, EmotionEntry } from "@/lib/types/database";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

export const formSchema = z.object({
  // Step 1
  situation: z
    .string()
    .min(10, "Please describe the situation (at least 10 characters)"),

  // Step 2
  selectedEmotions: z
    .array(z.object({ id: z.string(), label: z.string() }))
    .min(1, "Please select at least one emotion"),
  emotionIntensities: z.record(z.string(), z.number().min(0).max(100)),

  // Step 3
  automaticThought: z
    .string()
    .min(5, "Please describe your automatic thought (at least 5 characters)"),
  distortionSlugs: z.array(z.string()),

  // Steps 4-7
  evidenceFor: z
    .string()
    .min(5, "Please provide evidence (at least 5 characters)"),
  evidenceAgainst: z
    .string()
    .min(5, "Please provide counter-evidence (at least 5 characters)"),
  balancedThought: z
    .string()
    .min(5, "Please write a balanced thought (at least 5 characters)"),
  confidenceLevel: z.number().min(1).max(100),
  outcomeIntensities: z.record(z.string(), z.number().min(0).max(100)),
  reflection: z.string(),
});

export type RecordFormValues = z.infer<typeof formSchema>;

// ─── Default Values ───────────────────────────────────────────────────────────

export const recordFormDefaultValues: RecordFormValues = {
  situation: "",
  selectedEmotions: [],
  emotionIntensities: {},
  automaticThought: "",
  distortionSlugs: [],
  evidenceFor: "",
  evidenceAgainst: "",
  balancedThought: "",
  confidenceLevel: 0,
  outcomeIntensities: {},
  reflection: "",
};

// ─── Transformation Functions ─────────────────────────────────────────────────

/**
 * Transform form values to database record format
 */
export function transformFormToRecord(
  formValues: Partial<RecordFormValues>
): Partial<ThoughtRecordInsert> {
  // Transform emotions to database format
  const emotions: EmotionEntry[] = (formValues.selectedEmotions || []).map(
    (emotion) => ({
      id: emotion.id,
      label: emotion.label,
      intensity_before: formValues.emotionIntensities?.[emotion.id] || 50,
      intensity_after: formValues.outcomeIntensities?.[emotion.id] || null,
    })
  );

  return {
    situation: formValues.situation || "",
    emotions,
    automatic_thought: formValues.automaticThought || "",
    distortion_slug: formValues.distortionSlugs?.[0] || null, // Store first distortion in legacy field for backwards compatibility
    distortion_slugs: formValues.distortionSlugs || [],
    evidence_for: formValues.evidenceFor || null,
    evidence_against: formValues.evidenceAgainst || null,
    balanced_thought: formValues.balancedThought || null,
    confidence_level: formValues.confidenceLevel || null,
    outcome_ratings: null, // Deprecated - now using intensity_after in emotions
    reflection: formValues.reflection || null,
  };
}

// ─── Validation Functions ─────────────────────────────────────────────────────

/**
 * Validate current step to enable/disable Next button
 */
export function validateCurrentStep(
  step: number,
  formValues: Partial<RecordFormValues> | undefined
): boolean {
  if (!formValues) return false;

  switch (step) {
    case 1:
      return (formValues.situation?.trim().length || 0) > 10;
    case 2:
      return (formValues.selectedEmotions?.length || 0) > 0;
    case 3:
      return (formValues.automaticThought?.trim().length || 0) > 5;
    case 4:
      return (formValues.evidenceFor?.trim().length || 0) > 5;
    case 5:
      return (formValues.evidenceAgainst?.trim().length || 0) > 5;
    case 6:
      return (
        (formValues.balancedThought?.trim().length || 0) > 5 &&
        (formValues.confidenceLevel || 0) > 0
      );
    case 7:
      return true; // Step 7 is always valid (reflection is optional)
    default:
      return false;
  }
}

// ─── Calculation Functions ────────────────────────────────────────────────────

/**
 * Calculate emotion shift between initial and outcome ratings
 */
export function calculateEmotionShift(
  formValues: Partial<RecordFormValues> | undefined
): {
  averageInitialIntensity: number;
  averageOutcomeIntensity: number;
  improvement: number;
} {
  if (!formValues || !formValues.selectedEmotions?.length) {
    return {
      averageInitialIntensity: 50,
      averageOutcomeIntensity: 50,
      improvement: 0,
    };
  }

  // Calculate average initial intensity for selected emotions
  const initialIntensities = formValues.selectedEmotions.map(
    (emotion) => formValues.emotionIntensities?.[emotion.id] || 50
  );
  const avgInitial =
    initialIntensities.reduce((sum, val) => sum + val, 0) / initialIntensities.length;

  // Calculate average outcome intensity for selected emotions
  const outcomeIntensities = formValues.selectedEmotions.map(
    (emotion) => formValues.outcomeIntensities?.[emotion.id] || 50
  );
  const avgOutcome =
    outcomeIntensities.reduce((sum, val) => sum + val, 0) / outcomeIntensities.length;

  // Improvement is reduction in intensity (lower is better)
  const improvement = avgInitial - avgOutcome;

  return {
    averageInitialIntensity: Math.round(avgInitial),
    averageOutcomeIntensity: Math.round(avgOutcome),
    improvement: Math.round(improvement),
  };
}
