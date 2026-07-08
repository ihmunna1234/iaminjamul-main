-- ============================================================
-- Supabase Database Setup for Personal AI Agent
-- 
-- Run this in the Supabase SQL Editor:
-- https://app.supabase.com → Your Project → SQL Editor → New Query
-- ============================================================

-- 1. Create table for captured leads
CREATE TABLE IF NOT EXISTS ai_leads (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  whatsapp_number     TEXT,
  company_name        TEXT,
  project_type        TEXT,
  budget_range        TEXT,
  timeline            TEXT,
  project_description TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create table for conversation sessions
CREATE TABLE IF NOT EXISTS ai_conversations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     TEXT UNIQUE NOT NULL,
  user_name      TEXT,
  user_email     TEXT,
  messages_count INTEGER DEFAULT 0,
  lead_qualified BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create table for storing conversation messages (history/analytics)
CREATE TABLE IF NOT EXISTS ai_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL, -- 'user', 'assistant'
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE ai_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- 5. Policies for ai_leads (Capture leads from client side)
CREATE POLICY "Public can insert leads"
  ON ai_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated (admin) can select leads"
  ON ai_leads FOR SELECT
  TO authenticated
  USING (true);

-- 6. Policies for ai_conversations (Create & update sessions from client side)
CREATE POLICY "Public can manage conversations"
  ON ai_conversations FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 7. Policies for ai_messages (Save messages from client side)
CREATE POLICY "Public can manage messages"
  ON ai_messages FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 8. Verify Table Creation
SELECT 'AI Agent tables created successfully!' AS status;
