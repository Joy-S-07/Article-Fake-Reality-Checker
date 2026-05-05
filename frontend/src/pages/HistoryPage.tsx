
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, FileText, Calendar, ArrowLeft } from 'lucide-react';

export function HistoryPage() {
  const historyItems = [
    {
      id: 1,
      claim: "The Earth's core has completely stopped spinning and is now rotating in the opposite direction.",
      date: "May 5, 2026",
      veracity: "Mostly False",
      veracityColor: "text-orange-500",
      veracityBg: "bg-orange-500/10",
      icon: <AlertTriangle size={20} className="text-orange-500" />,
      confidence: 87
    },
    {
      id: 2,
      claim: "A new study proves that drinking 8 cups of coffee a day extends lifespan by 10 years.",
      date: "May 2, 2026",
      veracity: "False",
      veracityColor: "text-red-500",
      veracityBg: "bg-red-500/10",
      icon: <AlertTriangle size={20} className="text-red-500" />,
      confidence: 94
    },
    {
      id: 3,
      claim: "NASA confirms the discovery of a new exoplanet with water vapor in its atmosphere.",
      date: "April 28, 2026",
      veracity: "True",
      veracityColor: "text-green-500",
      veracityBg: "bg-green-500/10",
      icon: <ShieldCheck size={20} className="text-green-500" />,
      confidence: 98
    },
    {
      id: 4,
      claim: "Eating carrots significantly improves your night vision.",
      date: "April 15, 2026",
      veracity: "Misleading",
      veracityColor: "text-yellow-500",
      veracityBg: "bg-yellow-500/10",
      icon: <AlertTriangle size={20} className="text-yellow-500" />,
      confidence: 82
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1C] flex font-sans overflow-hidden transition-colors">
      
      {/* Mobile Menu Button */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-50 mix-blend-overlay"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full p-6 lg:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link to="/dashboard" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2 mb-4 text-sm font-medium">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-slate-400">
              Verification History
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">View and manage your past fact-checking analyses.</p>
          </div>
          
          <div className="bg-white dark:bg-surface/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 rounded-xl p-1 flex shadow-lg">
            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-medium shadow">All Time</button>
            <button className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg text-sm font-medium transition">This Month</button>
            <button className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg text-sm font-medium transition">Saved</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {historyItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-surface/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xl flex flex-col h-full group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 ${item.veracityBg} border border-slate-200 dark:border-slate-700/50`}>
                  {item.icon}
                  <span className={`text-xs font-bold uppercase tracking-wider ${item.veracityColor}`}>{item.veracity}</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
              </div>
              
              <h3 className="text-lg text-slate-900 dark:text-slate-200 font-medium mb-8 flex-1 leading-relaxed group-hover:text-primary transition-colors">
                "{item.claim}"
              </h3>
              
              <div className="flex justify-between items-end mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Confidence</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.confidence}%` }}></div>
                    </div>
                    <span className="font-mono text-slate-900 dark:text-white text-sm font-bold transition-colors">{item.confidence}%</span>
                  </div>
                </div>
                
                <Link to="#" className="text-primary hover:text-cyan-300 text-sm font-semibold flex items-center gap-1 transition">
                  View Report
                  <FileText size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
