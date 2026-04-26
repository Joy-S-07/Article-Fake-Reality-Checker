export default function FeatureCard({ icon, title, description, iconBgClass, iconTextClass, glowColor }) {
  return (
    <div className="bg-surface-container/40 backdrop-blur-[40px] border border-outline-variant/10 rounded-xl p-6 hover:bg-surface-container/60 transition-all duration-300 group hover:border-outline-variant/30">
      <div 
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all ${iconBgClass}`}
        style={{ boxShadow: `0 0 0px ${glowColor}` }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}`}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 0px ${glowColor}`}
      >
        <span className={`material-symbols-outlined text-2xl ${iconTextClass}`}>{icon}</span>
      </div>
      <h3 className="font-h3 text-h3 text-on-surface mb-1">{title}</h3>
      <p className="font-body-md text-on-surface-variant text-sm">{description}</p>
    </div>
  );
}
