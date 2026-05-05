
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';

export function HeroSection() {
  const phrase = "Verifi: Where you verify realities.".split(" ");
  const titleText = "Verifi*".split("");
  
  // Create some random particles for the data-stream effect
  const particles = Array.from({ length: 20 });

  return (
    <section className="relative min-h-screen flex flex-col p-6 overflow-hidden bg-[#0A0F1C]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 mix-blend-screen"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
      />
      
      {/* Overlays: Grid and Noise */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-black/30 z-10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.5] mix-blend-overlay pointer-events-none z-10"></div>

      {/* Floating data particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-10 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: Math.random() * 0.5 + 0.2
          }}
          animate={{
            y: [null, `${Math.random() * 100}vh`],
            opacity: [null, Math.random() * 0.8 + 0.2, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Content Left (Command Aesthetic) */}
      <div className="relative z-30 flex-1 flex flex-col items-start justify-center w-full mt-16 text-left max-w-7xl mx-auto px-4 md:px-12">
        
        {/* Title and Button Container */}
        <div className="flex items-center justify-between w-full relative z-20 mb-4">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-slate-900 dark:text-white flex overflow-hidden">
            {titleText.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8, type: 'spring', stiffness: 100 }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          {/* Call to Action Buttons (Right aligned in Flexbox) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden md:flex flex-col items-center w-full max-w-xs gap-3 mt-6 ml-auto"
          >
            <Link 
              to="/verify" 
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] text-white hover:bg-white/20 transition-all duration-300 rounded-full px-8 py-3 font-medium text-center flex items-center justify-center gap-2"
            >
              Get Started for free
              <ArrowRight size={20} />
            </Link>
            
            <span className="text-slate-500 text-sm font-medium">Or</span>
            
            <Link 
              to="/login" 
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] text-white hover:bg-white/20 transition-all duration-300 rounded-full px-8 py-3 font-medium text-center block flex items-center justify-center gap-2"
            >
              Login to your Account <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        {/* Settling phrase - Left Aligned below heading */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex space-x-2 text-xl md:text-2xl font-medium text-primary mb-6 justify-start w-full"
        >
          {phrase.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-8"
        >
          Real-time fact-checking powered by Google Gemini. Paste a claim, URL, or image to uncover the truth.
        </motion.p>
      </div>
    </section>
  );
}
