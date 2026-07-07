import { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  id: string;
  url: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
}

const photos: Photo[] = [
  { id: '1', url: '/gallery/1-0ATCqrfv.jpg', size: 'tall' },
  { id: '2', url: '/gallery/2-Bpg1KHjT.jpeg', size: 'small' },
  { id: '3', url: '/gallery/3-B_6OFn_M.jpg', size: 'small' },
  { id: '4', url: '/gallery/4-CWrJ3nQz.jpg', size: 'medium' },
  { id: '5', url: '/gallery/5-w2riCHlQ.JPG', size: 'tall' },
  { id: '6', url: '/gallery/6-B__QxILO.jpg', size: 'large' },
  { id: '7', url: '/gallery/7-j-CioVMA.JPG', size: 'small' },
  { id: '8', url: '/gallery/8-wWJj3kHl.JPG', size: 'small' },
  { id: '9', url: '/gallery/9-BoUC57mB.JPG', size: 'medium' },
  { id: '10', url: '/gallery/10-C5SZoduo.jpeg', size: 'tall' },
  { id: '11', url: '/gallery/11-DwY-WwMD.jpg', size: 'small' },
  { id: '12', url: '/gallery/12-DE-B88Me.jpg', size: 'small' },
  { id: '13', url: '/gallery/13-BzDe6psW.JPG', size: 'tall' },
  { id: '14', url: '/gallery/14-DQ__tjpG.JPG', size: 'small' },
  { id: '15', url: '/gallery/15-BGiMwb7v.jpg', size: 'medium' },
  { id: '16', url: '/gallery/16-CbH_W_Dp.jpg', size: 'large' },
  { id: '17', url: '/gallery/17-B_micVdt.jpg', size: 'small' },
  { id: '18', url: '/gallery/18-BnGlOaRa.jpg', size: 'tall' },
  { id: '19', url: '/gallery/19-CEMACwLZ.jpg', size: 'small' },
  { id: '20', url: '/gallery/20-ChRvQ5tf.jpg', size: 'medium' },
  { id: '21', url: '/gallery/21-DzqM7zLO.jpg', size: 'small' },
  { id: '22', url: '/gallery/22-DA4QcpuI.jpg', size: 'tall' },
  { id: '23', url: '/gallery/23-DcSS8Lyx.jpg', size: 'small' },
  { id: '24', url: '/gallery/24--jmMlipw.jpg', size: 'small' },
  { id: '25', url: '/gallery/25-DcyTlOwa.jpg', size: 'medium' },
  { id: '26', url: '/gallery/26-B3kBGXrm.JPG', size: 'tall' },
  { id: '27', url: '/gallery/27-D3biaTj1.jpeg', size: 'small' },
  { id: '28', url: '/gallery/28-hMt09TjC.jpeg', size: 'small' },
  { id: '29', url: '/gallery/29-CojuHBHR.jpg', size: 'medium' },
  { id: '30', url: '/gallery/30-aPQr6BIe.jpeg', size: 'medium' },
];

const getSizeClasses = (size: Photo['size']) => {
  switch (size) {
    case 'small':
      return 'col-span-1 row-span-1';
    case 'medium':
      return 'col-span-1 sm:col-span-2 row-span-1';
    case 'large':
      return 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2';
    case 'wide':
      return 'col-span-1 sm:col-span-2 md:col-span-3 row-span-1';
    case 'tall':
      return 'col-span-1 row-span-1 sm:row-span-2';
    default:
      return 'col-span-1 row-span-1';
  }
};

