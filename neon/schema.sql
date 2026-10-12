-- Build or Buy — Neon Postgres Schema
-- Run this in the Neon SQL Editor to set up your database.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Rubrics ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rubrics (
  id           TEXT PRIMARY KEY,
  org          TEXT,
  title        TEXT NOT NULL,
  description  TEXT,
  author_name  TEXT NOT NULL,
  author_key   TEXT NOT NULL,
  dimensions   JSONB NOT NULL DEFAULT '[]',
  scale        JSONB NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  password_hash  TEXT
);

CREATE INDEX IF NOT EXISTS idx_rubrics_author ON rubrics (LOWER(author_key));

-- ── Responses ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS responses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rubric_id       TEXT NOT NULL REFERENCES rubrics(id) ON DELETE CASCADE,
  evaluator_name  TEXT NOT NULL,
  role            TEXT,
  scores          JSONB NOT NULL DEFAULT '{}',
  comment         TEXT,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_responses_rubric ON responses (rubric_id);

-- ── Custom Dimensions (per author) ──────────────────────────────
CREATE TABLE IF NOT EXISTS custom_dimensions (
  id          TEXT PRIMARY KEY,
  author_key  TEXT NOT NULL,
  name        TEXT NOT NULL,
  "desc"      TEXT,
  saved_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_custom_dims_author ON custom_dimensions (author_key);
