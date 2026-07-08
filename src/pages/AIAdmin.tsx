import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  RefreshCw,
  LogOut,
  User,
  Bot
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp_number?: string;
  company_name?: string;
  project_type?: string;
  budget_range?: string;
  timeline?: string;
  project_description: string;
  created_at: string;
}

interface Conversation {
  id: string;
  session_id: string;
  user_name?: string;
  user_email?: string;
  messages_count: number;
  lead_qualified: boolean;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export default function AIAdmin() {
  const { toast } = useToast();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  
  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'conversations'>('leads');

  // Check auth session on load
  useEffect(() => {
    const auth = sessionStorage.getItem('ai_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch dashboard data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Fetch Leads
        const { data: dbLeads, error: leadsErr } = await supabase
          .from('ai_leads')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (leadsErr) throw leadsErr;
        setLeads(dbLeads || []);

        // Fetch Conversations
        const { data: dbConvs, error: convsErr } = await supabase
          .from('ai_conversations')
          .select('*')
          .order('updated_at', { ascending: false });

        if (convsErr) throw convsErr;
        setConversations(dbConvs || []);

      } else {
        // LocalStorage fallback
        const localLeads = JSON.parse(localStorage.getItem('ai_local_leads') || '[]');
        const localConvs = JSON.parse(localStorage.getItem('ai_local_conversations') || '[]');
        
        // Sort
        localLeads.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        localConvs.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        
        setLeads(localLeads);
        setConversations(localConvs);
        
        toast({
          title: 'Offline Mode (Local Storage)',
          description: 'Supabase is not configured. Displaying local data from this browser.',
        });
      }
    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error loading data',
        description: error.message || 'Could not fetch dashboard contents.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessagesForConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: dbMsgs, error: msgsErr } = await supabase
          .from('ai_messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true });

        if (msgsErr) throw msgsErr;
        setMessages(dbMsgs || []);
      } else {
        // LocalStorage fallback for messages
        const allLocalMsgs = JSON.parse(localStorage.getItem('ai_local_messages') || '[]');
        const filteredMsgs = allLocalMsgs.filter((msg: any) => msg.conversation_id === conv.id);
        filteredMsgs.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setMessages(filteredMsgs);
      }
    } catch (error: any) {
      console.error('Error fetching conversation messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversation transcript.',
        variant: 'destructive',
      });
    }
  };

