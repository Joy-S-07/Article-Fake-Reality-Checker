import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-center items-center bg-surface-container-lowest border-t border-white/5">
      <div className="w-full max-w-max_width flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-lg font-bold text-on-surface">
          TruthLens
        </div>
        <div className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
          © 2026 TruthLens AI. Precision Detection for the Digital Age.
        </div>
        <div className="flex gap-6 font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
          <Link to="#" className="hover:text-primary-fixed-dim transition-colors duration-200 opacity-80 hover:opacity-100">Privacy Policy</Link>
          <Link to="#" className="hover:text-primary-fixed-dim transition-colors duration-200 opacity-80 hover:opacity-100">Terms of Service</Link>
          <Link to="#" className="hover:text-primary-fixed-dim transition-colors duration-200 opacity-80 hover:opacity-100">API Status</Link>
          <Link to="#" className="hover:text-primary-fixed-dim transition-colors duration-200 opacity-80 hover:opacity-100">Support</Link>
        </div>
      </div>
    </footer>
  );
}
