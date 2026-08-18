-- =======================================================
-- HITL (Human-in-the-Loop) Approval Gate Migration
-- Run after: 20260819_job_agent_schema.sql
-- =======================================================

-- Add HITL columns to jobs table
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'Pending'
    CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
  ADD COLUMN IF NOT EXISTS cover_letter_preview TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS resume_summary_preview TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_notes TEXT DEFAULT '';

-- Index for fast approval queue queries
CREATE INDEX IF NOT EXISTS idx_jobs_approval_status
  ON public.jobs(approval_status)
  WHERE approval_status = 'Pending';

-- Convenience view: jobs waiting for human review
CREATE OR REPLACE VIEW public.approval_queue AS
  SELECT
    id, title, company, location, country, match_score,
    requirements, apply_url, contact_email, source, status,
    approval_status, cover_letter_preview, resume_summary_preview, created_at
  FROM public.jobs
  WHERE approval_status = 'Pending'
    AND status IN ('Found', 'Pending')
  ORDER BY match_score DESC, created_at DESC;
