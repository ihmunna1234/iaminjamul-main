import { MessageCircle, ArrowUpRight } from 'lucide-react';

export function FreelanceCTASection() {
  const handleHireClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#A31414] text-white relative overflow-hidden border-t border-[#A31414]/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold flex flex-col gap-2 mb-6">
            <span className="font-serif font-medium text-white italic">Hello 👋 I'm available for</span>
            <span className="font-sans font-black uppercase tracking-tight text-black leading-none">freelance work</span>
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-sm">
            <span className="text-white/80">For quick response:</span>
            <a
              href="https://wa.me/966582822130"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 rounded-full text-white font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#e49797]" />
              Chat now
            </a>
          </div>

          <a
            href="#contact"
            onClick={handleHireClick}
            className="rounded-2xl bg-[#e49797] hover:bg-[#d88d8d] hover:scale-105 active:scale-95 text-[#1a0505] font-bold uppercase tracking-wider px-8 py-4 border-none flex items-center gap-1.5 transition-all text-xs shadow-md"
          >
            Hire Me Now
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
