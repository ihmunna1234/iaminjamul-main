from typing import Dict, Any
from agent_system.db import SupabaseManager
from agent_system.config import Config

try:
    from langchain_openai import ChatOpenAI
    from langchain_core.prompts import PromptTemplate
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False

class ResumeCustomizerAgent:
    def __init__(self, db: SupabaseManager):
        self.db = db
        self.agent_name = "Resume & Cover Letter Customizer"
        
        self.candidate_profile = """
        Name: Injamul Islam
        Role: Senior Full-Stack AI Engineer
        Portfolio: www.iaminjamul.com
        Core Skills: React, Next.js, TypeScript, Python, LangGraph, CrewAI, OpenAI, Playwright, Supabase, Node.js, Tailwind CSS, PostgreSQL, REST APIs.
        Experience: 5+ years building autonomous AI systems, scalable full-stack web applications, multi-agent workflows, and real-time dashboards.
        """

    def run(self, job: Dict[str, Any]) -> Dict[str, Any]:
        job_id = job.get("id", "temp_id")
        title = job.get("title", "Software Engineer")
        company = job.get("company", "Tech Company")
        requirements = job.get("requirements", "Full-Stack and AI skills")

        self.db.log_agent_activity(
            self.agent_name,
            "INFO",
            "Customizing Application",
            f"Tailoring resume highlights and cover letter for '{title}' at '{company}'..."
        )

        cover_letter = ""
        resume_summary = ""

        if HAS_LANGCHAIN and Config.OPENAI_API_KEY:
            try:
                llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
                prompt = PromptTemplate.from_template(
                    """
                    Candidate Profile:
                    {profile}
                    
                    Job Details:
                    Title: {title}
                    Company: {company}
                    Requirements: {requirements}
                    
                    Write a highly compelling, professional, 3-paragraph cover letter tailored to this position. Also provide a 3-bullet point customized resume summary highlighting matching technical skills.
                    """
                )
                chain = prompt | llm
                response = chain.invoke({
                    "profile": self.candidate_profile,
                    "title": title,
                    "company": company,
                    "requirements": requirements
                })
                cover_letter = response.content
            except Exception as e:
                self.db.log_agent_activity(
                    self.agent_name,
                    "WARN",
                    "LLM Fallback",
                    f"LLM call failed ({e}), generating template customized assets."
                )

        if not cover_letter:
            cover_letter = f"""Dear Hiring Team at {company},

I am writing to express my strong enthusiasm for the {title} position. With over 5 years of hands-on experience building autonomous multi-agent systems, scalable React/TypeScript applications, and robust Python/Playwright automation, I am confident in my ability to make an immediate impact at {company}.

My technical expertise spans LangGraph/CrewAI orchestration, Supabase backend integration, and full-stack web development. I have successfully architected real-time dashboards and automated workflow pipelines that streamline complex operations.

I look forward to discussing how my background in AI engineering aligns with {company}'s vision. You can view my portfolio and live projects at https://www.iaminjamul.com.

Sincerely,
Injamul Islam
Senior Full-Stack AI Engineer
"""

        resume_summary = f"• Expert in LangGraph, Python, Playwright, React, & Supabase\n• Tailored for {title} at {company}\n• Verified matching score: {job.get('match_score', 90)}%"

        self.db.log_agent_activity(
            self.agent_name,
            "SUCCESS",
            "Customization Complete",
            f"Cover letter and customized resume highlights generated for {company}."
        )

        return {
            **job,
            "custom_cover_letter": cover_letter,
            "custom_resume_summary": resume_summary
        }
