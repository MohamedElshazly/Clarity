import { createClient } from "@/lib/supabase/client";
import type {
  ThoughtRecord,
  ThoughtRecordInsert,
  ThoughtRecordUpdate,
} from "@/lib/types/database";

/**
 * Create a new draft record
 */
export async function createDraftRecord(
  userId: string,
  data: Partial<ThoughtRecordInsert>
): Promise<ThoughtRecord> {
  const supabase = createClient();

  const { data: record, error } = await supabase
    .from("thought_records")
    .insert({
      user_id: userId,
      situation: data.situation || "",
      emotions: data.emotions || [],
      automatic_thought: data.automatic_thought || "",
      distortion_slug: data.distortion_slug,
      evidence_for: data.evidence_for,
      evidence_against: data.evidence_against,
      balanced_thought: data.balanced_thought,
      confidence_level: data.confidence_level,
      outcome_ratings: data.outcome_ratings,
      reflection: data.reflection,
      is_draft: true,
    })
    .select()
    .single();

  if (error) throw error;
  return record;
}

/**
 * Update an existing draft record
 */
export async function updateDraftRecord(
  id: string,
  data: Partial<ThoughtRecordUpdate>
): Promise<ThoughtRecord> {
  const supabase = createClient();

  const { data: record, error } = await supabase
    .from("thought_records")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return record;
}

/**
 * Submit a record (finalize draft or create new)
 */
export async function submitRecord(
  userId: string,
  recordId: string | null,
  data: ThoughtRecordInsert
): Promise<ThoughtRecord> {
  const supabase = createClient();

  if (recordId) {
    // Update existing draft and mark as complete
    const { data: record, error } = await supabase
      .from("thought_records")
      .update({
        ...data,
        is_draft: false,
        metadata: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", recordId)
      .select()
      .single();

    if (error) throw error;
    return record;
  } else {
    // Create new complete record
    const { data: record, error } = await supabase
      .from("thought_records")
      .insert({
        ...data,
        user_id: userId,
        is_draft: false,
        metadata: null,
      })
      .select()
      .single();

    if (error) throw error;
    return record;
  }
}

/**
 * Get a draft record by ID
 */
export async function getDraftRecord(
  id: string
): Promise<ThoughtRecord | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("thought_records")
    .select("*")
    .eq("id", id)
    .eq("is_draft", true)
    .single();

  if (error) return null;
  return data;
}

/**
 * Get all records for a user (non-draft only)
 */
export async function getUserRecords(
  userId: string
): Promise<ThoughtRecord[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("thought_records")
    .select("*")
    .eq("user_id", userId)
    .eq("is_draft", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get a single record by ID
 */
export async function getRecordById(
  id: string
): Promise<ThoughtRecord | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("thought_records")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

/**
 * Update a record
 */
export async function updateRecord(
  id: string,
  data: Partial<ThoughtRecordUpdate>
): Promise<ThoughtRecord> {
  const supabase = createClient();

  const { data: record, error } = await supabase
    .from("thought_records")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return record;
}

/**
 * Delete a record
 */
export async function deleteRecord(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("thought_records")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Get the most recent active draft for a user
 */
export async function getActiveDraft(
  userId: string
): Promise<ThoughtRecord | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("thought_records")
    .select("*")
    .eq("user_id", userId)
    .eq("is_draft", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Discard a draft by deleting it
 */
export async function discardDraft(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("thought_records")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
