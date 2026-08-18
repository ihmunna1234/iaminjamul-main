import sys
import argparse
import logging
from agent_system.graph import create_job_agent_graph

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] (%(name)s) %(message)s"
)

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    parser = argparse.ArgumentParser(
        description="Autonomous Multi-Agent Job Application & Tracker Engine"
    )
    parser.add_argument(
        "--phase",
        type=int,
        choices=[1, 2],
        default=1,
        help=(
            "Phase 1: Scout + Customize + queue for HITL review (default). "
            "Phase 2: Apply to human-approved jobs only."
        )
    )
    args = parser.parse_args()

    print("=========================================================")
    if args.phase == 1:
        print("[+] Phase 1: Job Scout + Resume Customizer + HITL Queue")
        print("    Applications will NOT be sent until you approve them.")
    else:
        print("[+] Phase 2: Auto-Apply to Human-Approved Jobs")
        print("    Only jobs you approved in the dashboard will be applied to.")
    print("=========================================================")

    orchestrator = create_job_agent_graph()

    if args.phase == 1:
        result = orchestrator.run_phase1_scout_and_customize()
        print("\n[PHASE 1 SUMMARY]")
        print(f"  Jobs discovered     : {len(result['jobs'])}")
        print(f"  Queued for review   : {len(result['jobs'])}")
        print(f"  Status              : {result['status']}")
        print("\n  --> Open your dashboard Approval Queue to review & approve applications.")
        print("  --> Then run: python -m agent_system.main --phase 2")
    else:
        result = orchestrator.run_phase2_apply_approved()
        print("\n[PHASE 2 SUMMARY]")
        print(f"  Approved jobs found : {len(result['jobs'])}")
        print(f"  Applications sent   : {len(result['applied_jobs'])}")
        print(f"  Interviews detected : {len(result['interviews'])}")
        print(f"  Status              : {result['status']}")

if __name__ == "__main__":
    main()
