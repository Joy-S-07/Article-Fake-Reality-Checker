export default function VerificationPage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 px-8 relative z-10 w-full max-w-[1440px] mx-auto">
      {/* Ambient Background Glows */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header */}
      <div className="text-center mb-12 relative z-20">
        <h1 className="font-h1 text-h1 text-on-surface mb-2 drop-shadow-md">Verify Content</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Submit raw articles, images, or direct URLs for comprehensive deep-scan analysis against our global verification network.
        </p>
      </div>

      {/* Glassmorphic Input Card */}
      <div className="w-full max-w-4xl bg-surface-container/30 backdrop-blur-[40px] border border-white/10 rounded-xl shadow-2xl relative z-20 overflow-hidden">
        {/* Tabs Header */}
        <div className="flex border-b border-white/10 bg-surface-container-highest/20">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-6 font-label-caps text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-300 border-b-2 border-transparent">
            <span className="material-symbols-outlined text-lg">article</span>
            Paste Article Text
          </button>
          {/* Active Tab */}
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-6 font-label-caps text-primary border-b-2 border-primary bg-primary-container/5 shadow-[inset_0_-2px_10px_rgba(0,242,255,0.1)] transition-all duration-300">
            <span className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>image</span>
            Upload Image
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-6 font-label-caps text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-300 border-b-2 border-transparent">
            <span className="material-symbols-outlined text-lg">link</span>
            Enter URL
          </button>
        </div>

        {/* Tab Content (Upload Image Active) */}
        <div className="p-12 flex flex-col gap-6">
          {/* Drag & Drop Zone */}
          <div className="w-full h-[300px] rounded-lg border-2 border-dashed border-outline-variant hover:border-primary-container/50 bg-surface-container-low/40 hover:bg-surface-container-low/80 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group relative overflow-hidden">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-primary-container/0 group-hover:bg-primary-container/5 transition-colors duration-500 rounded-lg pointer-events-none"></div>
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:border-primary-container/30 group-hover:shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-all duration-500">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors duration-300">cloud_upload</span>
            </div>
            <div className="text-center">
              <h3 className="font-h3 text-h3 text-on-surface mb-1 group-hover:text-primary-fixed transition-colors duration-300">Drag & drop your image here</h3>
              <p className="font-body-md text-on-surface-variant">or <span className="text-primary underline decoration-primary/50 underline-offset-4 hover:decoration-primary transition-colors">browse files</span> from your device</p>
            </div>
            <p className="font-label-caps text-outline mt-2 tracking-wider">Supports JPG, PNG, WEBP up to 20MB</p>
          </div>

          {/* Input Footer & Actions */}
          <div className="flex items-center justify-between mt-2 pt-6 border-t border-white/5">
            {/* Options */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-outline-variant group-hover:border-primary flex items-center justify-center bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[12px] text-transparent group-hover:text-primary/50 transition-colors">check</span>
                </div>
                <span className="font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Include reverse image search</span>
              </label>
            </div>
            {/* Primary Action Button with Neon Cyan Glow */}
            <button className="bg-primary text-on-primary font-label-caps px-12 py-4 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,255,0.4)] hover:shadow-[0_0_25px_rgba(0,242,255,0.7)] hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              <span className="material-symbols-outlined text-[18px]">policy</span>
              Verify Information
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
