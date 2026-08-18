-- =======================================================
-- Autonomous Job Application & Tracking System Schema
-- =======================================================

-- 1. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    country TEXT NOT NULL CHECK (country IN ('EU', 'UK', 'Ireland', 'Canada', 'NZ', 'USA', 'Remote', 'Other')),
    match_score INT DEFAULT 0 CHECK (match_score BETWEEN 0 AND 100),
    requirements TEXT,
    apply_url TEXT,
    contact_email TEXT,
    source TEXT DEFAULT 'Scout Agent',
    status TEXT DEFAULT 'Found' CHECK (status IN ('Found', 'Pending', 'Applied', 'Interview', 'Rejected', 'Passed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    method TEXT NOT NULL CHECK (method IN ('Email', 'Portal', 'Manual')),
    custom_cover_letter TEXT,
    custom_resume_summary TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Submitted', 'Applied', 'Interview', 'Assessment', 'Rejected')),
    submission_details JSONB DEFAULT '{}'::jsonb,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Agent Logs Table (For real-time streaming to frontend dashboard)
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('INFO', 'SUCCESS', 'WARN', 'ERROR')),
    action TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Interviews Table (Detected by Gmail Tracker Agent)
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    date_time TEXT,
    meeting_link TEXT,
    email_summary TEXT NOT NULL,
    alert_status TEXT DEFAULT 'New' CHECK (alert_status IN ('New', 'Acknowledged', 'Scheduled')),
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_country ON public.jobs(country);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_match_score ON public.jobs(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created ON public.agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interviews_detected ON public.interviews(detected_at DESC);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access for dashboard (or service role access)
CREATE POLICY "Allow public read access for jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Allow public write access for jobs" ON public.jobs FOR ALL USING (true);

CREATE POLICY "Allow public read access for applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Allow public write access for applications" ON public.applications FOR ALL USING (true);

CREATE POLICY "Allow public read access for agent_logs" ON public.agent_logs FOR SELECT USING (true);
CREATE POLICY "Allow public write access for agent_logs" ON public.agent_logs FOR ALL USING (true);

CREATE POLICY "Allow public read access for interviews" ON public.interviews FOR SELECT USING (true);
CREATE POLICY "Allow public write access for interviews" ON public.interviews FOR ALL USING (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interviews;
