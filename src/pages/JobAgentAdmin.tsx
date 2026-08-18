import React, { useState, useEffect } from 'react';
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
  User,
  Globe,
  Phone,
  MapPin,
  Linkedin,
  Github,
  FileText,
  Plus,
  Trash2,
  Sliders,
  Save,
  Check
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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

export interface CandidateProfile {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
  headline: string;
  experience_years: string;
  bio: string;
  skills: string;
  target_roles: string[];
  target_countries: string[];
  min_match_score: number;
  resume_pdf_path: string;
}

const DEFAULT_PROFILE: CandidateProfile = {
  full_name: 'Injamul Islam',
  email: 'injamul@iaminjamul.com',
  phone: '+966582822130',
  location: 'Riyadh, Saudi Arabia',
  portfolio_url: 'https://www.iaminjamul.com',
  linkedin_url: 'https://linkedin.com/in/iaminjamul',
  github_url: 'https://github.com/ihmunna1234',
  headline: 'Senior Full-Stack AI Engineer',
  experience_years: '5+ years',
  bio: '5+ years building autonomous AI systems, scalable full-stack web applications, multi-agent workflows, and real-time dashboards.',
  skills: 'React, Next.js, TypeScript, Python, LangGraph, CrewAI, OpenAI, Playwright, Supabase, Node.js, Tailwind CSS, PostgreSQL, REST APIs',
  target_roles: [
    'Senior AI Engineer',
    'Staff Full-Stack Engineer',
    'AI Agent Developer',
    'Solutions Architect',
    'Lead Software Engineer'
  ],
  target_countries: ['EU', 'UK', 'Ireland', 'Canada', 'NZ', 'USA', 'Remote'],
  min_match_score: 85,
  resume_pdf_path: 'assets/Injamul_Islam_Resume.pdf'
};

const AVAILABLE_COUNTRIES = ['EU', 'UK', 'Ireland', 'Canada', 'NZ', 'USA', 'Remote'];

// Fallback preview data when Supabase is not configured
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior AI Engineer',
    company: 'TechCorp Europe',
    location: 'Berlin, Germany',
    country: 'EU',
    match_score: 95,
    apply_url: 'https://example.com/apply/1',
    status: 'Pending',
    approval_status: 'Pending',
    cover_letter_preview: 'Dear Hiring Team,\n\nI am writing to express my strong enthusiasm for the Senior AI Engineer position. With extensive experience in LangGraph, Python automation, and modern React full-stack development, I am eager to contribute to your engineering team.\n\nBest regards,\nInjamul Islam',
    resume_summary_preview: '• Expert in LangGraph, Python, Playwright, React, & Supabase\n• 5+ years building scalable AI systems and full-stack applications\n• Verified matching score: 95%',
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
    approval_status: 'Approved',
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
    approval_status: 'Pending',
    cover_letter_preview: 'Dear Innovate AI Team,\n\nI would love to apply for the Lead AI Solutions Architect role. My background combines enterprise LLM agent design with resilient cloud architectures.\n\nSincerely,\nInjamul Islam',
    resume_summary_preview: '• Architected enterprise AI pipelines & multi-agent systems\n• Proven track record in TypeScript, Python, and cloud infrastructure\n• Verified matching score: 88%',
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
    status: 'Applied',
    approval_status: 'Approved',
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
    approval_status: 'Approved',
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

