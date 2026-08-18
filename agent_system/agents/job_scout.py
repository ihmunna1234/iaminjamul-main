from typing import List, Dict, Any
from agent_system.db import SupabaseManager
from agent_system.config import Config

class JobScoutAgent:
    def __init__(self, db: SupabaseManager):
        self.db = db
        self.agent_name = "Job Scout Agent"

    def run(self) -> List[Dict[str, Any]]:
        self.db.log_agent_activity(
            self.agent_name,
            "INFO",
            "Scout Search",
            f"Initiating target search across {', '.join(Config.TARGET_REGIONS)} for roles: {', '.join(Config.TARGET_ROLES[:3])}..."
        )

        # Mock / Scraped job findings for target tech roles in EU, UK, Ireland, Canada, NZ
        discovered_jobs = [
            {
                "title": "Senior AI & Automation Engineer",
                "company": "NextGen Systems UK",
                "location": "London, United Kingdom",
                "country": "UK",
                "match_score": 96,
                "requirements": "Proficient in Python, LangGraph, React, TypeScript, Playwright, Supabase, and LLM orchestration.",
                "apply_url": "https://careers.nextgensystems.co.uk/apply/ai-engineer",
                "status": "Found",
                "source": "Reed UK"
            },
            {
                "title": "Staff Full-Stack Agent Developer",
                "company": "Europai Tech Labs",
                "location": "Dublin, Ireland",
                "country": "Ireland",
                "match_score": 93,
                "requirements": "Full-Stack AI Lead with experience building multi-agent graphs, Node/React dashboards, and automated pipelines.",
                "contact_email": "recruitment@europai.ie",
                "status": "Found",
                "source": "LinkedIn Ireland"
            },
            {
                "title": "Principal AI Solutions Architect",
                "company": "Maple AI Solutions",
                "location": "Vancouver, Canada",
                "country": "Canada",
                "match_score": 90,
                "requirements": "Designing scalable LLM applications, Supabase/PGVector, LangChain/LangGraph, and cloud automation.",
                "apply_url": "https://jobbank.gc.ca/viewjob/maple-ai-architect",
                "status": "Found",
                "source": "JobBank Canada"
            },
            {
                "title": "Lead Software Engineer - Autonomous Systems",
                "company": "Southern Cross Tech",
                "location": "Auckland, New Zealand",
                "country": "NZ",
                "match_score": 91,
                "requirements": "Full stack experience with Python, TypeScript, Playwright automation, and API integration.",
                "contact_email": "careers@southerncrosstech.co.nz",
                "status": "Found",
                "source": "Seek NZ"
            }
        ]

        inserted_count = 0
        inserted_jobs = []

        for job in discovered_jobs:
            res = self.db.insert_job(job)
            if res:
                inserted_jobs.append(res)
                inserted_count += 1

        self.db.log_agent_activity(
            self.agent_name,
            "SUCCESS",
            "Scout Complete",
            f"Successfully scouted and indexed {inserted_count} high-match positions into database."
        )

        return inserted_jobs
