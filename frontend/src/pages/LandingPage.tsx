
import { HeroSection, ArchitectureSection, ResultsDashboard } from '../components';

export function LandingPage() {
  return (
    <div className="bg-slate-50 dark:bg-background min-h-screen font-sans transition-colors">
      <HeroSection />
      <ArchitectureSection />
      <ResultsDashboard />
    </div>
  );
}
