import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1C] flex items-center justify-center p-6 relative overflow-hidden transition-colors">
      {/* Background styling */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-50 mix-blend-overlay pointer-events-none"></div>
      </div>

      <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2 text-sm font-medium z-20">
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row w-full max-w-5xl bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/50 rounded-3xl shadow-2xl overflow-hidden relative z-10 transition-colors"
      >
        {/* Left Panel */}
        <div className="hidden md:flex md:w-5/12 bg-slate-100 dark:bg-slate-900/50 p-12 flex-col justify-between border-r border-slate-200 dark:border-slate-800/50 relative overflow-hidden transition-colors">
          <div className="relative z-10">
            <Link to="/" className="text-slate-900 dark:text-white font-bold text-3xl tracking-tight mb-8 block transition-colors">Verifi*</Link>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Welcome.</h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Sign in to access your saved evidence, API keys, and verification history.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 md:hidden transition-colors">Sign In</h2>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Password</label>
                <a href="#" className="text-xs text-primary hover:text-cyan-300 transition">Forgot password?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <button 
              type="button"
              className="w-full bg-primary text-black rounded-xl py-3 font-bold hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 mt-4"
            >
              Sign In
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-[#111827] px-4 text-slate-500 transition-colors">Or continue with</span>
            </div>
          </div>

          <button 
            type="button" 
            className="mt-6 w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-bold py-3.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-800"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
            Don't have an account? <Link to="/register" className="text-slate-900 dark:text-white font-semibold hover:text-primary transition-colors">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
