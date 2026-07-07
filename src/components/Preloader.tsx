import { motion } from 'framer-motion';

const profilePhoto = '/gallery/profile-photo-CKHWKAEt.jpg';

export function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -100,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0c0c0e] select-none"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-20" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        {/* Profile Image with delicate custom border */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/10 p-1.5 bg-white/5 shadow-2xl overflow-hidden"
          >
            <img
              src={profilePhoto}
              alt="Injamul Hoque Portrait"
              className="w-full h-full object-cover rounded-full filter contrast-[1.02]"
            />
          </motion.div>
          
          {/* Subtle outer glowing ring */}
          <div className="absolute -inset-1 rounded-full border border-[#FF5733]/20 animate-pulse pointer-events-none" />
        </div>

        {/* Name Reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl font-serif italic text-white/95 tracking-[0.12em] text-center"
        >
          Injamul Hoque
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase text-white/40 mt-2 text-center"
        >
          Digital Specialist & Developer
        </motion.p>
        
        {/* Progress Line */}
        <div className="relative w-48 h-[1px] bg-white/10 mt-8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: 'easeInOut' }}
            className="absolute top-0 left-0 h-full bg-[#FF5733] shadow-[0_0_8px_#FF5733]"
          />
        </div>
      </div>
    </motion.div>
  );
}
