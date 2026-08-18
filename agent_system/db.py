import logging
from typing import List, Dict, Any, Optional
from supabase import create_client, Client
from agent_system.config import Config

logger = logging.getLogger("agent_system.db")

class SupabaseManager:
    def __init__(self):
        if Config.SUPABASE_URL and Config.SUPABASE_SERVICE_ROLE_KEY:
            self.client: Optional[Client] = create_client(
                Config.SUPABASE_URL, Config.SUPABASE_SERVICE_ROLE_KEY
            )
        else:
            self.client = None
            logger.warning("Supabase URL or Key not set. Operating in mock mode.")

    def log_agent_activity(self, agent_name: str, level: str, action: str, message: str, metadata: Optional[dict] = None):
        """Inserts real-time log event into agent_logs table for dashboard streaming."""
        logger.info(f"[{agent_name}] [{level}] {action}: {message}")
        if self.client:
            try:
                self.client.table("agent_logs").insert({
                    "agent_name": agent_name,
                    "level": level,
                    "action": action,
                    "message": message,
                    "metadata": metadata or {}
                }).execute()
            except Exception as e:
                logger.error(f"Failed to log to Supabase: {e}")

    def insert_job(self, job_data: dict) -> Optional[dict]:
        """Inserts job into jobs table."""
        if self.client:
            try:
                res = self.client.table("jobs").insert(job_data).execute()
                return res.data[0] if res.data else None
            except Exception as e:
                logger.error(f"Failed to insert job: {e}")
                return None
        return job_data

    def get_pending_jobs(self) -> List[dict]:
        """Fetches jobs with status 'Found' or 'Pending'."""
        if self.client:
            try:
                res = self.client.table("jobs").select("*").in_("status", ["Found", "Pending"]).execute()
                return res.data or []
            except Exception as e:
                logger.error(f"Failed to fetch pending jobs: {e}")
                return []
        return []

    def update_job_status(self, job_id: str, status: str):
        """Updates job status."""
        if self.client:
            try:
                self.client.table("jobs").update({"status": status}).eq("id", job_id).execute()
            except Exception as e:
                logger.error(f"Failed to update job status: {e}")

    def log_application(self, application_data: dict):
        """Inserts application record."""
        if self.client:
            try:
                self.client.table("applications").insert(application_data).execute()
            except Exception as e:
                logger.error(f"Failed to insert application: {e}")

    def insert_interview(self, interview_data: dict):
        """Inserts interview invitation alert."""
        if self.client:
            try:
                self.client.table("interviews").insert(interview_data).execute()
            except Exception as e:
                logger.error(f"Failed to insert interview: {e}")

    # -------------------------------------------------------
    # Human-in-the-Loop (HITL) methods
    # -------------------------------------------------------

    def set_awaiting_approval(self, job_id: str, cover_letter: str, resume_summary: str):
        """
        Saves generated cover letter & resume summary to the job row,
        then sets approval_status = 'Pending' so the admin dashboard
        shows it in the Approval Queue.
        """
        if self.client:
            try:
                self.client.table("jobs").update({
                    "approval_status": "Pending",
                    "cover_letter_preview": cover_letter,
                    "resume_summary_preview": resume_summary,
                    "status": "Pending"
                }).eq("id", job_id).execute()
                logger.info(f"[HITL] Job {job_id} queued for human review.")
            except Exception as e:
                logger.error(f"[HITL] Failed to set awaiting approval for {job_id}: {e}")

    def get_approved_jobs(self) -> List[dict]:
        """Fetches jobs that the human has approved but not yet applied to."""
        if self.client:
            try:
                res = (
                    self.client.table("jobs")
                    .select("*")
                    .eq("approval_status", "Approved")
                    .in_("status", ["Pending", "Found"])
                    .execute()
                )
                return res.data or []
            except Exception as e:
                logger.error(f"[HITL] Failed to fetch approved jobs: {e}")
                return []
        return []

    def approve_job(self, job_id: str, notes: str = ""):
        """Marks a job as approved by the human reviewer."""
        if self.client:
            try:
                self.client.table("jobs").update({
                    "approval_status": "Approved",
                    "reviewed_at": "now()",
                    "review_notes": notes
                }).eq("id", job_id).execute()
                logger.info(f"[HITL] Job {job_id} approved by human reviewer.")
            except Exception as e:
                logger.error(f"[HITL] Failed to approve job {job_id}: {e}")

    def reject_job(self, job_id: str, notes: str = ""):
        """Marks a job as rejected by the human reviewer — no application will be sent."""
        if self.client:
            try:
                self.client.table("jobs").update({
                    "approval_status": "Rejected",
                    "status": "Rejected",
                    "reviewed_at": "now()",
                    "review_notes": notes
                }).eq("id", job_id).execute()
                logger.info(f"[HITL] Job {job_id} rejected by human reviewer.")
            except Exception as e:
                logger.error(f"[HITL] Failed to reject job {job_id}: {e}")

