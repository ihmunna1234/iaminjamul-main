import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Message = {
  id: string;
  role: 'user' | 'bot';
  text: string;
};

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'bot',
    text: "Hi there! 👋 I'm Injamul's virtual assistant. Ask me about his skills, experience, or how to contact him!",
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Core details
    if (lowerInput.match(/contact|email|hire|message|reach/)) {
      return "You can contact Injamul via email or use the contact form at the bottom of the page! I can't send messages directly yet, but he replies quickly.";
    }
    if (lowerInput.match(/skill|tech|stack|know|language|framework/)) {
      return "Injamul is highly skilled in Web Development (React, TypeScript, Node.js, Tailwind), SEO (Technical & Local), and Sales & Education Consulting.";
    }
    if (lowerInput.match(/experience|work|job|history|past/)) {
      return "He has 5+ years of experience! Key roles include B2C Sales at Abul Khair Group, Education Consulting, and delivering 10+ freelance web projects.";
    }
    if (lowerInput.match(/project|portfolio|built|made|app/)) {
      return "His portfolio includes E-commerce platforms, SaaS dashboards, Real Estate platforms, and successful SEO campaigns. Scroll to the 'My Work' section to see live examples!";
    }
    
    // New responsibilities
    if (lowerInput.match(/blog|article|post|read/)) {
      return "Injamul writes about web development, SEO strategies, and tech insights. You can check out his articles in the 'Blog' section from the top menu.";
    }
    if (lowerInput.match(/certifi|degree|education|study/)) {
      return "He holds multiple certifications in digital marketing, SEO, and web development to stay ahead of industry trends. The 'Certifications' section has all the details.";
    }
    if (lowerInput.match(/price|cost|charge|rate|fee/)) {
      return "Pricing depends entirely on the scope of the project. For a custom quote on web development or SEO, please send a message through the contact form with your requirements!";
    }
    if (lowerInput.match(/social|github|linkedin|twitter|instagram/)) {
      return "You can find his social links (GitHub, LinkedIn, Twitter, etc.) scattered throughout the site, particularly in the Hero section and the Footer.";
    }
    if (lowerInput.match(/who are you|what are you|bot|ai/)) {
      return "I am Injamul's custom-built virtual assistant! I was created to help visitors navigate his portfolio and answer quick questions.";
    }
    if (lowerInput.match(/hello|hi|hey|greetings/)) {
      return "Hello there! 👋 How can I assist you today? You can ask me about Injamul's skills, projects, pricing, or how to get in touch.";
    }
    if (lowerInput.match(/thank|thx/)) {
      return "You're very welcome! Let me know if you need anything else.";
    }
    
    return "That's an interesting question! As a simple assistant, I might not have the answer to that. For detailed inquiries, please reach out to Injamul directly via the contact section.";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot thinking delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: generateBotResponse(userMessage.text),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-80 md:w-96 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-50 max-h-[80vh] ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Virtual Assistant</h3>
              <p className="text-xs text-primary-foreground/80">Typically replies instantly</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 h-80 overflow-y-auto flex flex-col gap-4 bg-muted/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`p-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-card border border-border text-foreground rounded-tl-sm shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-card border-t border-border">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-muted border-transparent focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary rounded-full px-4 py-2 text-sm outline-none transition-all"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className="rounded-full w-9 h-9 shrink-0 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 z-50 hover:scale-105 active:scale-95 ${
          isOpen ? 'rotate-90 scale-0 opacity-0 pointer-events-none' : 'rotate-0 scale-100 opacity-100'
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  );
}
