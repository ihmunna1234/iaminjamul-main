import { MessageCircle, ArrowUpRight } from 'lucide-react';

export function FreelanceCTASection() {
  const handleHireClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-14 bg-[#F9F9F7] text-[#121212] relative overflow-hidden border-t border-black/5">
      <div className="container-narrow relative z-10">
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold flex flex-col gap-2 mb-6">
            <span className="font-serif font-medium text-[#121212] italic">Hello 👋 I'm available for</span>
            <span className="font-sans font-black uppercase tracking-tight text-[#FF5733] leading-none">freelance work</span>
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-sm">
            <span className="text-[#666666]">For quick response:</span>
            <a
              href="https://wa.me/966582822130"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#FF5733]/20 bg-[#FF5733]/5 hover:bg-[#FF5733]/10 rounded-full text-[#FF5733] font-medium transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#FF5733]" />
              Chat now
            </a>
          </div>

          <a
            href="#contact"
            onClick={handleHireClick}
            className="rounded-xl bg-[#121212] hover:bg-[#FF5733] text-white font-bold uppercase tracking-wider px-8 py-4 border-none flex items-center gap-1.5 transition-all text-xs shadow-sm"
          >
            Contact Me
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
