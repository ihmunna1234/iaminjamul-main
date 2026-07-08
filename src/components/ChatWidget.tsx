import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  Bot, 
  Settings, 
  Moon, 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  FolderDot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { askAI, type ChatMessage, type LeadData } from '@/lib/ai/openaiService';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  isSystemLeadNotification?: boolean;
};

export function ChatWidget() {
  const { toast } = useToast();
  
  // Widget open/close
  const [isOpen, setIsOpen] = useState(false);
  
  // Local theme toggle inside the widget
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Settings panel open/close
  const [showSettings, setShowSettings] = useState(false);
  
  // OpenAI API Key
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  
  // Conversation Session ID
  const [sessionId, setSessionId] = useState('');
  
  // Supabase conversation UUID
  const [dbConvUuid, setDbConvUuid] = useState<string | null>(null);

  // Messages state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hi there! 👋 I am Injamul Hoque's digital twin. I am here 24/7 to answer questions about his experience, showcase his projects, recommend services, or help you start a project. What are you looking to build?",
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lead qualification tracking (for the progress checklist)
  const [leadChecklist, setLeadChecklist] = useState({
    name: false,
    email: false,
    project_description: false,
    whatsapp_number: false,
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  // Load settings & generate session on mount
  useEffect(() => {
    // 1. Load custom OpenAI API key if present
    const savedKey = localStorage.getItem('ai_openai_key');
    if (savedKey) {
      setOpenaiApiKey(savedKey);
    }

    // 2. Resolve/generate session ID
    let sId = sessionStorage.getItem('ai_session_id');
    if (!sId) {
      sId = 'sess_' + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('ai_session_id', sId);
    }
    setSessionId(sId);

    // 3. Load previous messages from local state if they exist
    const savedMsgs = sessionStorage.getItem('ai_chat_history');
    if (savedMsgs) {
      try {
        setMessages(JSON.parse(savedMsgs));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }

    // 4. Load widget theme preference
    const savedTheme = localStorage.getItem('ai_widget_theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save messages to session history
  const saveMessagesToSession = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    sessionStorage.setItem('ai_chat_history', JSON.stringify(newMsgs));
  };

  // Sync conversation session details with Supabase or LocalStorage
  const syncConversation = async (msgCount: number, leadQualified = false, userName?: string, userEmail?: string) => {
    if (!sessionId) return;

    try {
      if (isSupabaseConfigured && supabase) {
        let uuid = dbConvUuid;
        
        // Find existing conversation ID if not cached in state
        if (!uuid) {
          const { data, error } = await supabase
            .from('ai_conversations')
            .select('id')
            .eq('session_id', sessionId)
            .maybeSingle();
            
          if (error) throw error;
          if (data) {
            uuid = data.id;
            setDbConvUuid(data.id);
          }
        }

        if (uuid) {
          // Update existing
          const updateData: any = { 
            messages_count: msgCount,
            updated_at: new Date().toISOString()
          };
          if (leadQualified) updateData.lead_qualified = true;
          if (userName) updateData.user_name = userName;
          if (userEmail) updateData.user_email = userEmail;

          await supabase
            .from('ai_conversations')
            .update(updateData)
            .eq('id', uuid);
        } else {
          // Insert new conversation record
          const { data: newConv, error: insertErr } = await supabase
            .from('ai_conversations')
            .insert({
              session_id: sessionId,
              messages_count: msgCount,
              lead_qualified: leadQualified,
              user_name: userName || null,
              user_email: userEmail || null
            })
            .select('id')
            .single();

          if (insertErr) throw insertErr;
          if (newConv) {
            setDbConvUuid(newConv.id);
          }
        }
      } else {
        // LocalStorage fallback for conversation session
        const localConvs = JSON.parse(localStorage.getItem('ai_local_conversations') || '[]');
        const existingIdx = localConvs.findIndex((c: any) => c.session_id === sessionId);
        
        const now = new Date().toISOString();
        if (existingIdx > -1) {
          localConvs[existingIdx].messages_count = msgCount;
          localConvs[existingIdx].updated_at = now;
          if (leadQualified) localConvs[existingIdx].lead_qualified = true;
          if (userName) localConvs[existingIdx].user_name = userName;
          if (userEmail) localConvs[existingIdx].user_email = userEmail;
        } else {
          localConvs.push({
            id: 'local_' + sessionId,
            session_id: sessionId,
            user_name: userName || null,
            user_email: userEmail || null,
            messages_count: msgCount,
            lead_qualified: leadQualified,
            created_at: now,
            updated_at: now
          });
        }
        localStorage.setItem('ai_local_conversations', JSON.stringify(localConvs));
      }
    } catch (err) {
      console.warn('Error syncing conversation record:', err);
    }
  };

  // Save individual message to Supabase or LocalStorage
  const saveMessageRecord = async (role: 'user' | 'assistant', content: string) => {
    if (!sessionId) return;
    
    try {
      if (isSupabaseConfigured && supabase) {
        // Resolve conversation UUID
        let uuid = dbConvUuid;
        if (!uuid) {
          const { data } = await supabase
            .from('ai_conversations')
            .select('id')
            .eq('session_id', sessionId)
            .maybeSingle();
          if (data) {
            uuid = data.id;
            setDbConvUuid(data.id);
          }
        }

        if (uuid) {
          await supabase
            .from('ai_messages')
            .insert({
              conversation_id: uuid,
              role: role,
              content: content
            });
        }
      } else {
        // LocalStorage fallback for messages list
        const allLocalMsgs = JSON.parse(localStorage.getItem('ai_local_messages') || '[]');
        allLocalMsgs.push({
          id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 5),
          conversation_id: 'local_' + sessionId,
          role: role,
          content: content,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('ai_local_messages', JSON.stringify(allLocalMsgs));
      }
    } catch (err) {
      console.warn('Error saving message record:', err);
    }
  };

  // Submit Lead to database and Web3Forms email notifier
  const handleLeadSubmission = async (lead: LeadData) => {
    // 1. Parse checklist completion
    setLeadChecklist({
      name: true,
      email: true,
      project_description: true,
      whatsapp_number: Boolean(lead.whatsapp_number),
    });

    try {
      // 2. Save lead in database
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('ai_leads')
          .insert({
            name: lead.name,
            email: lead.email,
            whatsapp_number: lead.whatsapp_number || null,
            company_name: lead.company_name || null,
            project_type: lead.project_type || null,
            budget_range: lead.budget_range || null,
            timeline: lead.timeline || null,
            project_description: lead.project_description
          });
        
        if (error) throw error;
      } else {
        // LocalStorage fallback
        const localLeads = JSON.parse(localStorage.getItem('ai_local_leads') || '[]');
        localLeads.push({
          id: 'lead_' + Date.now(),
          name: lead.name,
          email: lead.email,
          whatsapp_number: lead.whatsapp_number || null,
          company_name: lead.company_name || null,
          project_type: lead.project_type || null,
          budget_range: lead.budget_range || null,
          timeline: lead.timeline || null,
          project_description: lead.project_description,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('ai_local_leads', JSON.stringify(localLeads));
      }

      // Update session conversion status
      await syncConversation(messages.length + 2, true, lead.name, lead.email);

      // 3. Email Notification via Web3Forms API
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '1ed3c344-c946-4c86-bed5-f1690685ade3';
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: lead.name,
          email: lead.email,
          subject: `✨ AI Agent qualified lead: ${lead.project_type || 'Project Request'}`,
          message: `A new client has been qualified by Injamul's digital AI Twin.

Lead details:
------------------------------------------
Name: ${lead.name}
Email: ${lead.email}
WhatsApp/Phone: ${lead.whatsapp_number || 'N/A'}
Company: ${lead.company_name || 'N/A'}
Project Type: ${lead.project_type || 'N/A'}
Budget: ${lead.budget_range || 'N/A'}
Timeline: ${lead.timeline || 'N/A'}

Project description:
${lead.project_description}
------------------------------------------
Reply to: ${lead.email}`,
          from_name: 'Portfolio AI Twin Agent',
          replyto: lead.email,
        }),
      });

      toast({
        title: 'Lead qualified!',
        description: `Project details for ${lead.name} submitted successfully.`,
      });

    } catch (e: any) {
      console.error('Lead submission failed:', e);
      toast({
        title: 'Lead Saved Locally',
        description: 'Saved your details, but database sync was offline.',
        variant: 'destructive',
      });
    }
  };

  // Monitor text entries to check lead requirements dynamically
  const scanContentForLeadDetails = (text: string) => {
    // Basic regex scanners to update client-side progress checkboxes
    const lowerText = text.toLowerCase();
    
    // Check name
    if (lowerText.includes('my name is') || lowerText.match(/i'm [a-z]+/i) || lowerText.match(/im [a-z]+/i)) {
      setLeadChecklist(prev => ({ ...prev, name: true }));
    }
    // Check email
    if (lowerText.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)) {
      setLeadChecklist(prev => ({ ...prev, email: true }));
    }
    // Check WhatsApp
    if (lowerText.match(/\+?\d{8,}/) || lowerText.includes('whatsapp') || lowerText.includes('phone')) {
      setLeadChecklist(prev => ({ ...prev, whatsapp_number: true }));
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userText = textToSend.trim();
    
    // Check lead progress checklist
    scanContentForLeadDetails(userText);
    if (userText.length > 25 && leadChecklist.name && leadChecklist.email) {
      setLeadChecklist(prev => ({ ...prev, project_description: true }));
    }

    const newUserMsg: Message = {
      id: 'msg_user_' + Date.now(),
      role: 'user',
      text: userText,
    };

    const updatedMsgs = [...messages, newUserMsg];
    saveMessagesToSession(updatedMsgs);
    setInputValue('');
    setIsLoading(true);

    // Save user message in databases
    await syncConversation(updatedMsgs.length);
    await saveMessageRecord('user', userText);

    // Format chat history for OpenAI completions
    const apiHistory = updatedMsgs
      .filter(m => m.id !== 'welcome' && !m.isSystemLeadNotification)
      .slice(-10) // Only send the last 10 messages for token efficiency
      .map((m): ChatMessage => ({
        role: m.role,
        content: m.text
      }));

    try {
      // Call OpenAI completions
      const aiResponse = await askAI(userText, apiHistory, openaiApiKey);
      
      const newBotMsg: Message = {
        id: 'msg_bot_' + Date.now(),
        role: 'assistant',
        text: aiResponse.content,
      };

      let nextMsgs = [...updatedMsgs, newBotMsg];

      // If OpenAI executed the lead submission tool
      if (aiResponse.toolCall && aiResponse.toolCall.name === 'submit_lead') {
        const leadArgs = aiResponse.toolCall.arguments;
        
        // Execute local database saves & notifications
        await handleLeadSubmission(leadArgs);

        // Append a system notification inside the chat UI
        const systemNotif: Message = {
          id: 'msg_sys_' + Date.now(),
          role: 'system',
          text: `📋 PROJECT REQUEST REGISTERED\n• Client: ${leadArgs.name}\n• Email: ${leadArgs.email}\n• Project: ${leadArgs.project_type || 'Unspecified'}\n• Est. Budget: ${leadArgs.budget_range || 'N/A'}`,
          isSystemLeadNotification: true
        };

        nextMsgs = [...nextMsgs, systemNotif];
      }

      saveMessagesToSession(nextMsgs);
      
      // Save bot response in databases
      await syncConversation(nextMsgs.length);
      await saveMessageRecord('assistant', aiResponse.content);

    } catch (error: any) {
      let errorMsg = "I'm sorry, I'm experiencing connectivity issues connecting to my AI core. Please try again later or reach out to Injamul directly!";
      
      if (error.message === 'API_KEY_MISSING') {
        errorMsg = "⚠️ OpenAI API Key is not configured. Please open the settings panel (gear icon at the top) and input an API key to activate my intelligence.";
        setShowSettings(true);
      } else if (error.message === 'API_KEY_INVALID') {
        errorMsg = "❌ The OpenAI API key provided is invalid. Please check your credentials in the settings panel (gear icon above) and try again.";
        setShowSettings(true);
      } else {
        console.error('AI chat error details:', error);
      }

      const newErrorMsg: Message = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        text: errorMsg,
      };

      saveMessagesToSession([...updatedMsgs, newErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const saveCustomApiKey = (key: string) => {
    setOpenaiApiKey(key);
    if (key.trim()) {
      localStorage.setItem('ai_openai_key', key.trim());
      toast({
        title: 'API Key Saved',
        description: 'OpenAI API Key stored locally in this browser.',
      });
    } else {
      localStorage.removeItem('ai_openai_key');
      toast({
        title: 'API Key Cleared',
        description: 'Custom API Key removed.',
      });
    }
    setShowSettings(false);
  };

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    localStorage.setItem('ai_widget_theme', nextTheme ? 'dark' : 'light');
  };

  const quickReplies = [
    { text: 'Show SaaS projects', icon: <FolderDot className="w-3 h-3 text-[#FF5733]" /> },
    { text: 'Show AI projects', icon: <Sparkles className="w-3 h-3 text-[#FF5733]" /> },
    { text: 'What are your rates?', icon: <HelpCircle className="w-3 h-3 text-[#FF5733]" /> },
    { text: 'Hire Injamul', icon: <CheckCircle2 className="w-3 h-3 text-green-500" /> }
  ];

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#FF5733] hover:bg-[#e04e2b] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 z-50 hover:scale-105 active:scale-95 animate-float ${
          isOpen ? 'rotate-90 scale-0 opacity-0 pointer-events-none' : 'rotate-0 scale-100 opacity-100'
        }`}
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white" />
          <Sparkles className="w-3 h-3 text-white absolute -top-1.5 -right-1.5 animate-pulse" />
        </div>
      </button>

      {/* Main Chat Drawer */}
      <div
        className={`fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-[420px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-50 max-h-[82vh] ${
          isDarkMode ? 'dark-theme bg-[#121212] text-white border-white/10' : 'bg-white text-[#121212] border-black/5'
        } ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'
        }`}
      >
        
        {/* Header Bar */}
        <div className={`p-4 flex items-center justify-between border-b ${
          isDarkMode ? 'bg-[#1e1e1e] border-white/5' : 'bg-[#F9F9F7] border-black/5'
        }`}>
          <div className="flex items-center gap-2.5">
            <div 
              onDoubleClick={() => setShowSettings(!showSettings)}
              className="w-9 h-9 rounded-xl bg-[#FF5733] flex items-center justify-center shadow-md shadow-[#FF5733]/15 cursor-pointer select-none"
              title="Double-click for developer settings"
            >
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                Injamul's AI Twin
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />
              </h3>
              <p className={`text-[10px] ${isDarkMode ? 'text-white/60' : 'text-[#666666]/60'}`}>
                Portfolio Agent & Lead Specialist
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Widget local Theme Selector */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-white/5 text-white/70 hover:text-white' : 'hover:bg-black/5 text-[#666666] hover:text-black'
              }`}
              title={isDarkMode ? 'Switch to Light Chat' : 'Switch to Dark Chat'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-white/5 text-white/70 hover:text-white' : 'hover:bg-black/5 text-[#666666] hover:text-black'
              }`}
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Lead Capture Progress Checklist */}
        {(leadChecklist.name || leadChecklist.email || leadChecklist.project_description) && (
          <div className={`px-4 py-2 border-b text-[9px] font-bold uppercase tracking-wider flex items-center justify-between select-none ${
            isDarkMode ? 'bg-[#181818] border-white/5 text-white/50' : 'bg-[#F3F3EF] border-black/5 text-[#666666]'
          }`}>
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#FF5733]" /> Lead Setup:</span>
            <div className="flex gap-3">
              <span className={leadChecklist.name ? 'text-green-500' : 'text-gray-400'}>
                {leadChecklist.name ? '✓ Name' : '• Name'}
              </span>
              <span className={leadChecklist.email ? 'text-green-500' : 'text-gray-400'}>
                {leadChecklist.email ? '✓ Email' : '• Email'}
              </span>
              <span className={leadChecklist.project_description ? 'text-green-500' : 'text-gray-400'}>
                {leadChecklist.project_description ? '✓ Brief' : '• Brief'}
              </span>
            </div>
          </div>
        )}

        {/* Scrollable messages or settings panel */}
        <div className="flex-1 relative h-96 overflow-hidden flex flex-col justify-between">
          
          {/* Settings Panel */}
          {showSettings && (
            <div className={`absolute inset-0 z-10 p-6 flex flex-col justify-between ${
              isDarkMode ? 'bg-[#161616]' : 'bg-[#F9F9F7]'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#FF5733] font-bold text-xs uppercase tracking-wider">
                  <Settings className="w-4.5 h-4.5 animate-spin" />
                  Agent Settings
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-[#666666]'}`}>
                  Enter your OpenAI API key below to enable chat capabilities. 
                  This key is stored securely in your browser's local storage and is sent directly to OpenAI.
                </p>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className={`h-11 w-full border rounded-xl px-4 text-xs font-mono outline-none focus:ring-1 focus:ring-[#FF5733] focus:border-[#FF5733] ${
                      isDarkMode 
                        ? 'bg-[#222222] border-white/10 text-white placeholder-white/20' 
                        : 'bg-white border-black/10 text-[#121212] placeholder-black/20'
                    }`}
                  />
                </div>
                
                <div className={`flex items-start gap-2 p-3.5 rounded-xl text-[10px] leading-relaxed border ${
                  isDarkMode ? 'bg-amber-950/20 border-amber-900/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-[#FF5733]" />
                  <span>
                    If not specified here, the agent will fallback to the project's VITE_OPENAI_API_KEY environment variable.
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => saveCustomApiKey(openaiApiKey)}
                  className="flex-1 bg-[#FF5733] hover:bg-[#e04e2b] text-white text-xs font-bold uppercase tracking-wider h-11"
                >
                  Save Settings
                </Button>
                <Button 
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  className={`h-11 text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'border-white/10 hover:bg-white/5 text-white' : 'border-black/10 hover:bg-black/5 text-[#121212]'
                  }`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Messages List Container */}
          <div className={`flex-1 p-4 overflow-y-auto flex flex-col gap-4 ${
            isDarkMode ? 'bg-[#141414]/30' : 'bg-muted/10'
          }`}>
            {messages.map((msg) => {
              if (msg.isSystemLeadNotification) {
                return (
                  <div key={msg.id} className={`mx-auto max-w-[90%] p-3.5 rounded-2xl border text-[11px] leading-relaxed flex flex-col gap-1 shadow-sm font-sans ${
                    isDarkMode 
                      ? 'bg-green-950/10 border-green-900/30 text-green-300' 
                      : 'bg-green-50 border-green-200 text-green-800'
                  }`}>
                    {msg.text.split('\n').map((line, idx) => (
                      <p key={idx} className={idx === 0 ? 'font-black uppercase tracking-wider text-xs' : 'font-medium'}>
                        {line}
                      </p>
                    ))}
                  </div>
                );
              }

              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${
                    isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm border ${
                      isUser 
                        ? 'bg-[#121212] border-transparent text-white' 
                        : isDarkMode ? 'bg-[#222222] border-white/5 text-[#FF5733]' : 'bg-[#F9F9F7] border-black/5 text-[#FF5733]'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#FF5733] text-white rounded-tr-sm shadow-sm'
                        : isDarkMode 
                          ? 'bg-[#202020] border border-white/5 text-white/95 rounded-tl-sm shadow-sm'
                          : 'bg-white border border-black/5 text-[#121212] rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.text.split('\n').map((line, idx) => (
                      <span key={idx} className="block mt-1 first:mt-0">{line}</span>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Animated Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2 max-w-[80%] mr-auto">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm border ${
                  isDarkMode ? 'bg-[#222222] border-white/5 text-[#FF5733]' : 'bg-[#F9F9F7] border-black/5 text-[#FF5733]'
                }`}>
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className={`p-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm ${
                  isDarkMode ? 'bg-[#202020] border border-white/5' : 'bg-white border border-black/5'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-[#FF5733] animate-bounce shrink-0" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#FF5733] animate-bounce shrink-0" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#FF5733] animate-bounce shrink-0" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Row */}
          {!isLoading && (
            <div className={`px-4 py-2 border-t flex flex-wrap gap-2 justify-center shrink-0 select-none ${
              isDarkMode ? 'bg-[#181818] border-white/5' : 'bg-[#F9F9F7] border-black/5'
            }`}>
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(reply.text)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    isDarkMode 
                      ? 'border-white/10 hover:border-[#FF5733]/30 hover:bg-white/5 text-white/80' 
                      : 'border-black/10 hover:border-[#FF5733]/30 hover:bg-black/5 text-[#666666]'
                  }`}
                >
                  {reply.icon}
                  {reply.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Text Form Area */}
        <div className={`p-3 border-t shrink-0 ${
          isDarkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-black/5'
        }`}>
          <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Injamul's AI twin..."
              disabled={isLoading}
              className={`flex-1 border-transparent focus:ring-1 focus:ring-[#FF5733] focus:border-[#FF5733] rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                isDarkMode 
                  ? 'bg-[#2b2b2b] text-white placeholder-white/30 focus:bg-[#333333]' 
                  : 'bg-[#F9F9F7] text-[#121212] placeholder-black/30 focus:bg-white'
              }`}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isLoading}
              className="rounded-xl w-10 h-10 shrink-0 bg-[#FF5733] hover:bg-[#e04e2b] text-white transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </form>
          <div className="flex items-center justify-between text-[8px] text-[#666666]/50 font-medium tracking-wide mt-2 px-1">
            <span>Powered by GPT-4o-mini & RAG</span>
            <span className="flex items-center gap-0.5">Secure sandbox <CheckCircle2 className="w-2.5 h-2.5 text-green-500" /></span>
          </div>
        </div>

      </div>
    </>
  );
}
