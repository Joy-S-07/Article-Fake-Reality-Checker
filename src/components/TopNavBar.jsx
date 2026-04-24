import { Link } from 'react-router-dom';

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center items-center px-8 h-16 bg-surface/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="w-full max-w-[1440px] flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,219,231,0.5)]">
          TruthLens
        </Link>
        <div className="hidden md:flex gap-6 font-h3 tracking-tight text-sm font-medium">
          <Link to="/" className="text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1 hover:bg-white/5 hover:backdrop-blur-lg transition-all duration-300 active:scale-95">Home</Link>
          <Link to="/verify" className="text-on-surface-variant hover:text-on-surface hover:bg-white/5 hover:backdrop-blur-lg transition-all duration-300 active:scale-95 px-2 py-1 rounded">Verify</Link>
          <Link to="/dashboard" className="text-on-surface-variant hover:text-on-surface hover:bg-white/5 hover:backdrop-blur-lg transition-all duration-300 active:scale-95 px-2 py-1 rounded">Dashboard</Link>
          <Link to="/about" className="text-on-surface-variant hover:text-on-surface hover:bg-white/5 hover:backdrop-blur-lg transition-all duration-300 active:scale-95 px-2 py-1 rounded">About</Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
          <Link to="/signin" className="hidden md:block font-h3 text-sm text-primary-fixed-dim px-4 py-2 hover:bg-white/5 transition-colors duration-300 rounded">Login</Link>
          <Link to="/signin" className="font-h3 text-sm bg-primary-fixed-dim text-background px-4 py-2 rounded font-medium hover:brightness-110 shadow-[0_0_15px_rgba(0,219,231,0.3)] transition-all duration-300">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
