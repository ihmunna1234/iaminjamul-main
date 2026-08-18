-- =======================================================
-- Candidate Profile & Targeting Schema
-- Allows dynamic candidate data for multi-agent system
-- =======================================================

CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL DEFAULT 'Injamul Islam',
    email TEXT NOT NULL DEFAULT 'injamul@iaminjamul.com',
    phone TEXT NOT NULL DEFAULT '+966582822130',
    location TEXT NOT NULL DEFAULT 'Riyadh, Saudi Arabia',
    portfolio_url TEXT NOT NULL DEFAULT 'https://www.iaminjamul.com',
    linkedin_url TEXT NOT NULL DEFAULT 'https://linkedin.com/in/iaminjamul',
    github_url TEXT DEFAULT 'https://github.com/ihmunna1234',
    headline TEXT NOT NULL DEFAULT 'Senior Full-Stack AI Engineer',
    experience_years TEXT NOT NULL DEFAULT '5+ years',
    bio TEXT NOT NULL DEFAULT '5+ years building autonomous AI systems, scalable full-stack web applications, multi-agent workflows, and real-time dashboards.',
    skills TEXT NOT NULL DEFAULT 'React, Next.js, TypeScript, Python, LangGraph, CrewAI, OpenAI, Playwright, Supabase, Node.js, Tailwind CSS, PostgreSQL, REST APIs',
    target_roles JSONB NOT NULL DEFAULT '["Senior AI Engineer", "Staff Full-Stack Engineer", "AI Agent Developer", "Solutions Architect", "Lead Software Engineer"]'::jsonb,
    target_countries JSONB NOT NULL DEFAULT '["EU", "UK", "Ireland", "Canada", "NZ", "USA", "Remote"]'::jsonb,
    min_match_score INT NOT NULL DEFAULT 85,
    resume_pdf_path TEXT DEFAULT 'assets/Injamul_Islam_Resume.pdf',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for candidate_profiles" ON public.candidate_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public write access for candidate_profiles" ON public.candidate_profiles FOR ALL USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidate_profiles;

-- Seed default profile if not exists
INSERT INTO public.candidate_profiles (id, full_name, email, phone, location, portfolio_url, linkedin_url, github_url, headline, experience_years, bio, skills, target_roles, target_countries, min_match_score)
SELECT '00000000-0000-0000-0000-000000000001'::uuid, 'Injamul Islam', 'injamul@iaminjamul.com', '+966582822130', 'Riyadh, Saudi Arabia', 'https://www.iaminjamul.com', 'https://linkedin.com/in/iaminjamul', 'https://github.com/ihmunna1234', 'Senior Full-Stack AI Engineer', '5+ years', '5+ years building autonomous AI systems, scalable full-stack web applications, multi-agent workflows, and real-time dashboards.', 'React, Next.js, TypeScript, Python, LangGraph, CrewAI, OpenAI, Playwright, Supabase, Node.js, Tailwind CSS, PostgreSQL, REST APIs', '["Senior AI Engineer", "Staff Full-Stack Engineer", "AI Agent Developer", "Solutions Architect", "Lead Software Engineer"]'::jsonb, '["EU", "UK", "Ireland", "Canada", "NZ", "USA", "Remote"]'::jsonb, 85
WHERE NOT EXISTS (SELECT 1 FROM public.candidate_profiles LIMIT 1);
