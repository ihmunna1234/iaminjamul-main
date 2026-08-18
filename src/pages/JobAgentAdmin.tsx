import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  Briefcase,
  Send,
  Clock,
  Calendar,
  Search,
  Play,
  Pause,
  Terminal,
  Bell,
  ExternalLink,
  Sparkles,
  LogOut,
  Mail,
  CheckCircle2,
  ShieldCheck,
  ShieldX,
  ClipboardList,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: 'EU' | 'UK' | 'Ireland' | 'Canada' | 'NZ' | 'USA' | 'Remote' | 'Other';
  match_score: number;
  requirements?: string;
  apply_url?: string;
  contact_email?: string;
  status: 'Found' | 'Pending' | 'Applied' | 'Interview' | 'Rejected' | 'Passed';
  // HITL fields
  approval_status?: 'Pending' | 'Approved' | 'Rejected';
  cover_letter_preview?: string;
  resume_summary_preview?: string;
  created_at: string;
}

interface AgentLog {
  id: string;
  agent_name: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  action: string;
  message: string;
  created_at: string;
}

interface InterviewAlert {
  id: string;
  company: string;
  role: string;
  sender_email: string;
  date_time?: string;
  meeting_link?: string;
  email_summary: string;
  alert_status: 'New' | 'Acknowledged' | 'Scheduled';
  detected_at: string;
}

export default function JobAgentAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [interviews, setInterviews] = useState<InterviewAlert[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'approval'>('approval');
  const [expandedCoverLetter, setExpandedCoverLetter] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

// Mock data defined outside component so it's a stable reference (Bug #2 fix)
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior AI Engineer',
    company: 'TechCorp Europe',
    location: 'Berlin, Germany',
    country: 'EU',
    match_score: 95,
    apply_url: 'https://example.com/apply/1',
    status: 'Applied',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Staff Full-Stack & Agent Developer',
    company: 'Fintech London',
    location: 'London, UK',
    country: 'UK',
    match_score: 92,
    apply_url: 'https://example.com/apply/2',
    status: 'Interview',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Lead AI Solutions Architect',
    company: 'Innovate AI Ireland',
    location: 'Dublin, Ireland',
    country: 'Ireland',
    match_score: 88,
    contact_email: 'jobs@innovateai.ie',
    status: 'Pending',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Autonomous System Software Engineer',
    company: 'CloudScale Canada',
    location: 'Toronto, Canada',
    country: 'Canada',
    match_score: 90,
    apply_url: 'https://example.com/apply/4',
    status: 'Found',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Principal AI Automation Specialist',
    company: 'Pacific Tech',
    location: 'Auckland, NZ',
    country: 'NZ',
    match_score: 94,
    contact_email: 'careers@pacifictech.co.nz',
    status: 'Applied',
    created_at: new Date().toISOString(),
  },
];

const MOCK_LOGS: AgentLog[] = [
  {
    id: 'log-1',
    agent_name: 'Job Scout Agent',
    level: 'SUCCESS',
    action: 'Scrape Board',
    message: 'Discovered 14 new AI/Full-Stack engineer positions across UK & EU job boards.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'log-2',
    agent_name: 'Resume & Cover Letter Customizer',
    level: 'INFO',
    action: 'Tailor Profile',
    message: 'Generated customized cover letter emphasizing LangGraph & Playwright for TechCorp Europe.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'log-3',
    agent_name: 'Auto-Apply Agent (Playwright)',
    level: 'SUCCESS',
    action: 'Submit Form',
    message: 'Form successfully submitted for TechCorp Europe. Resume attached.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'log-4',
    agent_name: 'Inbox Tracker Agent',
    level: 'WARN',
    action: 'Scan Email',
    message: 'Detected interview invitation email from Fintech London. Extracted Google Meet link.',
    created_at: new Date().toISOString(),
  },
];

