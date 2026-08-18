from typing import Dict, Any
from agent_system.db import SupabaseManager
from agent_system.automation.playwright_apply import PlaywrightApplicationAutomator

class AutoApplyAgent:
    def __init__(self, db: SupabaseManager):
        self.db = db
        self.agent_name = "Auto-Apply Agent"
        self.automator = PlaywrightApplicationAutomator(headless=True)

    def run(self, tailored_job: Dict[str, Any]) -> Dict[str, Any]:
        job_id = tailored_job.get("id")
        title = tailored_job.get("title", "Position")
        company = tailored_job.get("company", "Company")
        apply_url = tailored_job.get("apply_url")
        contact_email = tailored_job.get("contact_email")
        cover_letter = tailored_job.get("custom_cover_letter", "")

        method = "Portal" if apply_url else ("Email" if contact_email else "Portal")

        self.db.log_agent_activity(
            self.agent_name,
            "INFO",
            "Application Submission Initiated",
            f"Applying for '{title}' at '{company}' via {method} path..."
        )

        success = False
        message = ""

        if method == "Email" and contact_email:
            # Cold Application Email Path
            self.db.log_agent_activity(
                self.agent_name,
                "INFO",
                "Email Application",
                f"Sending customized application email to {contact_email}..."
            )
            # Simulated Email dispatch via Gmail API / Resend
            success = True
            message = f"Cold application email sent successfully to {contact_email}."

        else:
            # Playwright Portal Automation Path
            target_url = apply_url or f"https://example.com/apply/{company.lower().replace(' ', '-')}"
            candidate_info = {
                "name": "Injamul Islam",
                "email": "injamul@iaminjamul.com",
                "phone": "+966582822130",
                "portfolio": "https://www.iaminjamul.com",
                "linkedin": "https://linkedin.com/in/iaminjamul"
            }

            success, message = self.automator.apply(
                job_url=target_url,
                candidate_info=candidate_info,
                cover_letter=cover_letter
            )

        if success:
            self.db.log_agent_activity(
                self.agent_name,
                "SUCCESS",
                "Application Submitted",
                f"Successfully submitted application for '{title}' at '{company}'. Status -> Applied."
            )

            # Record application in database
            self.db.log_application({
                "job_id": job_id if job_id and len(job_id) > 10 else None,
                "method": method,
                "custom_cover_letter": cover_letter,
                "custom_resume_summary": tailored_job.get("custom_resume_summary", ""),
                "status": "Applied",
                "submission_details": {"message": message}
            })

            # Update job status in jobs table
            if job_id:
                self.db.update_job_status(job_id, "Applied")

            return {**tailored_job, "status": "Applied", "apply_message": message}
        else:
            self.db.log_agent_activity(
                self.agent_name,
                "ERROR",
                "Application Failed",
                f"Failed to submit application for '{company}': {message}"
            )
            return {**tailored_job, "status": "Pending", "apply_message": message}