export default function JobAgentAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [interviews, setInterviews] = useState<InterviewAlert[]>([]);
  const [profile, setProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState('');
  
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'approval' | 'jobs'>('profile');
  const [expandedCoverLetter, setExpandedCoverLetter] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Fetch initial data & subscribe to Realtime
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      if (isSupabaseConfigured && supabase) {
        try {
          const [jobsRes, logsRes, intRes, profileRes] = await Promise.all([
            supabase.from('jobs').select('*').order('created_at', { ascending: false }),
            supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(50),
            supabase.from('interviews').select('*').order('detected_at', { ascending: false }),
            supabase.from('candidate_profiles').select('*').limit(1),
          ]);

          if (!isMounted) return;
          setJobs(jobsRes.data ?? []);
          setLogs(logsRes.data ?? []);
          setInterviews(intRes.data ?? []);

          if (profileRes.data && profileRes.data.length > 0) {
            const dbProfile = profileRes.data[0];
            setProfile({
              id: dbProfile.id,
              full_name: dbProfile.full_name || DEFAULT_PROFILE.full_name,
              email: dbProfile.email || DEFAULT_PROFILE.email,
              phone: dbProfile.phone || DEFAULT_PROFILE.phone,
              location: dbProfile.location || DEFAULT_PROFILE.location,
              portfolio_url: dbProfile.portfolio_url || DEFAULT_PROFILE.portfolio_url,
              linkedin_url: dbProfile.linkedin_url || DEFAULT_PROFILE.linkedin_url,
              github_url: dbProfile.github_url || DEFAULT_PROFILE.github_url,
              headline: dbProfile.headline || DEFAULT_PROFILE.headline,
              experience_years: dbProfile.experience_years || DEFAULT_PROFILE.experience_years,
              bio: dbProfile.bio || DEFAULT_PROFILE.bio,
              skills: dbProfile.skills || DEFAULT_PROFILE.skills,
              target_roles: Array.isArray(dbProfile.target_roles)
                ? dbProfile.target_roles
                : DEFAULT_PROFILE.target_roles,
              target_countries: Array.isArray(dbProfile.target_countries)
                ? dbProfile.target_countries
                : DEFAULT_PROFILE.target_countries,
              min_match_score: dbProfile.min_match_score || DEFAULT_PROFILE.min_match_score,
              resume_pdf_path: dbProfile.resume_pdf_path || DEFAULT_PROFILE.resume_pdf_path,
            });
          }
        } catch (e) {
          console.error('Error fetching Supabase job agent data:', e);
          if (!isMounted) return;
          setJobs([]);
          setLogs([]);
          setInterviews([]);
        }
      } else {
        if (!isMounted) return;
        setJobs(MOCK_JOBS);
        setLogs(MOCK_LOGS);
        setInterviews(MOCK_INTERVIEWS);
      }
      if (isMounted) setIsLoading(false);
    }

    loadData();

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

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('job_agent_app_pass');
    window.location.reload();
  };

  // Save Candidate Profile
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingProfile(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (profile.id) {
          await supabase
            .from('candidate_profiles')
            .update({
              full_name: profile.full_name,
              email: profile.email,
              phone: profile.phone,
              location: profile.location,
              portfolio_url: profile.portfolio_url,
              linkedin_url: profile.linkedin_url,
              github_url: profile.github_url,
              headline: profile.headline,
              experience_years: profile.experience_years,
              bio: profile.bio,
              skills: profile.skills,
              target_roles: profile.target_roles,
              target_countries: profile.target_countries,
              min_match_score: profile.min_match_score,
              resume_pdf_path: profile.resume_pdf_path,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);
        } else {
          const res = await supabase.from('candidate_profiles').insert([profile]).select();
          if (res.data && res.data.length > 0) {
            setProfile((prev) => ({ ...prev, id: res.data[0].id }));
          }
        }
      }

      toast({
        title: '✅ Candidate Profile Saved',
        description: 'Agent targeting and candidate information updated successfully.',
      });
    } catch (err: any) {
      console.error('Error saving profile:', err);
      toast({
        title: 'Error Saving Profile',
        description: err.message || 'Please check your connection.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddTargetRole = () => {
    if (!newRoleInput.trim()) return;
    if (!profile.target_roles.includes(newRoleInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        target_roles: [...prev.target_roles, newRoleInput.trim()]
      }));
    }
    setNewRoleInput('');
  };

  const handleRemoveTargetRole = (roleToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      target_roles: prev.target_roles.filter((r) => r !== roleToRemove)
    }));
  };

  const handleToggleCountry = (country: string) => {
    setProfile((prev) => {
      const exists = prev.target_countries.includes(country);
      return {
        ...prev,
        target_countries: exists
          ? prev.target_countries.filter((c) => c !== country)
          : [...prev.target_countries, country]
      };
    });
  };

  const handleTriggerAgent = async () => {
    setIsAgentRunning((prev) => !prev);
    const newStatus = !isAgentRunning;

    toast({
      title: newStatus ? '🤖 Multi-Agent Execution Started' : '⏸️ Agents Paused',
      description: newStatus
        ? `Job Scout is targeting: ${profile.target_roles.slice(0, 2).join(', ')}...`
        : 'All background agent workers have been paused.',
    });

    const newLog: AgentLog = {
      id: `log-${Date.now()}`,
      agent_name: 'Orchestrator',
      level: newStatus ? 'SUCCESS' : 'WARN',
      action: newStatus ? 'Start Graph' : 'Pause Graph',
      message: newStatus
        ? `Autonomous workflow initiated for ${profile.full_name} targeting ${profile.target_countries.join(', ')}.`
        : 'User requested workflow pause.',
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

  const handleApproveJob = async (jobId: string) => {
    setApprovingId(jobId);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, approval_status: 'Approved' } : j))
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
      prev.map((j) =>
        j.id === jobId ? { ...j, approval_status: 'Rejected', status: 'Rejected' } : j
      )
    );
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('jobs')
        .update({
          approval_status: 'Rejected',
          status: 'Rejected',
          reviewed_at: new Date().toISOString(),
        })
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
      prev.map((j) => (pendingIds.includes(j.id) ? { ...j, approval_status: 'Approved' } : j))
    );
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('jobs')
        .update({ approval_status: 'Approved', reviewed_at: new Date().toISOString() })
        .in('id', pendingIds);
    }
    toast({
      title: `✅ Approved All ${pendingIds.length} Applications`,
      description: 'Run python -m agent_system.main --phase 2 to submit them all.',
    });
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

  // Filtered jobs for table
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
    <div className="min-h-screen bg-[#F9F9F7] text-[#121212] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Editorial Page Header */}
          <div className="bg-white border border-[#E5E5E0] p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#FF5733]/25 text-[#FF5733] bg-[#FF5733]/5 font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Multi-Agent System</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#121212]">
                <span className="font-serif italic font-medium">Job Application</span>{' '}
                <span className="font-sans font-black text-[#FF5733]">Control Center</span>
              </h1>
              <p className="text-[#666666] text-sm max-w-2xl leading-relaxed">
                Autonomous job scouting, real-time AI cover letter generation, human-in-the-loop review queue, and automated application submissions for{' '}
                <span className="font-semibold text-[#121212]">{profile.full_name}</span>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleTriggerAgent}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all shadow-md ${
                  isAgentRunning
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                    : 'bg-[#FF5733] hover:bg-[#E64D2B] text-white shadow-[#FF5733]/25 hover:shadow-lg hover:shadow-[#FF5733]/30'
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
                className="p-3 rounded-full bg-white hover:bg-[#F9F9F7] text-[#666666] hover:text-[#121212] border border-[#E5E5E0] transition-colors shadow-sm"
                title="Lock Admin Panel"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-[#E5E5E0] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-[#666666] mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider font-sans">Total Scouted</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#121212] font-sans">{totalFound}</div>
              <div className="text-xs text-[#888888] mt-2">Targeting {profile.target_countries.slice(0, 3).join(', ')}...</div>
            </div>

            <div className="bg-white border border-[#E5E5E0] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-[#666666] mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider font-sans">Applications Sent</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-sans">{totalApplied}</div>
              <div className="text-xs text-[#888888] mt-2">Auto-Apply & Portal Fill</div>
            </div>

            <div className="bg-white border border-[#E5E5E0] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-[#666666] mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider font-sans">Pending Review</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-600 font-sans">{totalPending}</div>
              <div className="text-xs text-[#888888] mt-2">Awaiting customization</div>
            </div>

            <div className="bg-white border border-[#FF5733]/25 bg-[#FF5733]/[0.02] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-[#666666] mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5733] font-sans">Interviews</span>
                <div className="w-8 h-8 rounded-full bg-[#FF5733]/10 text-[#FF5733] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#FF5733] font-sans">{totalInterviews}</div>
              <div className="text-xs text-[#FF5733]/80 mt-2">Gmail API LLM Tracker</div>
            </div>
          </div>

          {/* Interactive HITL Review Banner */}
          <div
            onClick={() => setActiveTab('approval')}
            className={`cursor-pointer bg-white border p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              approvalQueue.length > 0
                ? 'border-[#FF5733]/40 shadow-md shadow-[#FF5733]/5 hover:border-[#FF5733]'
                : 'border-[#E5E5E0] shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  approvalQueue.length > 0
                    ? 'bg-[#FF5733]/10 text-[#FF5733]'
                    : 'bg-[#F9F9F7] text-gray-400'
                }`}
              >
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-[#121212]">
                  {approvalQueue.length > 0
                    ? `${approvalQueue.length} Application${
                        approvalQueue.length > 1 ? 's' : ''
                      } Awaiting Your Approval (Human-in-the-Loop)`
                    : 'All Caught Up • No Pending Applications'}
                </div>
                <div className="text-xs text-[#666666] mt-0.5">
                  Review customized cover letters and tailored resume highlights before any application is submitted.
                </div>
              </div>
            </div>

            {approvalQueue.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#FF5733] text-white shadow-md shadow-[#FF5733]/20 self-start sm:self-auto shrink-0 animate-pulse">
                <span>Review Applications ({approvalQueue.length})</span>
              </span>
            )}
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-2 bg-white border border-[#E5E5E0] p-1.5 rounded-full w-fit shadow-sm flex-wrap">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#FF5733] text-white shadow-md shadow-[#FF5733]/25'
                  : 'text-[#666666] hover:text-[#121212]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Candidate Profile & Targeting</span>
            </button>

            <button
              onClick={() => setActiveTab('approval')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'approval'
                  ? 'bg-[#FF5733] text-white shadow-md shadow-[#FF5733]/25'
                  : 'text-[#666666] hover:text-[#121212]'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Approval Queue</span>
              {approvalQueue.length > 0 && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'approval'
                      ? 'bg-white text-[#FF5733]'
                      : 'bg-[#FF5733]/10 text-[#FF5733]'
                  }`}
                >
                  {approvalQueue.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-[#FF5733] text-white shadow-md shadow-[#FF5733]/25'
                  : 'text-[#666666] hover:text-[#121212]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>All Opportunities</span>
            </button>
          </div>

          {/* TAB 1: Candidate Profile & Agent Targeting */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#121212] flex items-center gap-2">
                    <User className="w-6 h-6 text-[#FF5733]" />
                    <span>Candidate Profile & Targeting Engine</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#666666] mt-1">
                    The autonomous multi-agent system uses this profile to scout tailored jobs, customize cover letters, and fill application portals on your behalf.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  disabled={isSavingProfile}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#FF5733] hover:bg-[#E64D2B] text-white shadow-md shadow-[#FF5733]/25 hover:shadow-lg transition-all disabled:opacity-60 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-8">
                
                {/* 1. Profile Summary Card */}
                <div className="bg-white border border-[#E5E5E0] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-[#E5E5E0] pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF5733]/10 text-[#FF5733] flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#121212]">Personal & Contact Information</h3>
                      <p className="text-xs text-[#666666]">Used by Playwright automator to fill ATS forms and contact fields.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733] pl-10"
                          placeholder="e.g. Injamul Islam"
                          required
                        />
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733] pl-10"
                          placeholder="e.g. injamul@iaminjamul.com"
                          required
                        />
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733] pl-10"
                          placeholder="e.g. +966582822130"
                          required
                        />
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                        Current Location / Country
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733] pl-10"
                          placeholder="e.g. Riyadh, Saudi Arabia"
                          required
                        />
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Links & Online Presence */}
                <div className="bg-white border border-[#E5E5E0] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-[#E5E5E0] pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF5733]/10 text-[#FF5733] flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#121212]">Online Presence & Portfolio Links</h3>
                      <p className="text-xs text-[#666666]">Injected into cover letters and auto-filled into ATS application forms.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                        Portfolio Website URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={profile.portfolio_url}
                          onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
                          className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733] pl-10"
                          placeholder="https://www.iaminjamul.com"
                          required
                        />
                        <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                        LinkedIn Profile URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={profile.linkedin_url}
                          onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                          className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733] pl-10"
                          placeholder="https://linkedin.com/in/iaminjamul"
                          required
                        />
                        <Linkedin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                        GitHub Profile URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={profile.github_url}
                          onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                          className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733] pl-10"
                          placeholder="https://github.com/ihmunna1234"
                        />
                        <Github className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Professional Profile & Bio */}
                <div className="bg-white border border-[#E5E5E0] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-[#E5E5E0] pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF5733]/10 text-[#FF5733] flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#121212]">Professional Background & Experience</h3>
                      <p className="text-xs text-[#666666]">Feeds the LLM Cover Letter Generator with customized context.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                        Professional Headline / Primary Role
                      </label>
                      <input
                        type="text"
                        value={profile.headline}
                        onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                        className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733]"
                        placeholder="e.g. Senior Full-Stack AI Engineer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        value={profile.experience_years}
                        onChange={(e) => setProfile({ ...profile, experience_years: e.target.value })}
                        className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733]"
                        placeholder="e.g. 5+ years"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                      Professional Bio & Experience Summary
                    </label>
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl p-4 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733] leading-relaxed"
                      placeholder="Briefly describe your career achievements, main technologies, and value proposition..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                      Core Skills & Technical Stack (Comma Separated)
                    </label>
                    <textarea
                      rows={2}
                      value={profile.skills}
                      onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                      className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl p-4 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733]"
                      placeholder="e.g. React, Next.js, TypeScript, Python, LangGraph, Playwright, Supabase"
                      required
                    />
                    
                    {/* Live skills badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {profile.skills
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F9F9F7] border border-[#E5E5E0] text-[#121212]"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* 4. Target Roles & Geographical Regions */}
                <div className="bg-white border border-[#E5E5E0] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-[#E5E5E0] pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF5733]/10 text-[#FF5733] flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#121212]">Job Scout Targeting & Preferences</h3>
                      <p className="text-xs text-[#666666]">Determines which roles and countries the Job Scout Agent will discover.</p>
                    </div>
                  </div>

                  {/* Target Roles */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                      Target Job Titles
                    </label>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.target_roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/25"
                        >
                          <span>{role}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTargetRole(role)}
                            className="hover:opacity-75"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        value={newRoleInput}
                        onChange={(e) => setNewRoleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTargetRole();
                          }
                        }}
                        placeholder="Add custom target title..."
                        className="flex-1 bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#FF5733]"
                      />
                      <button
                        type="button"
                        onClick={handleAddTargetRole}
                        className="px-4 py-2 rounded-2xl text-xs font-semibold bg-white border border-[#E5E5E0] hover:bg-[#F9F9F7] text-[#121212] flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Target Countries */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                      Target Geographical Regions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_COUNTRIES.map((c) => {
                        const isSelected = profile.target_countries.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleToggleCountry(c)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                              isSelected
                                ? 'bg-[#FF5733] text-white border-[#FF5733] shadow-sm shadow-[#FF5733]/25'
                                : 'bg-[#F9F9F7] text-[#666666] border-[#E5E5E0] hover:bg-white hover:text-[#121212]'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{c}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Minimum Match Score Threshold */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                        Minimum Match Score Threshold
                      </label>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/20">
                        {profile.min_match_score}% Match
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={profile.min_match_score}
                      onChange={(e) => setProfile({ ...profile, min_match_score: parseInt(e.target.value) })}
                      className="w-full h-2 bg-[#E5E5E0] rounded-lg appearance-none cursor-pointer accent-[#FF5733]"
                    />
                    <p className="text-xs text-[#888888] mt-1.5">
                      The scout agent will only shortlist job postings that meet or exceed this matching confidence.
                    </p>
                  </div>
                </div>

                {/* 5. Resume File & Document Path */}
                <div className="bg-white border border-[#E5E5E0] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-[#E5E5E0] pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF5733]/10 text-[#FF5733] flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#121212]">Resume File & PDF Path</h3>
                      <p className="text-xs text-[#666666]">Path to your PDF resume for Playwright automatic upload.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                      Resume PDF File Path (Local or Assets)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.resume_pdf_path}
                        onChange={(e) => setProfile({ ...profile, resume_pdf_path: e.target.value })}
                        className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] text-sm focus:outline-none focus:border-[#FF5733] pl-10 font-mono"
                        placeholder="assets/Injamul_Islam_Resume.pdf"
                      />
                      <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                {/* Save Button Row */}
                <div className="flex items-center justify-end gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold bg-[#FF5733] hover:bg-[#E64D2B] text-white shadow-md shadow-[#FF5733]/25 hover:shadow-lg transition-all disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingProfile ? 'Saving...' : 'Save Profile & Update Agents'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Human-in-the-Loop Approval Queue */}
          {activeTab === 'approval' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#121212] flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-[#FF5733]" />
                    <span>Application Approval Queue</span>
                  </h2>
                  <p className="text-xs text-[#666666] mt-0.5">
                    Carefully review customized cover letters. Applications will only be submitted after your approval.
                  </p>
                </div>

                {approvalQueue.length > 1 && (
                  <button
                    onClick={handleApproveAll}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#FF5733] hover:bg-[#E64D2B] text-white shadow-md shadow-[#FF5733]/20 transition-all self-start sm:self-auto"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve All ({approvalQueue.length})</span>
                  </button>
                )}
              </div>

              {approvalQueue.length === 0 ? (
                <div className="bg-white border border-[#E5E5E0] rounded-3xl p-12 text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-[#FF5733]/10 text-[#FF5733] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-[#121212]">No Applications Pending Review</h3>
                  <p className="text-[#666666] text-xs max-w-md mx-auto leading-relaxed">
                    To scout new jobs and generate tailored cover letters, run Phase 1 from your terminal:
                  </p>
                  <div className="inline-block bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-5 py-2.5 text-xs text-[#121212] font-mono">
                    python -m agent_system.main --phase 1
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {approvalQueue.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white border border-[#E5E5E0] hover:border-[#FF5733]/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6"
                    >
                      {/* Card Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-bold text-[#121212]">{job.title}</h3>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                              Awaiting Approval
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {job.match_score}% Match
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#666666] flex-wrap">
                            <span className="font-semibold text-[#121212]">{job.company}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-md bg-[#F9F9F7] border border-[#E5E5E0] font-mono text-[10px]">
                              {job.country}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs pt-1">
                            {job.apply_url ? (
                              <a
                                href={job.apply_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[#FF5733] hover:underline font-medium"
                              >
                                <span>View Portal Posting</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : job.contact_email ? (
                              <span className="text-[#666666] flex items-center gap-1.5 font-medium">
                                <Mail className="w-3.5 h-3.5 text-[#FF5733]" />
                                <span>{job.contact_email}</span>
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Approve / Reject Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0 self-start">
                          <button
                            onClick={() => handleRejectJob(job.id)}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all"
                          >
                            <ShieldX className="w-4 h-4" />
                            <span>Reject</span>
                          </button>

                          <button
                            onClick={() => handleApproveJob(job.id)}
                            disabled={approvingId === job.id}
                            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#FF5733] hover:bg-[#E64D2B] text-white shadow-md shadow-[#FF5733]/25 hover:shadow-lg transition-all disabled:opacity-60"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{approvingId === job.id ? 'Approving...' : 'Approve Application'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Expandable Cover Letter */}
                      {job.cover_letter_preview && (
                        <div className="border-t border-[#E5E5E0] pt-4 space-y-2">
                          <button
                            onClick={() =>
                              setExpandedCoverLetter(
                                expandedCoverLetter === job.id ? null : job.id
                              )
                            }
                            className="flex items-center gap-2 text-xs font-semibold text-[#121212] hover:text-[#FF5733] transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#FF5733]" />
                            <span>Preview Customized Cover Letter</span>
                            {expandedCoverLetter === job.id ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#FF5733]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
                            )}
                          </button>

                          {expandedCoverLetter === job.id && (
                            <div className="bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl p-5 text-xs text-[#121212] leading-relaxed whitespace-pre-wrap font-mono max-h-64 overflow-y-auto animate-fade-in">
                              {job.cover_letter_preview}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Resume Highlights */}
                      {job.resume_summary_preview && (
                        <div className="border-t border-[#E5E5E0] pt-4 space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                            Tailored Resume Highlights
                          </span>
                          <div className="space-y-1.5">
                            {job.resume_summary_preview
                              .split('\n')
                              .filter(Boolean)
                              .map((line, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-[#333333]">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                  <span>{line.replace(/^•\s*/, '')}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Terminal Command Tip */}
                  <div className="bg-white border border-[#E5E5E0] rounded-2xl p-5 flex items-center gap-3 text-xs text-[#666666] shadow-sm">
                    <Terminal className="w-4 h-4 text-[#FF5733] shrink-0" />
                    <div>
                      <span>Once you approve the positions above, trigger submission with: </span>
                      <code className="text-[#121212] font-mono font-bold bg-[#F9F9F7] px-2.5 py-1 rounded-md border border-[#E5E5E0] ml-1">
                        python -m agent_system.main --phase 2
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: All Opportunities Table + Logs */}
          {activeTab === 'jobs' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column (2 cols): Jobs Table */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-[#E5E5E0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  
                  {/* Filters Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-[#121212] flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#FF5733]" />
                      <span>All Discovered Opportunities</span>
                    </h2>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <div className="relative flex-1 sm:w-48">
                        <input
                          type="text"
                          placeholder="Search positions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-full px-3.5 py-1.5 text-xs text-[#121212] placeholder-gray-400 pl-8 focus:outline-none focus:border-[#FF5733]"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      </div>

                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="bg-[#F9F9F7] border border-[#E5E5E0] rounded-full px-3 py-1.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF5733]"
                      >
                        <option value="ALL">All Regions</option>
                        <option value="EU">Europe (EU)</option>
                        <option value="UK">UK</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Canada">Canada</option>
                        <option value="NZ">New Zealand</option>
                      </select>

                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-[#F9F9F7] border border-[#E5E5E0] rounded-full px-3 py-1.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF5733]"
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
                        <tr className="border-b border-[#E5E5E0] text-[#666666] font-semibold uppercase tracking-wider">
                          <th className="pb-3 px-3">Position / Company</th>
                          <th className="pb-3 px-3">Region</th>
                          <th className="pb-3 px-3 text-center">Match</th>
                          <th className="pb-3 px-3 text-center">Status</th>
                          <th className="pb-3 px-3 text-right">Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E0]">
                        {filteredJobs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-10 text-center text-[#888888]">
                              No opportunities match your filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-[#F9F9F7] transition-colors group">
                              <td className="py-4 px-3">
                                <div className="font-bold text-[#121212] group-hover:text-[#FF5733] transition-colors">
                                  {job.title}
                                </div>
                                <div className="text-[#666666] text-[11px] flex items-center gap-1.5 mt-0.5">
                                  <span>{job.company}</span>
                                  <span>•</span>
                                  <span>{job.location}</span>
                                </div>
                              </td>

                              <td className="py-4 px-3">
                                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F9F9F7] border border-[#E5E5E0] text-[#333333] font-mono text-[10px]">
                                  {job.country}
                                </span>
                              </td>

                              <td className="py-4 px-3 text-center">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                                  {job.match_score}%
                                </span>
                              </td>

                              <td className="py-4 px-3 text-center">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold border ${
                                    job.status === 'Applied'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : job.status === 'Interview'
                                      ? 'bg-[#FF5733]/10 text-[#FF5733] border-[#FF5733]/30 animate-pulse'
                                      : job.status === 'Pending'
                                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </td>

                              <td className="py-4 px-3 text-right">
                                {job.apply_url ? (
                                  <a
                                    href={job.apply_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[#FF5733] hover:underline text-[11px] font-medium"
                                  >
                                    <span>Portal</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ) : job.contact_email ? (
                                  <span className="text-[#666666] text-[11px] flex items-center gap-1 justify-end font-medium">
                                    <Mail className="w-3 h-3 text-[#FF5733]" />
                                    <span>Email</span>
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-[11px]">Scout Auto</span>
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

              {/* Right Column (1 col): Live Terminal & Interview Alerts */}
              <div className="space-y-6">
                
                {/* Interview Alerts Card */}
                <div className="bg-white border border-[#FF5733]/30 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#121212] flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#FF5733]" />
                      <span>Interview Invitations</span>
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#FF5733]/10 text-[#FF5733] font-bold">
                      {interviews.length} New
                    </span>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {interviews.length === 0 ? (
                      <p className="text-xs text-[#888888] text-center py-6">No new interview alerts detected.</p>
                    ) : (
                      interviews.map((inv) => (
                        <div
                          key={inv.id}
                          className="p-4 rounded-2xl bg-[#F9F9F7] border border-[#E5E5E0] space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-[#121212]">
                            <span>{inv.company}</span>
                            <span className="text-[10px] text-[#666666] font-normal">{inv.role}</span>
                          </div>

                          <p className="text-[#444444] text-[11px] leading-relaxed line-clamp-2">
                            "{inv.email_summary}"
                          </p>

                          {inv.meeting_link && (
                            <a
                              href={inv.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#FF5733] hover:underline text-[11px] font-semibold"
                            >
                              <span>Join Meeting Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E0]">
                            <span className="text-[10px] text-[#888888]">{inv.date_time || 'TBD'}</span>
                            {inv.alert_status === 'New' ? (
                              <button
                                onClick={() => handleAcknowledgeInterview(inv.id)}
                                className="text-[10px] bg-[#FF5733] hover:bg-[#E64D2B] text-white px-3 py-1 rounded-full font-medium transition-colors"
                              >
                                Acknowledge
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3" /> Acknowledged
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Developer Log Console */}
                <div className="bg-[#121824] text-white border border-black/10 rounded-3xl p-6 shadow-md space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 text-gray-200 font-semibold">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>Agent Activity Terminal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-[10px] text-gray-400">Live Socket</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {logs.map((log) => (
                      <div key={log.id} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#FF5733] font-bold">[{log.agent_name}]</span>
                          <span className="text-gray-500">
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
      </main>

      <Footer />
    </div>
  );
}