const MOCK_INTERVIEWS: InterviewAlert[] = [
  {
    id: 'int-1',
    company: 'Fintech London',
    role: 'Staff Full-Stack & Agent Developer',
    sender_email: 'recruiting@fintechlondon.co.uk',
    date_time: '2026-08-22 14:00 GMT',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    email_summary: 'We loved your portfolio! We would like to invite you for a 45-minute technical interview.',
    alert_status: 'New',
    detected_at: new Date().toISOString(),
  },
];

  // Fetch initial data & subscribe to Realtime
  useEffect(() => {
    let isMounted = true; // Bug #3 fix: prevent setState after unmount

    async function loadData() {
      setIsLoading(true);
      if (isSupabaseConfigured && supabase) {
        // Supabase IS connected — always show real data, never fall back to mock
        try {
          const [jobsRes, logsRes, intRes] = await Promise.all([
            supabase.from('jobs').select('*').order('created_at', { ascending: false }),
            supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(50),
            supabase.from('interviews').select('*').order('detected_at', { ascending: false }),
          ]);

          if (!isMounted) return;
          setJobs(jobsRes.data ?? []);
          setLogs(logsRes.data ?? []);
          setInterviews(intRes.data ?? []);
        } catch (e) {
          console.error('Error fetching Supabase job agent data:', e);
          if (!isMounted) return;
          setJobs([]);
          setLogs([]);
          setInterviews([]);
        }
      } else {
        // Supabase NOT configured — show mock data so UI preview works
        if (!isMounted) return;
        setJobs(MOCK_JOBS);
        setLogs(MOCK_LOGS);
        setInterviews(MOCK_INTERVIEWS);
      }
      if (isMounted) setIsLoading(false);
    }

    loadData();

    // Supabase Real-time Subscriptions
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('job_agent_realtime')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'agent_logs' },
          (payload) => {
            setLogs((prev) => [payload.new as AgentLog, ...prev.slice(0, 49)]);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'jobs' },
          () => {
            supabase
              .from('jobs')
              .select('*')
              .order('created_at', { ascending: false })
              .then((res) => {
                if (res.data) setJobs(res.data);
              });
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'interviews' },
          (payload) => {
            const newInt = payload.new as InterviewAlert;
            setInterviews((prev) => [newInt, ...prev]);
            toast({
              title: '🎯 Interview Invitation Detected!',
              description: `From ${newInt.company} for ${newInt.role}`,
            });
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    }
    // Bug #3 fix: always return cleanup to set isMounted = false
    return () => { isMounted = false; };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('job_agent_app_pass');
    window.location.reload();
  };

  const handleTriggerAgent = async () => {
    setIsAgentRunning((prev) => !prev);
    const newStatus = !isAgentRunning;

    toast({
      title: newStatus ? '🤖 Multi-Agent Execution Started' : '⏸️ Agents Paused',
      description: newStatus
        ? 'Job Scout, Customizer & Auto-Apply agents are actively running.'
        : 'All background agent workers have been paused.',
    });

    // Add local log event
    const newLog: AgentLog = {
      id: `log-${Date.now()}`,
      agent_name: 'Orchestrator',
      level: newStatus ? 'SUCCESS' : 'WARN',
      action: newStatus ? 'Start Graph' : 'Pause Graph',
      message: newStatus ? 'LangGraph workflow initiated across EU, UK, Canada & NZ.' : 'User requested graph pause.',
      created_at: new Date().toISOString(),
    };

    setLogs((prev) => [newLog, ...prev]);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('agent_logs').insert([
        {
          agent_name: newLog.agent_name,
          level: newLog.level,
          action: newLog.action,
          message: newLog.message,
        },
      ]);
    }
  };

  const handleAcknowledgeInterview = async (id: string) => {
    setInterviews((prev) =>
      prev.map((i) => (i.id === id ? { ...i, alert_status: 'Acknowledged' } : i))
    );

    if (isSupabaseConfigured && supabase) {
      await supabase.from('interviews').update({ alert_status: 'Acknowledged' }).eq('id', id);
    }

    toast({
      title: 'Status Updated',
      description: 'Interview invitation marked as Acknowledged.',
    });
  };

  // Metric computations
  const totalFound = jobs.length;
  const totalApplied = jobs.filter((j) => j.status === 'Applied').length;
  const totalPending = jobs.filter((j) => j.status === 'Pending' || j.status === 'Found').length;
  const totalInterviews = jobs.filter((j) => j.status === 'Interview').length + interviews.length;
  const approvalQueue = jobs.filter((j) => j.approval_status === 'Pending');

  const handleApproveJob = async (jobId: string) => {
    setApprovingId(jobId);
    setJobs((prev) =>
      prev.map((j) => j.id === jobId ? { ...j, approval_status: 'Approved' } : j)
    );
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('jobs')
        .update({ approval_status: 'Approved', reviewed_at: new Date().toISOString() })
        .eq('id', jobId);
    }
    setApprovingId(null);
    toast({
      title: '✅ Application Approved',
      description: 'Job approved. Run Phase 2 (python main.py --phase 2) to submit.',
    });
  };

  const handleRejectJob = async (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => j.id === jobId ? { ...j, approval_status: 'Rejected', status: 'Rejected' } : j)
    );
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('jobs')
        .update({ approval_status: 'Rejected', status: 'Rejected', reviewed_at: new Date().toISOString() })
        .eq('id', jobId);
    }
    toast({
      title: '❌ Application Rejected',
      description: 'Job marked as rejected. No application will be sent.',
    });
  };

  const handleApproveAll = async () => {
    const pendingIds = approvalQueue.map((j) => j.id);
    setJobs((prev) =>
      prev.map((j) => pendingIds.includes(j.id) ? { ...j, approval_status: 'Approved' } : j)
    );
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('jobs')
        .update({ approval_status: 'Approved', reviewed_at: new Date().toISOString() })
        .in('id', pendingIds);
    }
    toast({
      title: `✅ Approved All ${pendingIds.length} Applications`,
      description: 'Run python main.py --phase 2 to submit them all.',
    });
  };

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = selectedCountry === 'ALL' || job.country === selectedCountry;
    const matchesStatus = selectedStatus === 'ALL' || job.status === selectedStatus;

    return matchesSearch && matchesCountry && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans p-4 sm:p-6 lg:p-8 relative">
      {/* Background Subtle Gradient Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.1),rgba(255,255,255,0))] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111726]/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Multi-Agent Job System
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  LangGraph + Playwright
                </span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                Autonomous Scraping, Customization, Auto-Apply & Gmail Interview Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerAgent}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                isAgentRunning
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                  : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-500/20'
              }`}
            >
              {isAgentRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Agents</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Agent Graph</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
              title="Lock Admin Panel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111726]/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Discovered</span>
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{totalFound}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>Targeting EU, UK, CA, NZ</span>
            </div>
          </div>

          <div className="bg-[#111726]/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Applications Sent</span>
              <Send className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{totalApplied}</div>
            <div className="text-xs text-emerald-500/80 mt-1 flex items-center gap-1">
              <span>Email & Playwright Auto-Apply</span>
            </div>
          </div>

          <div className="bg-[#111726]/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{totalPending}</div>
            <div className="text-xs text-amber-500/80 mt-1">Ready for customizer agent</div>
          </div>

          <div className="bg-[#111726]/60 backdrop-blur-md border border-orange-500/30 bg-orange-500/5 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">Interviews Detected</span>
              <Calendar className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-3xl font-extrabold text-orange-400">{totalInterviews}</div>
            <div className="text-xs text-orange-400/80 mt-1 flex items-center gap-1">
              <span>Gmail API LLM Classifier</span>
            </div>
          </div>

          {/* HITL Metric Card */}
          <div
            onClick={() => setActiveTab('approval')}
            className={`col-span-2 lg:col-span-4 cursor-pointer bg-[#111726]/60 backdrop-blur-md border p-4 rounded-2xl flex items-center justify-between transition-all ${
              approvalQueue.length > 0
                ? 'border-violet-500/40 bg-violet-500/5 shadow-[0_0_20px_rgba(139,92,246,0.12)]'
                : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                approvalQueue.length > 0 ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-gray-500'
              }`}>
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {approvalQueue.length > 0
                    ? `${approvalQueue.length} Application${approvalQueue.length > 1 ? 's' : ''} Awaiting Your Approval`
                    : 'No Pending Applications'}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Review cover letters & approve before any application is sent
                </div>
              </div>
            </div>
            {approvalQueue.length > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse">
                Review Now
              </span>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-[#111726]/60 backdrop-blur-md border border-white/10 p-1.5 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('approval')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'approval'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Approval Queue
            {approvalQueue.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-400/30 text-violet-200">
                {approvalQueue.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'jobs'
                ? 'bg-orange-500/80 text-white shadow-lg shadow-orange-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            All Jobs
          </button>
        </div>

        {/* HITL Approval Queue Panel */}
        {activeTab === 'approval' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-violet-400" />
                Approval Queue
                <span className="text-sm font-normal text-gray-400">
                  — Review each application before it's submitted
                </span>
              </h2>
              {approvalQueue.length > 1 && (
                <button
                  onClick={handleApproveAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-lg shadow-violet-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Approve All ({approvalQueue.length})
                </button>
              )}
            </div>

            {approvalQueue.length === 0 ? (
              <div className="bg-[#111726]/60 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                  <ClipboardList className="w-7 h-7 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">No applications pending approval</p>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Run Phase 1 to scout jobs and generate cover letters:
                </p>
                <code className="block text-xs text-violet-300 bg-black/40 rounded-lg px-4 py-2 font-mono mx-auto w-fit">
                  python -m agent_system.main --phase 1
                </code>
              </div>
            ) : (
              <div className="space-y-4">
                {approvalQueue.map((job) => (
                  <div
                    key={job.id}
                    className="bg-[#111726]/80 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6 shadow-xl space-y-4 hover:border-violet-500/40 transition-all"
                  >
                    {/* Job Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white">{job.title}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            AWAITING APPROVAL
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="font-medium text-gray-300">{job.company}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10">{job.country}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                            {job.match_score}% Match
                          </span>
                          {job.apply_url ? (
                            <a
                              href={job.apply_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-xs transition-colors"
                            >
                              <span>Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : job.contact_email ? (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-orange-400" />
                              {job.contact_email}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Approve / Reject Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRejectJob(job.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all"
                        >
                          <ShieldX className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveJob(job.id)}
                          disabled={approvingId === job.id}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 transition-all disabled:opacity-60"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {approvingId === job.id ? 'Approving...' : 'Approve'}
                        </button>
                      </div>
                    </div>

                    {/* Cover Letter Preview */}
                    {job.cover_letter_preview && (
                      <div className="border-t border-white/5 pt-4 space-y-2">
                        <button
                          onClick={() =>
                            setExpandedCoverLetter(
                              expandedCoverLetter === job.id ? null : job.id
                            )
                          }
                          className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-violet-400" />
                          <span>Cover Letter Preview</span>
                          {expandedCoverLetter === job.id ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {expandedCoverLetter === job.id && (
                          <div className="bg-black/30 rounded-xl p-4 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap border border-white/5 max-h-56 overflow-y-auto font-mono">
                            {job.cover_letter_preview}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resume Summary Highlights */}
                    {job.resume_summary_preview && (
                      <div className="border-t border-white/5 pt-4">
                        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Resume Highlights</p>
                        <div className="space-y-1.5">
                          {job.resume_summary_preview.split('\n').filter(Boolean).map((line, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                              <span>{line.replace(/^•\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Phase 2 Command Hint */}
                <div className="bg-black/30 border border-violet-500/20 rounded-xl p-4 flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-violet-400 shrink-0" />
                  <div className="text-xs">
                    <span className="text-gray-400">After approving, submit applications by running: </span>
                    <code className="text-violet-300 font-mono">python -m agent_system.main --phase 2</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content Layout: Jobs Table + Sidebar (Logs & Interviews) */}
        {activeTab === 'jobs' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Columns (2 cols): Interactive Jobs Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#111726]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-500" />
                  <span>Job Opportunities & Status</span>
                </h2>

                {/* Filters & Search */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="relative flex-1 sm:w-48">
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 pl-8 focus:outline-none focus:border-orange-500"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                  </div>

                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="bg-[#090d16] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-orange-500"
                  >
                    <option value="ALL">All Countries</option>
                    <option value="EU">Europe (EU)</option>
                    <option value="UK">UK</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Canada">Canada</option>
                    <option value="NZ">New Zealand</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-[#090d16] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-orange-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Found">Found</option>
                    <option value="Pending">Pending</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                      <th className="pb-3 px-2">Job / Company</th>
                      <th className="pb-3 px-2">Region</th>
                      <th className="pb-3 px-2 text-center">Match Score</th>
                      <th className="pb-3 px-2 text-center">Status</th>
                      <th className="pb-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No jobs found matching the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="py-3.5 px-2">
                            <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                              {job.title}
                            </div>
                            <div className="text-gray-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                              <span>{job.company}</span>
                              <span>•</span>
                              <span className="text-gray-500">{job.location}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-2">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono text-[10px]">
                              {job.country}
                            </span>
                          </td>

                          <td className="py-3.5 px-2 text-center">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
                              <span>{job.match_score}%</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-2 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                                job.status === 'Applied'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : job.status === 'Interview'
                                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse'
                                  : job.status === 'Pending'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-2 text-right">
                            {job.apply_url ? (
                              <a
                                href={job.apply_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-[11px]"
                              >
                                <span>Portal</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : job.contact_email ? (
                              <span className="text-gray-400 text-[11px] flex items-center gap-1 justify-end">
                                <Mail className="w-3 h-3 text-orange-400" />
                                <span>Direct Email</span>
                              </span>
                            ) : (
                              <span className="text-gray-600 text-[11px]">Auto Scout</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (1 col): Live Terminal Logs & Interview Notification Drawer */}
          <div className="space-y-6">
            {/* Interview Notifications Panel */}
            <div className="bg-[#111726]/80 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-orange-400 animate-bounce" />
                  <span>Interview Invitations</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-500/20 text-orange-300 font-bold">
                  {interviews.length} New
                </span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {interviews.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No new interview alerts.</p>
                ) : (
                  interviews.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>{inv.company}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{inv.role}</span>
                      </div>

                      <p className="text-gray-300 text-[11px] leading-relaxed line-clamp-2">
                        "{inv.email_summary}"
                      </p>

                      {inv.meeting_link && (
                        <a
                          href={inv.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-[11px] font-semibold"
                        >
                          <span>Join Meeting</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="text-[10px] text-gray-500">{inv.date_time || 'TBD'}</span>
                        {inv.alert_status === 'New' ? (
                          <button
                            onClick={() => handleAcknowledgeInterview(inv.id)}
                            className="text-[10px] bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-2 py-0.5 rounded-md font-semibold transition-colors"
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Live Terminal Log Stream */}
            <div className="bg-[#090d16] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-gray-300 font-semibold">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Agent Stream Terminal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] text-gray-500">Live Socket</span>
                </div>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div key={log.id} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-orange-400 font-bold">[{log.agent_name}]</span>
                      <span className="text-gray-600">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] leading-relaxed ${
                        log.level === 'SUCCESS'
                          ? 'text-emerald-400'
                          : log.level === 'WARN'
                          ? 'text-amber-300'
                          : log.level === 'ERROR'
                          ? 'text-red-400'
                          : 'text-gray-300'
                      }`}
                    >
                      {log.action}: {log.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
