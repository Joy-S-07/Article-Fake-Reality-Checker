import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-6xl bg-white/80 dark:bg-surface/80 backdrop-blur-md rounded-full px-8 py-3 flex items-center justify-between border border-slate-200 dark:border-slate-700/50 shadow-lg text-xs md:text-sm transition-colors">
      
      {/* Left Side (Logo) */}
      <div className="flex-1 hidden md:flex items-center">
         <Link to="/" className="text-slate-900 dark:text-white font-bold text-xl tracking-tight transition-colors">Verifi*</Link>
      </div>

      {/* Center Links */}
      <div className="flex space-x-6 lg:space-x-8 items-center justify-center whitespace-nowrap overflow-x-auto no-scrollbar">
        {["How it Works", "History", "Dashboard"].map(item => (
          <Link 
            to={item === "How it Works" ? "/how-it-works" : item === "History" ? "/history" : item === "Dashboard" ? "/dashboard" : "/"} 
            key={item} 
            className="relative overflow-hidden water-drop-hover px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition font-medium"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex-1 flex items-center justify-end space-x-4 sm:space-x-6">
        <Link to="/login" className="relative overflow-hidden water-drop-hover px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-50 dark:hover:text-white transition font-semibold hidden sm:block">Sign In</Link>
        <Link to="/verify" className="relative overflow-hidden water-drop-hover text-black bg-primary px-5 py-2.5 rounded-full hover:bg-cyan-300 transition font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] whitespace-nowrap">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
