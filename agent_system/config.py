import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("VITE_SUPABASE_ANON_KEY", ""))
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    GMAIL_CREDENTIALS_PATH = os.getenv("GMAIL_CREDENTIALS_PATH", "credentials.json")
    GMAIL_TOKEN_PATH = os.getenv("GMAIL_TOKEN_PATH", "token.json")
    RESUME_PDF_PATH = os.getenv("RESUME_PDF_PATH", "assets/Injamul_Islam_Resume.pdf")
    
    TARGET_ROLES = [
        "Senior AI Engineer",
        "Staff Full-Stack Engineer",
        "AI Agent Developer",
        "Solutions Architect",
        "Lead Software Engineer"
    ]
    
    TARGET_REGIONS = ["EU", "UK", "Ireland", "Canada", "NZ"]
