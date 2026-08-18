import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight } from 'lucide-react';

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
      setError('Invalid App Pass key. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full bg-[#121824]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6 text-orange-500">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Job Agent Control Panel</h1>
            <p className="text-gray-400 text-sm">
              Enter your App Pass key to access the multi-agent control center.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Secret App Pass
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono text-sm pl-11"
                  required
                />
                <KeyRound className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 border-t border-white/5 pt-4">
            Protected system • www.iaminjamul.com
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
