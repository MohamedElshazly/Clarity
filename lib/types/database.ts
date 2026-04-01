export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Emotion entry stored in thought_records.emotions ────────────────────────
export type EmotionEntry = {
  id: string;
  label: string;
  intensity_before: number; // 0–100
};

// ─── Outcome ratings stored in thought_records.outcome_ratings ───────────────
export type OutcomeRatings = {
  anxiety: number;    // 0–100
  overwhelm: number;  // 0–100
  clarity: number;    // 0–100
};

// ─── Database schema ──────────────────────────────────────────────────────────
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          plan: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      thought_records: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          situation: string;
          emotions: EmotionEntry[];
          automatic_thought: string;
          distortion_slug: string | null;
          evidence_for: string | null;
          evidence_against: string | null;
          balanced_thought: string | null;
          confidence_level: number | null;
          outcome_ratings: OutcomeRatings | null;
          reflection: string | null;
          is_draft: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          situation: string;
          emotions: EmotionEntry[];
          automatic_thought: string;
          distortion_slug?: string | null;
          evidence_for?: string | null;
          evidence_against?: string | null;
          balanced_thought?: string | null;
          confidence_level?: number | null;
          outcome_ratings?: OutcomeRatings | null;
          reflection?: string | null;
          is_draft?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          situation?: string;
          emotions?: EmotionEntry[];
          automatic_thought?: string;
          distortion_slug?: string | null;
          evidence_for?: string | null;
          evidence_against?: string | null;
          balanced_thought?: string | null;
          confidence_level?: number | null;
          outcome_ratings?: OutcomeRatings | null;
          reflection?: string | null;
          is_draft?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "thought_records_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// ─── Convenience row types ────────────────────────────────────────────────────
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ThoughtRecord =
  Database["public"]["Tables"]["thought_records"]["Row"];
export type ThoughtRecordInsert =
  Database["public"]["Tables"]["thought_records"]["Insert"];
export type ThoughtRecordUpdate =
  Database["public"]["Tables"]["thought_records"]["Update"];
