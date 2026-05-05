import { ArchitectureSection } from '../components/ArchitectureSection';
import { Navbar } from '../components/Navbar';

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1C] font-sans transition-colors">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24">
        <ArchitectureSection />
      </div>
    </div>
  );
}