  // Trigger fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default secret passcode is 'injamul-admin'
    if (passcode === 'injamul-admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('ai_admin_auth', 'true');
      toast({
        title: 'Access Granted',
        description: 'Welcome to the Personal AI Agent Dashboard.',
      });
    } else {
      toast({
        title: 'Access Denied',
        description: 'Incorrect admin passcode. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ai_admin_auth');
    setSelectedConversation(null);
    setMessages([]);
  };

  // Compute analytics metrics
  const totalConvs = conversations.length;
  const qualifiedLeadsCount = leads.length;
  const conversionRate = totalConvs > 0 ? ((qualifiedLeadsCount / totalConvs) * 100).toFixed(1) : '0.0';
  
  const totalMessagesCount = conversations.reduce((acc, c) => acc + (c.messages_count || 0), 0);
  const avgMessages = totalConvs > 0 ? (totalMessagesCount / totalConvs).toFixed(1) : '0.0';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-black/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF5733]" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-[#FF5733]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#121212] uppercase font-sans">
              Admin Portal
            </h1>
            <p className="text-[#666666] text-xs font-medium mt-2">
              Enter passcode to access Personal AI Agent analytics & leads.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="passcode" className="block text-[10px] text-[#666666]/50 uppercase font-semibold tracking-wide mb-2">
                Passcode
              </label>
              <input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                required
                className="h-12 w-full bg-[#F9F9F7] border border-black/5 text-[#121212] placeholder-[#666666]/30 rounded-xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5733] focus:border-[#FF5733] transition-all font-mono text-center tracking-widest text-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#121212] hover:bg-[#FF5733] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md group"
            >
              Access Dashboard
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#121212] font-sans pb-16">
      {/* Navbar */}
      <nav className="bg-white border-b border-black/5 py-4 px-6 md:px-12 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif font-medium text-lg italic">Injamul's</span>
            <span className="font-sans font-black text-[#FF5733] uppercase text-sm tracking-wide">AI Admin Panel</span>
            {!isSupabaseConfigured && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                LOCAL FALLBACK
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-black/5 hover:bg-black/5 text-[#666666] transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors border border-red-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#666666]/60 uppercase tracking-wider">Conversations</span>
              <div className="w-8 h-8 rounded-lg bg-[#FF5733]/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-[#FF5733]" />
              </div>
            </div>
            <p className="text-3xl font-black font-sans">{totalConvs}</p>
            <p className="text-[10px] text-[#666666] mt-1">Total chat widget sessions</p>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#666666]/60 uppercase tracking-wider">Captured Leads</span>
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-black font-sans text-green-600">{qualifiedLeadsCount}</p>
            <p className="text-[10px] text-[#666666] mt-1">Qualified project requests</p>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#666666]/60 uppercase tracking-wider">Conversion Rate</span>
              <div className="w-8 h-8 rounded-lg bg-[#FF5733]/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#FF5733]" />
              </div>
            </div>
            <p className="text-3xl font-black font-sans text-[#FF5733]">{conversionRate}%</p>
            <p className="text-[10px] text-[#666666] mt-1">Sessions converted to leads</p>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#666666]/60 uppercase tracking-wider">Engagement</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-black font-sans">{avgMessages}</p>
            <p className="text-[10px] text-[#666666] mt-1">Avg. messages per session</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-black/5 pb-4 mb-8">
          <button
            onClick={() => { setActiveTab('leads'); setSelectedConversation(null); }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'leads'
                ? 'bg-[#121212] text-white shadow-sm'
                : 'border border-black/10 text-[#666666] hover:text-[#FF5733] bg-transparent'
            }`}
          >
            Leads Directory ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'conversations'
                ? 'bg-[#121212] text-white shadow-sm'
                : 'border border-black/10 text-[#666666] hover:text-[#FF5733] bg-transparent'
            }`}
          >
            Chat History Logs ({conversations.length})
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'leads' ? (
          <div className="grid gap-6">
            {leads.length === 0 ? (
              <div className="bg-white border border-black/5 rounded-3xl p-16 text-center shadow-sm">
                <Users className="w-12 h-12 text-[#666666]/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#121212] mb-1">No Leads Captured Yet</h3>
                <p className="text-[#666666] text-sm max-w-sm mx-auto">
                  When visitors share project details with Injamul's AI Twin, they will appear here.
                </p>
              </div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm hover:border-[#FF5733]/25 transition-all relative group">
                  <div className="absolute top-0 right-0 p-6 text-xs text-[#666666]/40 font-mono">
                    {new Date(lead.created_at).toLocaleString()}
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b border-black/5 pb-6 mb-6">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-200 mb-3">
                        Qualified Lead
                      </span>
                      <h3 className="text-xl font-black text-[#121212] tracking-tight">{lead.name}</h3>
                      <p className="text-[#666666] text-xs font-medium mt-1">{lead.company_name || 'Individual Client'}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-[#FF5733]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666666]/50 uppercase font-bold tracking-wider">Email</p>
                        <a href={`mailto:${lead.email}`} className="font-bold text-sm text-[#121212] hover:text-[#FF5733] transition-colors">
                          {lead.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666666]/50 uppercase font-bold tracking-wider">WhatsApp/Phone</p>
                        {lead.whatsapp_number ? (
                          <a href={`https://wa.me/${lead.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-bold text-sm text-[#121212] hover:text-[#FF5733] transition-colors">
                            {lead.whatsapp_number}
                          </a>
                        ) : (
                          <span className="text-[#666666]/40 text-xs italic">Not Provided</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666666]/50 uppercase font-bold tracking-wider">Project Type</p>
                        <span className="font-bold text-sm text-[#121212]">{lead.project_type || 'Custom Services'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center shrink-0">
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666666]/50 uppercase font-bold tracking-wider">Budget Range</p>
                        <span className="font-bold text-sm text-[#121212]">{lead.budget_range || 'To be discussed'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666666]/50 uppercase font-bold tracking-wider">Timeline</p>
                        <span className="font-bold text-sm text-[#121212]">{lead.timeline || 'Flexible'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F9F9F7] rounded-2xl p-5 border border-black/5">
                    <p className="text-[10px] text-[#666666]/50 uppercase font-bold tracking-wider mb-2">Project Requirements</p>
                    <p className="text-[#333333] text-sm leading-relaxed whitespace-pre-wrap font-sans">{lead.project_description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Conversations list */}
            <div className="lg:col-span-5 bg-white border border-black/5 rounded-3xl p-5 shadow-sm max-h-[70vh] overflow-y-auto">
              <h3 className="font-bold text-sm text-[#121212] uppercase tracking-wider mb-4 px-2">Conversations Feed</h3>
              
              {conversations.length === 0 ? (
                <div className="py-12 text-center text-[#666666]">
                  <MessageSquare className="w-8 h-8 text-[#666666]/20 mx-auto mb-2" />
                  <p className="text-xs">No recorded chats yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => {
                    const isSelected = selectedConversation?.id === conv.id;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => fetchMessagesForConversation(conv)}
                        className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all border ${
                          isSelected 
                            ? 'bg-[#121212] border-transparent text-white' 
                            : 'bg-[#F9F9F7] border-black/5 text-[#121212] hover:border-[#FF5733]/30'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            {conv.lead_qualified && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-green-500 text-white shrink-0">
                                Qualified
                              </span>
                            )}
                            <span className={`text-[10px] font-mono shrink-0 truncate ${isSelected ? 'text-white/60' : 'text-[#666666]/60'}`}>
                              ID: {conv.session_id.substring(0, 8)}...
                            </span>
                          </div>
                          
                          <p className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-[#121212]'}`}>
                            {conv.user_name || 'Anonymous Visitor'}
                          </p>
                          <p className={`text-[10px] font-medium mt-1 truncate ${isSelected ? 'text-white/50' : 'text-[#666666]/50'}`}>
                            {conv.user_email || 'No email collected'}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end shrink-0 pl-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#666666]'}`}>
                            {conv.messages_count} msgs
                          </span>
                          <span className={`text-[9px] font-mono mt-2 ${isSelected ? 'text-white/40' : 'text-[#666666]/40'}`}>
                            {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Transcript Viewer */}
            <div className="lg:col-span-7 bg-white border border-black/5 rounded-3xl p-6 shadow-sm min-h-[50vh] max-h-[70vh] flex flex-col justify-between">
              {selectedConversation ? (
                <>
                  <div className="border-b border-black/5 pb-4 mb-4 flex items-center justify-between shrink-0">
                    <div>
                      <h4 className="font-bold text-base text-[#121212]">
                        Transcript: {selectedConversation.user_name || 'Anonymous Visitor'}
                      </h4>
                      <p className="text-[10px] font-mono text-[#666666]/50">
                        Session: {selectedConversation.session_id}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#666666]/40 font-mono">
                      {new Date(selectedConversation.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-[#F9F9F7] rounded-2xl border border-black/5 mb-4">
                    {messages.length === 0 ? (
                      <div className="py-12 text-center text-[#666666]/40 italic text-xs">
                        Loading messages...
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-3 max-w-[85%] ${
                              isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                                isUser 
                                  ? 'bg-[#121212] border-transparent text-white' 
                                  : 'bg-white border-black/5 text-[#FF5733]'
                              }`}
                            >
                              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div>
                              <div
                                className={`p-4 rounded-3xl text-sm leading-relaxed ${
                                  isUser
                                    ? 'bg-[#121212] text-white rounded-tr-sm'
                                    : 'bg-white border border-black/5 text-[#121212] rounded-tl-sm shadow-sm'
                                }`}
                              >
                                {msg.content}
                              </div>
                              <span className={`text-[8px] font-mono block mt-1 ${isUser ? 'text-right' : 'text-left'} text-[#666666]/40`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-[#666666]/10 mb-4" />
                  <h4 className="font-bold text-base text-[#121212] mb-1">Select a Conversation</h4>
                  <p className="text-[#666666] text-xs max-w-xs mx-auto">
                    Choose a session from the list on the left to inspect its messages and conversation flow.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
