-- Build or Buy — Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── Rubrics ──────────────────────────────────────────────────────
create table if not exists public.rubrics (
  id           text primary key,              -- 6-char share code
  org          text,
  title        text not null,
  description  text,
  author_name  text not null,
  dimensions   jsonb not null default '[]',   -- array of {id, name, desc, custom?}
  scale        jsonb not null default '{}',   -- {label, min, max, note, buildLabel, buyLabel}
  created_at   timestamptz not null default now()
);

-- Index for author lookup
create index if not exists idx_rubrics_author on public.rubrics (lower(author_name));

-- ── Responses ────────────────────────────────────────────────────
create table if not exists public.responses (
  id              uuid primary key default uuid_generate_v4(),
  rubric_id       text not null references public.rubrics(id) on delete cascade,
  evaluator_name  text not null,
  role            text,
  scores          jsonb not null default '{}',  -- {dimId: number | "na"}
  comment         text,
  submitted_at    timestamptz not null default now()
);

create index if not exists idx_responses_rubric on public.responses (rubric_id);

-- ── Custom Dimensions (per author) ──────────────────────────────
create table if not exists public.custom_dimensions (
  id          text primary key,
  author_key  text not null,               -- lowercased author name
  name        text not null,
  "desc"      text,
  saved_at    timestamptz not null default now()
);

create index if not exists idx_custom_dims_author on public.custom_dimensions (author_key);

-- ── Row Level Security ──────────────────────────────────────────
-- For a public tool: allow all reads, inserts. No updates/deletes from anon.

alter table public.rubrics enable row level security;
alter table public.responses enable row level security;
alter table public.custom_dimensions enable row level security;

-- Rubrics: anyone can read or create
create policy "rubrics_select" on public.rubrics for select using (true);
create policy "rubrics_insert" on public.rubrics for insert with check (true);

-- Responses: anyone can read or create
create policy "responses_select" on public.responses for select using (true);
create policy "responses_insert" on public.responses for insert with check (true);

-- Custom dimensions: anyone can read, create, or delete their own
create policy "custom_dims_select" on public.custom_dimensions for select using (true);
create policy "custom_dims_insert" on public.custom_dimensions for insert with check (true);
create policy "custom_dims_delete" on public.custom_dimensions for delete using (true);

-- ── Realtime ─────────────────────────────────────────────────────
-- Enable realtime for responses table so evaluators see live updates
alter publication supabase_realtime add table public.responses;
