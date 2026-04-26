export default function SocialLoginButton({ icon, provider }) {
  return (
    <button className="w-full py-3 px-4 bg-transparent border border-outline-variant/30 rounded-lg text-on-surface font-body-md text-sm hover:bg-surface-container-highest/30 hover:border-outline transition-all flex items-center justify-center gap-3">
      {icon}
      {provider}
    </button>
  );
}
