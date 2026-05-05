import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LayoutDashboard, History, Bookmark, Settings, ShieldCheck, AlertTriangle, Brain, Zap, ArrowRight, Menu, X } from 'lucide-react';

export function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { title: "Total Claims Verified", value: "142", change: "+12% this week", icon: <ShieldCheck size={24} className="text-primary" />, color: "text-green-400" },
    { title: "Misinformation Detected", value: "89", change: "+5% this week", icon: <AlertTriangle size={24} className="text-orange-500" />, color: "text-orange-500" },
    { title: "Average Confidence Score", value: "91%", change: "+2% this week", icon: <Brain size={24} className="text-purple-400" />, color: "text-green-400" },
    { title: "API Credits Remaining", value: "8,450", change: "-450 today", icon: <Zap size={24} className="text-yellow-400" />, color: "text-slate-400" },
  ];

  const recentActivity = [
    { claim: "The Earth's core has completely stopped...", date: "2 hrs ago", veracity: "Mostly False", color: "text-orange-500", bg: "bg-orange-500/10" },
    { claim: "NASA confirms the discovery of a new...", date: "5 hrs ago", veracity: "True", color: "text-green-500", bg: "bg-green-500/10" },
    { claim: "Drinking 8 cups of coffee a day extends...", date: "1 day ago", veracity: "False", color: "text-red-500", bg: "bg-red-500/10" },
    { claim: "Eating carrots significantly improves your...", date: "2 days ago", veracity: "Misleading", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  const navLinks = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, active: true, to: "/dashboard" },
    { name: "Verification History", icon: <History size={20} />, active: false, to: "/history" },
    { name: "Saved Evidence", icon: <Bookmark size={20} />, active: false, to: "/saved-evidence" },
    { name: "Settings", icon: <Settings size={20} />, active: false, to: "/settings" },
  ];

  const chartData = [
    {day: 'Day 1', val: 30},
    {day: 'Day 2', val: 50},
    {day: 'Day 3', val: 20},
    {day: 'Day 4', val: 80},
    {day: 'Day 5', val: 60},
    {day: 'Day 6', val: 90},
    {day: 'Day 7', val: 40}
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1C] flex font-sans overflow-hidden transition-colors">
      
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-primary text-black p-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)]"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white/80 dark:bg-surface/50 backdrop-blur-md border-r border-slate-200 dark:border-slate-800/50 flex flex-col transition-transform duration-300 z-40 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8">
          <Link to="/" className="text-slate-900 dark:text-white font-bold text-2xl tracking-tight transition-colors">Verifi*</Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${link.active ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent'}`}
            >
              {link.icon}
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 mb-4">
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-center">
            <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap size={20} />
            </div>
            <p className="text-xs text-slate-400 mb-2">Upgrade to Pro for unlimited API credits.</p>
            <button className="w-full text-xs font-bold bg-primary text-black py-2 rounded-lg hover:bg-cyan-400 transition shadow-[0_0_10px_rgba(0,240,255,0.2)]">Upgrade Now</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
        {/* Background Noise */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] mix-blend-overlay pointer-events-none z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10 pt-4">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-slate-400 text-sm">Welcome back, Marcus. Here's a summary of your platform usage.</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.title}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.title}</h3>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className={`text-xs font-medium ${stat.color}`}>{stat.change}</div>
                
                {/* Glow effect on hover */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl transition-colors">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verification Activity</h3>
                <select className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg px-3 py-1 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              
              {/* Custom CSS Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-4">
                {chartData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-8 relative flex-1 flex items-end rounded-t-sm overflow-hidden group">
                      <div className="w-8 bg-slate-100 dark:bg-slate-800/50 absolute inset-0 rounded-t-sm"></div>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${item.val}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1, type: "spring" }}
                        className="w-8 bg-gradient-to-t from-blue-900 to-[#00F0FF] relative z-10 rounded-t-sm shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:from-blue-800 group-hover:to-cyan-300 transition-all"
                      ></motion.div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Veracity Breakdown */}
            <div className="bg-surface border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col">
              <h3 className="text-lg font-bold text-white mb-8">Results Distribution</h3>
              <div className="flex-1 flex flex-col justify-center space-y-6">
                {[
                  { label: "True", value: "35%", color: "bg-green-500", glow: "shadow-[0_0_10px_rgba(34,197,94,0.4)]" },
                  { label: "Misleading", value: "45%", color: "bg-yellow-500", glow: "shadow-[0_0_10px_rgba(234,179,8,0.4)]" },
                  { label: "Fake", value: "20%", color: "bg-red-500", glow: "shadow-[0_0_10px_rgba(239,68,68,0.4)]" },
                ].map((item, i) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300 font-medium">{item.label}</span>
                      <span className="font-mono text-slate-400">{item.value}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: item.value }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.2 }}
                        className={`h-full rounded-full ${item.color} ${item.glow}`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Widget */}
          <div className="bg-surface border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Recent Fact-Checks</h3>
              <Link to="/history" className="text-sm text-primary hover:text-cyan-300 font-semibold transition">View All</Link>
            </div>
            <div className="divide-y divide-slate-800/50">
              {recentActivity.map((item, i) => (
                <div key={i} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/20 transition cursor-pointer group">
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium mb-1 truncate max-w-lg group-hover:text-primary transition">"{item.claim}"</p>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <History size={12} />
                      {item.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className={`px-3 py-1 rounded-full border border-slate-700/50 ${item.bg} ${item.color} text-[10px] font-bold uppercase tracking-wider`}>
                      {item.veracity}
                    </div>
                    <Link to="#" className="text-slate-400 hover:text-primary transition p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
