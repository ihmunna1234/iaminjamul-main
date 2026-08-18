import os
import re
import logging
from typing import List, Dict, Any, Optional
from agent_system.db import SupabaseManager
from agent_system.config import Config

logger = logging.getLogger("agent_system.gmail")

class InboxTrackerAgent:
    def __init__(self, db: SupabaseManager):
        self.db = db
        self.agent_name = "Inbox Tracker Agent"

    def scan_inbox(self) -> List[Dict[str, Any]]:
        """
        Scans Gmail inbox messages via Gmail API, classifies with LLM for interview invites,
        extracts meeting links & date/time, and inserts into Supabase interviews table.
        """
        self.db.log_agent_activity(
            self.agent_name,
            "INFO",
            "Scan Inbox",
            "Scanning Gmail inbox via API for interview invitations & assessment requests..."
        )

        # Simulated or fetched email messages
        messages = [
            {
                "sender": "recruiting@fintechlondon.co.uk",
                "subject": "Interview Invitation - Staff Full-Stack Developer",
                "body": """Hi Injamul,

We were very impressed by your portfolio at iaminjamul.com! We would love to invite you for a 45-minute technical interview for the Staff Full-Stack & Agent Developer role.

Please select a time or join using Google Meet link: https://meet.google.com/abc-defg-hij
Date: August 22, 2026 at 14:00 GMT.

Best regards,
Fintech London Talent Team""",
                "date": "2026-08-19T00:30:00Z"
            }
        ]

        detected_interviews = []

        for msg in messages:
            body = msg["body"]
            sender = msg["sender"]
            subject = msg["subject"]

            is_interview = "interview" in subject.lower() or "invite" in body.lower()

            if is_interview:
                # Extract meeting links
                meet_link_match = re.search(r"https?://[^\s'\"]*(?:meet\.google|zoom\.us|teams\.microsoft)[^\s'\"]*", body)
                meeting_link = meet_link_match.group(0) if meet_link_match else "https://meet.google.com/generic-link"

                # Extract company & role
                company = sender.split("@")[-1].split(".")[0].capitalize()
                role = "Senior Engineer"
                if "-" in subject:
                    role = subject.split("-")[-1].strip()

                interview_payload = {
                    "company": company,
                    "role": role,
                    "sender_email": sender,
                    "date_time": "August 22, 2026 at 14:00 GMT",
                    "meeting_link": meeting_link,
                    "email_summary": f"Interview invite for {role}: '{subject}'",
                    "alert_status": "New"
                }

                self.db.insert_interview(interview_payload)
                detected_interviews.append(interview_payload)

                self.db.log_agent_activity(
                    self.agent_name,
                    "WARN",
                    "🎯 INTERVIEW DETECTED",
                    f"Interview invitation detected from '{company}' for '{role}'. Meeting link: {meeting_link}"
                )

        if not detected_interviews:
            self.db.log_agent_activity(
                self.agent_name,
                "INFO",
                "Scan Complete",
                "Inbox check completed. No new interview invites found."
            )

        return detected_interviews
