import { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import heroPhoto from '@/assets/hero-photo.jpg';
import { motion } from 'framer-motion';

export function HeroSection() {
  const handleContactClick = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWorksClick = () => {
    document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const professions = ['Web Developer', 'AI Expert', 'SEO Expert', 'Digital Marketer'];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % professions.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen bg-[#F9F9F7] relative overflow-hidden flex flex-col justify-between"
    >
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#121212 1px, transparent 1px), linear-gradient(90deg, #121212 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Main Content */}
      <div className="container-narrow flex-1 flex flex-col justify-center pt-28 pb-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Column - Profile Image with elegant circular border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative flex justify-center items-center order-2 lg:order-1"
          >
            <div className="relative w-[260px] aspect-[4/5] sm:w-[320px] md:w-[380px]">
              {/* Outer delicate border */}
              <div className="absolute inset-0 rounded-3xl border border-[#FF5733]/20 scale-105" />
              <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-[#FF5733]/40 scale-102" />
              
              {/* Profile Image Wrap */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden border border-black/5 bg-white shadow-lg p-2">
                <img
                  src={heroPhoto}
                  alt="Injamul Hoque Portrait"
                  className="w-full h-full object-cover rounded-2xl filter contrast-[1.02]"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="z-10 flex flex-col justify-center text-center lg:text-left order-1 lg:order-2"
          >
            <p className="text-[#FF5733] text-sm md:text-base font-bold uppercase tracking-wider mb-3 font-sans">
              Hello, I'm
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#121212] leading-tight mb-4 font-serif">
              Injamul Hoque
            </h1>
            
            {/* Dynamic Profession */}
            <p className="text-base sm:text-lg md:text-xl font-medium mb-6 min-h-[2em] flex items-center justify-center lg:justify-start">
              <span className="text-[#666666]">And I'm a </span>
              <span className={`text-[#FF5733] ml-1.5 font-bold transition-all duration-500 transform ${
                fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                {professions[index]}
              </span>
            </p>

            <p className="text-[#666666] text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 font-sans">
              A versatile professional specializing in sales, education consulting, 
              SEO, and web development. Turning ideas into functional, clean, and 
              highly optimized digital experiences.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-black/10 rounded-lg flex items-center justify-center text-[#666666] hover:text-[#FF5733] hover:border-[#FF5733] transition-all duration-200 bg-white shadow-sm"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/injamul-hoque-164988224"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-black/10 rounded-lg flex items-center justify-center text-[#666666] hover:text-[#FF5733] hover:border-[#FF5733] transition-all duration-200 bg-white shadow-sm"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/ihmunna212"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-black/10 rounded-lg flex items-center justify-center text-[#666666] hover:text-[#FF5733] hover:border-[#FF5733] transition-all duration-200 bg-white shadow-sm"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={handleContactClick}
                className="px-8 py-3 bg-[#121212] hover:bg-[#FF5733] text-white font-bold text-sm rounded-lg transition-all duration-200 shadow-sm"
              >
                Hire Me
              </button>
              <button
                onClick={handleWorksClick}
                className="px-8 py-3 bg-white border border-black/10 hover:bg-[#121212]/5 text-[#121212] font-bold text-sm rounded-lg transition-all duration-200 shadow-sm"
              >
                Contact Me
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Stats Bar at Bottom */}
      <div className="border-t border-black/5 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/5">
            {[
              { value: '10+', label: 'Years of experience' },
              { value: '30+', label: 'Projects completed' },
              { value: '5+', label: 'Technologies mastered' },
              { value: '100+', label: 'Satisfied Clients' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                className="py-6 md:py-8 px-4 flex items-center justify-center gap-3"
              >
                <span className="text-3xl md:text-4xl font-bold text-[#121212] font-sans tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[#666666] text-xs md:text-sm leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