export function PhotoGallerySection() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (activePhotoIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex]);

  return (
    <section id="gallery" className="py-14 bg-[#F9F9F7] text-[#121212] border-t border-black/5 relative overflow-hidden">
      <div className="container-narrow relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#FF5733]/25 text-[#FF5733] bg-[#FF5733]/5 mb-4">
            <Camera className="w-3.5 h-3.5 mr-1.5 inline-block" />
            Photo Gallery
          </span>
          <h2 className="text-3xl md:text-5xl font-bold flex flex-col items-center justify-center gap-1">
            <span className="font-serif font-medium text-[#121212] italic">Moments &</span>
            <span className="font-sans font-black uppercase tracking-tight text-[#FF5733]">Memories</span>
          </h2>
          <p className="text-[#666666] text-sm md:text-base max-w-xl mx-auto mt-4 font-sans leading-relaxed">
            A glimpse into my professional journey, events, and personal adventures
          </p>
        </div>

        {/* Modern Pinterest-Style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.slice(0, visibleCount).map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(index)}
              className="break-inside-avoid relative overflow-hidden rounded-2xl cursor-pointer group bg-white border border-black/5 shadow-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Image */}
              <img
                src={photo.url}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                loading="lazy"
              />
              
              {/* Elegant Hover Overlay */}
              <div className="absolute inset-0 bg-[#121212]/0 group-hover:bg-[#121212]/5 transition-colors duration-500" />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < photos.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 6, photos.length))}
              className="px-8 py-3 rounded-full border border-black/10 hover:border-[#FF5733] text-xs font-semibold uppercase tracking-widest text-[#121212] hover:text-[#FF5733] bg-transparent hover:bg-[#FF5733]/5 transition-all duration-300 active:scale-95 shadow-sm"
            >
              Load More Moments
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal Gallery */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between py-8 bg-[#0c0c0e]/98 backdrop-blur-2xl"
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Ambient background glow of the active image */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 select-none">
              <img
                src={photos[activePhotoIndex].url}
                alt=""
                className="w-full h-full object-cover filter blur-3xl scale-125 transition-all duration-700"
              />
            </div>

            {/* Top Bar: Title & Close Button */}
            <div className="w-full max-w-7xl px-6 flex justify-between items-center z-50 relative select-none">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF5733] font-sans">
                  Gallery Show
                </span>
                <span className="text-[11px] font-serif italic text-white/50 tracking-wider mt-0.5">
                  Frame {activePhotoIndex + 1} of {photos.length}
                </span>
              </div>
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="p-2.5 rounded-full bg-white/5 hover:bg-[#FF5733] text-white/70 hover:text-white transition-all duration-300 border border-white/10 backdrop-blur-md hover:scale-105 active:scale-95"
                aria-label="Close gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Center Slider Frame */}
            <div className="relative flex items-center justify-center w-full max-w-4xl px-12 sm:px-4 my-auto" onClick={(e) => e.stopPropagation()}>
              {/* Left Control */}
              <button
                onClick={() => setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null))}
                className="absolute left-2 sm:-left-20 p-3 rounded-full bg-white/5 hover:bg-[#FF5733] text-white/60 hover:text-white transition-all duration-300 z-50 border border-white/5 backdrop-blur-md hover:scale-115 active:scale-90"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Main Image Frame (Borderless Floating Card) */}
              <motion.div
                key={activePhotoIndex}
                initial={{ opacity: 0, scale: 0.97, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -15 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="relative rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/10 bg-black/50 select-none"
              >
                <img
                  src={photos[activePhotoIndex].url}
                  alt={`Exhibition view ${activePhotoIndex + 1}`}
                  className="max-w-[80vw] max-h-[52vh] sm:max-h-[58vh] object-contain rounded-2xl"
                />
              </motion.div>

              {/* Right Control */}
              <button
                onClick={() => setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null))}
                className="absolute right-2 sm:-right-20 p-3 rounded-full bg-white/5 hover:bg-[#FF5733] text-white/60 hover:text-white transition-all duration-300 z-50 border border-white/5 backdrop-blur-md hover:scale-115 active:scale-90"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Row: Horizontal Scrollable Thumbnails Strip */}
            <div 
              className="w-full max-w-[90vw] overflow-x-auto py-2 z-50 flex gap-2 justify-start sm:justify-center scrollbar-none select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 mx-auto px-4">
                {photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(i)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                      i === activePhotoIndex
                        ? 'border-[#FF5733] scale-110 opacity-100 shadow-md shadow-[#FF5733]/10'
                        : 'border-white/10 opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img src={photo.url} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
