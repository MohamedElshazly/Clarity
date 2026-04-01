-- ============================================================
-- Clarity — CBT Thought Record Journal
-- Database Schema
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── profiles ────────────────────────────────────────────────────────────────
-- One row per auth.users entry, created automatically via trigger.
create table if not exists public.profiles (
  id          uuid        references auth.users (id) on delete cascade primary key,
  email       text,
  full_name   text,
  avatar_url  text,
  plan        text        not null default 'free',
  created_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Public profile data for each authenticated user.';

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── thought_records ─────────────────────────────────────────────────────────
create table if not exists public.thought_records (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references public.profiles (id) on delete cascade,

  -- Step 1 — Situation
  title              text,                        -- auto-generated from situation snippet
  situation          text        not null,

  -- Step 2 — Emotions
  emotions           jsonb       not null,         -- EmotionEntry[]: [{id, label, intensity_before}]

  -- Step 3 — Automatic thought
  automatic_thought  text        not null,

  -- Step 4 — Distortion
  distortion_slug    text,
  distortion_slugs   text[]      not null default '{}',

  -- Step 5 — Evidence
  evidence_for       text,
  evidence_against   text,

  -- Step 6 — Balanced thought
  balanced_thought   text,
  confidence_level   integer     check (confidence_level between 0 and 100),

  -- Step 7 — Outcome & reflection
  outcome_ratings    jsonb,                        -- {anxiety: n, overwhelm: n, clarity: n}
  reflection         text,

  -- Metadata
  is_draft           boolean     not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.thought_records is
  'CBT thought records created by users. Stored as a multi-step form with JSONB fields for emotions and outcome ratings.';

-- Keep updated_at current automatically
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists thought_records_set_updated_at on public.thought_records;
create trigger thought_records_set_updated_at
  before update on public.thought_records
  for each row execute procedure public.set_updated_at();

-- Index for fast per-user listing, newest first
create index if not exists thought_records_user_id_created_at_idx
  on public.thought_records (user_id, created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────

-- profiles: users can read and update only their own row
alter table public.profiles enable row level security;

create policy "profiles: select own row"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: update own row"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- thought_records: users own their records
alter table public.thought_records enable row level security;

create policy "thought_records: select own"
  on public.thought_records for select
  using (user_id = auth.uid());

create policy "thought_records: insert own"
  on public.thought_records for insert
  with check (user_id = auth.uid());

create policy "thought_records: update own"
  on public.thought_records for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "thought_records: delete own"
  on public.thought_records for delete
  using (user_id = auth.uid());
