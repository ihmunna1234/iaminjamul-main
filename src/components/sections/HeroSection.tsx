import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import heroPhoto from '@/assets/hero-photo.jpg';
import { motion } from 'framer-motion';

export function HeroSection() {
  const handleContactClick = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWorksClick = () => {
    document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const professions = ['SEO Specialist', 'Web Developer', 'AI Expert'];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % professions.length);
        setFade(true);
      }, 500); // Duration of fade-out before switching text
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen bg-[#A31414] relative overflow-hidden flex flex-col justify-between pt-20 md:pt-24 pb-4 md:pb-6"
    >
      {/* Left-Side Vertical Social Icons */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6 md:gap-8 text-white/70">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:scale-110 transition-all duration-200"
          aria-label="Instagram"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:scale-110 transition-all duration-200"
          aria-label="Twitter"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a
          href="https://pinterest.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:scale-110 transition-all duration-200"
          aria-label="Pinterest"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.621 0 11.985-5.367 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
          </svg>
        </a>
      </div>

      {/* Main Grid Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-center my-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center justify-items-center lg:justify-items-stretch">
          
          {/* Left Column Text */}
          <div className="z-10 flex flex-col justify-center select-none text-left pl-10 sm:pl-12 md:pl-16 lg:pl-0 w-full">
            <h1 className="flex flex-col">
              <span className="font-serif text-[2.8rem] sm:text-[3.8rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] font-bold text-white leading-none tracking-tight">
                I am
              </span>
              <span className="font-sans text-[4.2rem] sm:text-[5.8rem] md:text-[8rem] lg:text-[9.5rem] xl:text-[11.5rem] font-black text-black leading-none tracking-tighter -mt-1 sm:-mt-2 md:-mt-4">
                Injamul
              </span>
            </h1>
            <p className="text-white text-xs sm:text-sm md:text-base lg:text-[1.5rem] xl:text-[1.7rem] font-medium tracking-wide mt-1 sm:mt-2 font-sans opacity-95 text-left w-full pl-1 md:pl-2 lg:pl-3 xl:pl-[14px] min-h-[1.5em] flex items-center justify-start">
              <span className={`inline-block transition-all duration-500 transform ${
                fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                {professions[index]}
              </span>
            </p>
          </div>

          {/* Right Column Illustration */}
          <div className="relative flex justify-center lg:justify-end items-center lg:items-end w-full mt-4 lg:mt-0">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="w-[180px] sm:w-[220px] md:w-[320px] lg:w-[360px] xl:w-[420px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-end relative"
            >
              <motion.div
                className="absolute inset-0 bg-[#A31414] z-10"
                initial={{ y: 0 }}
                animate={{ y: '100%' }}
                transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1], delay: 0.5 }}
              />
              <motion.img
                src={heroPhoto}
                alt="Injamul Hoque Portrait"
                className="w-full h-auto object-cover"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              />
            </motion.div>
          </div>

        </div>
      </div>

    </section>
  );
}
