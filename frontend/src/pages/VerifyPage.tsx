import { motion } from 'framer-motion';
import { FileText, Link as LinkIcon, Image as ImageIcon, ArrowLeft, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VerifyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1C] flex flex-col p-6 relative overflow-hidden font-sans transition-colors">
      {/* Background styling */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-50 mix-blend-overlay"></div>
      </div>

      <header className="relative z-20 max-w-7xl mx-auto w-full mb-12">
        <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2 mb-8 w-fit font-medium">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Verification Center</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
          Select a verification method below. Our multimodal engine powered by Gemini 1.5 Pro will analyze the content and detect any fabrications or misleading claims.
        </p>
      </header>

      <main className="relative z-20 max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Panel 1: Text Verifier */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-surface/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 flex flex-col shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
          >
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mb-6 border border-blue-200 dark:border-blue-800/50 group-hover:bg-primary/20 transition-colors">
              <FileText size={28} className="text-blue-600 dark:text-blue-400 group-hover:text-primary transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Text Verifier</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 flex-1">
              Analyze claims, news snippets, or social media statements for factual accuracy.
            </p>
            
            <textarea 
              placeholder="Paste the claim or text here..."
              className="w-full h-32 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-600 resize-none mb-6 text-sm"
            ></textarea>
            
            <button className="w-full bg-slate-800 dark:bg-slate-800 text-white hover:bg-primary hover:text-black rounded-xl py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              Submit Text
            </button>
          </motion.div>

          {/* Panel 2: URL/Link Verifier */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-surface/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 flex flex-col shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
          >
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-800/50 group-hover:bg-primary/20 transition-colors">
              <LinkIcon size={28} className="text-purple-600 dark:text-purple-400 group-hover:text-primary transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">URL Verifier</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 flex-1">
              Verify the content of entire webpages and articles by pasting the link.
            </p>
            
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LinkIcon size={16} className="text-slate-400" />
              </div>
              <input 
                type="url" 
                placeholder="https://example.com/article"
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-600 text-sm"
              />
            </div>
            
            <button className="w-full bg-slate-800 dark:bg-slate-800 text-white hover:bg-primary hover:text-black rounded-xl py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] mt-auto">
              Check Link
            </button>
          </motion.div>

          {/* Panel 3: Image Verifier */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-surface/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 flex flex-col shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors group relative overflow-hidden"
          >
            {/* Subtle highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>

            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mb-6 border border-green-200 dark:border-green-800/50 group-hover:bg-primary/20 transition-colors">
              <ImageIcon size={28} className="text-green-600 dark:text-green-400 group-hover:text-primary transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Image Verifier</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 flex-1">
              Detect manipulated visuals, AI generation, and synthetic fabrications.
            </p>
            
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl p-6 flex flex-col items-center justify-center mb-6 bg-slate-50 dark:bg-slate-900/30 transition-colors cursor-pointer group/drop">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover/drop:bg-primary/20 transition-colors">
                <UploadCloud size={20} className="text-slate-500 dark:text-slate-400 group-hover/drop:text-primary" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-sm mb-1">Click or drag image to upload</p>
              <p className="text-slate-500 text-xs">PNG, JPG or WEBP (max. 10MB)</p>
            </div>
            
            <button className="w-full bg-primary text-black hover:bg-cyan-400 rounded-xl py-3 font-bold transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] mt-auto">
              Analyze Image
            </button>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
