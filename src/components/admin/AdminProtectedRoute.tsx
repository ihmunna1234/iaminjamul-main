import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldAlert, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPass, setInputPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const expectedPass = import.meta.env.VITE_ADMIN_APP_PASS || 'iaminjamul2026';

  useEffect(() => {
    const savedPass = sessionStorage.getItem('job_agent_app_pass');
    if (savedPass === expectedPass) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [expectedPass]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPass === expectedPass) {
      sessionStorage.setItem('job_agent_app_pass', inputPass);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid App Pass key. Please check your credentials.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center text-[#121212]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF5733]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] text-[#121212] flex flex-col font-sans">
        <Navbar />

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-28 pb-16 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF5733]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-md w-full bg-white border border-[#E5E5E0] p-8 sm:p-10 rounded-3xl shadow-xl shadow-black/5 relative z-10 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#FF5733]/25 text-[#FF5733] bg-[#FF5733]/5 mb-6 font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admin Access</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212] mb-2">
                <span className="font-serif italic font-medium">Job Agent</span>{' '}
                <span className="font-sans font-extrabold text-[#FF5733]">Control Center</span>
              </h1>
              <p className="text-[#666666] text-sm mt-2 leading-relaxed">
                Enter your secure App Pass key to manage autonomous job applications and review live agent tracking.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-2">
                  App Pass Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={inputPass}
                    onChange={(e) => setInputPass(e.target.value)}
                    placeholder="Enter secret key..."
                    className="w-full bg-[#F9F9F7] border border-[#E5E5E0] rounded-2xl px-4 py-3 text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF5733] focus:ring-2 focus:ring-[#FF5733]/15 transition-all text-sm pl-11 font-mono"
                    required
                    autoFocus
                  />
                  <KeyRound className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs animate-shake">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#FF5733] hover:bg-[#E64D2B] text-white font-medium py-3.5 px-6 rounded-full transition-all shadow-md shadow-[#FF5733]/25 hover:shadow-lg hover:shadow-[#FF5733]/30 flex items-center justify-center gap-2 group text-sm"
              >
                <span>Unlock Control Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-[#888888] border-t border-[#E5E5E0] pt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5733]" />
              <span>Protected Portal • iaminjamul.com</span>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
