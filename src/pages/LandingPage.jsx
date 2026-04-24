import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="flex-grow pt-24 px-8 max-w-[1440px] mx-auto w-full pb-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center min-h-[716px] mb-12 relative flex flex-col items-center justify-center text-center">
        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="flex flex-col gap-6 z-10 items-center text-center w-full">
          <h1 className="font-h1 text-h1 text-on-surface">Detect Fake Information Instantly</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
            Empower your digital experience with TruthLens. Our advanced AI fact-checking engine analyzes text, images, and sources in real-time to separate truth from fiction.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/verify" className="bg-primary-container text-on-primary-container font-h3 text-sm px-6 py-3 rounded-lg hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] border border-primary-container/50">
              Check Now
            </Link>
            <Link to="/about" className="bg-surface/50 backdrop-blur-[20px] text-primary-fixed-dim border border-primary-fixed-dim/30 font-h3 text-sm px-6 py-3 rounded-lg hover:bg-surface-bright/50 transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="text-center mb-6">
          <h2 className="font-h2 text-h2 text-on-surface mb-2">Precision Detection Features</h2>
          <p className="font-body-md text-on-surface-variant">The core capabilities powering our truth engine.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-surface-container/40 backdrop-blur-[40px] border border-white/10 rounded-xl p-6 hover:bg-surface-container/60 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-secondary-container/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(110,6,208,0.3)] transition-all">
              <span className="material-symbols-outlined text-secondary text-3xl">psychology</span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-1">AI Analysis</h3>
            <p className="font-body-md text-on-surface-variant text-sm">Deep learning models scan semantic context to identify logical fallacies and bias.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-surface-container/40 backdrop-blur-[40px] border border-white/10 rounded-xl p-6 hover:bg-surface-container/60 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all">
              <span className="material-symbols-outlined text-primary-container text-3xl">image_search</span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-1">Media Verification</h3>
            <p className="font-body-md text-on-surface-variant text-sm">Reverse searches and structural analysis detect deepfakes and altered images.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-surface-container/40 backdrop-blur-[40px] border border-white/10 rounded-xl p-6 hover:bg-surface-container/60 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-tertiary-container/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(226,212,255,0.3)] transition-all">
              <span className="material-symbols-outlined text-tertiary-fixed text-3xl">speed</span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-1">Fast Results</h3>
            <p className="font-body-md text-on-surface-variant text-sm">Sub-second processing architecture delivers verdicts instantly via API or dashboard.</p>
          </div>
          {/* Feature 4 */}
          <div className="bg-surface-container/40 backdrop-blur-[40px] border border-white/10 rounded-xl p-6 hover:bg-surface-container/60 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-inverse-primary/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(0,105,111,0.3)] transition-all">
              <span className="material-symbols-outlined text-inverse-primary text-3xl">verified_user</span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-1">Trusted Sources</h3>
            <p className="font-body-md text-on-surface-variant text-sm">Cross-references claims against thousands of verified academic and news databases.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-container/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="text-center mb-6">
          <h2 className="font-h2 text-h2 text-on-surface mb-2">How TruthLens Works</h2>
          <p className="font-body-md text-on-surface-variant">Three simple steps to verify any claim.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-[250px]">
            <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline/30 flex items-center justify-center mb-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="material-symbols-outlined text-primary-fixed-dim text-3xl">input</span>
            </div>
            <h3 className="font-h3 text-lg text-on-surface mb-1">1. Input Data</h3>
            <p className="font-body-md text-on-surface-variant text-sm">Paste text, URLs, or upload images directly into the verification engine.</p>
          </div>
          <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent via-primary-container/50 to-transparent"></div>
          <div className="flex flex-col items-center text-center max-w-[250px]">
            <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline/30 flex items-center justify-center mb-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)] relative">
              <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl animate-pulse">memory</span>
              <div className="absolute inset-0 rounded-full border border-secondary-fixed-dim/30 animate-ping opacity-20"></div>
            </div>
            <h3 className="font-h3 text-lg text-on-surface mb-1">2. AI Scan</h3>
            <p className="font-body-md text-on-surface-variant text-sm">Our neural network cross-references facts and detects manipulation artifacts.</p>
          </div>
          <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent via-primary-container/50 to-transparent"></div>
          <div className="flex flex-col items-center text-center max-w-[250px]">
            <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline/30 flex items-center justify-center mb-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <span className="material-symbols-outlined text-primary-container text-3xl">fact_check</span>
            </div>
            <h3 className="font-h3 text-lg text-on-surface mb-1">3. Instant Verdict</h3>
            <p className="font-body-md text-on-surface-variant text-sm">Receive a detailed breakdown with confidence scores and source citations.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
