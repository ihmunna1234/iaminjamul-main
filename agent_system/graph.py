import logging
from typing import TypedDict, List, Dict, Any, Optional
from agent_system.db import SupabaseManager
from agent_system.agents.job_scout import JobScoutAgent
from agent_system.agents.resume_customizer import ResumeCustomizerAgent
from agent_system.agents.auto_apply import AutoApplyAgent
from agent_system.inbox.gmail_tracker import InboxTrackerAgent

logger = logging.getLogger("agent_system.graph")

class AgentState(TypedDict):
    jobs: List[Dict[str, Any]]
    current_job: Optional[Dict[str, Any]]
    customized_job: Optional[Dict[str, Any]]
    applied_jobs: List[Dict[str, Any]]
    interviews: List[Dict[str, Any]]
    status: str

class MultiAgentOrchestrator:
    def __init__(self):
        self.db = SupabaseManager()
        self.scout_agent = JobScoutAgent(self.db)
        self.customizer_agent = ResumeCustomizerAgent(self.db)
        self.apply_agent = AutoApplyAgent(self.db)
        self.inbox_agent = InboxTrackerAgent(self.db)

    # ------------------------------------------------------------------
    # PHASE 1: Scout + Customize → queue for human review (HITL gate)
    # ------------------------------------------------------------------
    def run_phase1_scout_and_customize(self) -> AgentState:
        """
        Discovers jobs and generates customized cover letters / resume summaries.
        STOPS before applying — queues each job in the Approval Queue (approval_status='Pending').
        Human must approve in the dashboard before any application is sent.
        """
        self.db.log_agent_activity(
            "Orchestrator", "INFO", "Phase 1 Start",
            "Phase 1: Job Scout + Customizer running. Applications will WAIT for human approval."
        )

        state: AgentState = {
            "jobs": [], "current_job": None, "customized_job": None,
            "applied_jobs": [], "interviews": [], "status": "PHASE1_RUNNING"
        }

        # Step 1: Discover jobs
        state["jobs"] = self.scout_agent.run()

        # Step 2: Customize each job — then queue for HITL review instead of applying
        queued = 0
        for job in state["jobs"]:
            state["current_job"] = job
            customized = self.customizer_agent.run(job)
            state["customized_job"] = customized

            job_id = customized.get("id")
            cover_letter = customized.get("custom_cover_letter", "")
            resume_summary = customized.get("custom_resume_summary", "")

            if job_id:
                # HITL GATE: save content + mark as awaiting review
                self.db.set_awaiting_approval(job_id, cover_letter, resume_summary)
                queued += 1
                self.db.log_agent_activity(
                    "Orchestrator", "WARN", "HITL Gate",
                    f"Job '{customized.get('title')}' at '{customized.get('company')}' queued for your review. "
                    f"Open the Approval Queue in your dashboard to approve or reject."
                )
            else:
                # No real DB id (mock mode) — log and continue
                self.db.log_agent_activity(
                    "Orchestrator", "INFO", "HITL Gate (Mock)",
                    f"Mock mode: '{customized.get('title')}' customized. Run with Supabase to enable approval queue."
                )

        state["status"] = "AWAITING_HUMAN_APPROVAL"
        self.db.log_agent_activity(
            "Orchestrator", "SUCCESS", "Phase 1 Complete",
            f"Phase 1 finished. {queued} job(s) queued in Approval Queue. "
            f"Review & approve in your dashboard, then run Phase 2."
        )
        return state

    # ------------------------------------------------------------------
    # PHASE 2: Apply to human-approved jobs only
    # ------------------------------------------------------------------
    def run_phase2_apply_approved(self) -> AgentState:
        """
        Picks up all jobs with approval_status='Approved' and submits applications.
        Also scans inbox for interview invitations.
        Only runs AFTER human approval in the dashboard.
        """
        self.db.log_agent_activity(
            "Orchestrator", "INFO", "Phase 2 Start",
            "Phase 2: Fetching human-approved jobs and submitting applications..."
        )

        state: AgentState = {
            "jobs": [], "current_job": None, "customized_job": None,
            "applied_jobs": [], "interviews": [], "status": "PHASE2_RUNNING"
        }

        # Fetch only approved jobs from DB
        approved_jobs = self.db.get_approved_jobs()
        state["jobs"] = approved_jobs

        if not approved_jobs:
            self.db.log_agent_activity(
                "Orchestrator", "WARN", "No Approved Jobs",
                "No approved jobs found. Approve applications in the dashboard first, then re-run Phase 2."
            )
            state["status"] = "NO_APPROVED_JOBS"
            return state

        # Apply to each approved job
        for job in approved_jobs:
            state["current_job"] = job
            applied_res = self.apply_agent.run(job)
            state["applied_jobs"].append(applied_res)

        # Scan inbox for interview invitations
        state["interviews"] = self.inbox_agent.scan_inbox()

        state["status"] = "COMPLETED"
        self.db.log_agent_activity(
            "Orchestrator", "SUCCESS", "Phase 2 Complete",
            f"Phase 2 finished. Applications submitted: {len(state['applied_jobs'])}, "
            f"Interviews detected: {len(state['interviews'])}."
        )
        return state

    # ------------------------------------------------------------------
    # Legacy full-run (kept for backwards compatibility / testing)
    # ------------------------------------------------------------------
    def run_graph(self) -> AgentState:
        """
        Legacy: runs scout + customize + HITL queue in one go (Phase 1 only).
        Call run_phase2_apply_approved() separately after human review.
        """
        return self.run_phase1_scout_and_customize()

def create_job_agent_graph():
    """Returns executable graph orchestrator."""
    return MultiAgentOrchestrator()
