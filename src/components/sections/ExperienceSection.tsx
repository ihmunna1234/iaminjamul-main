import { motion } from 'framer-motion';
import { ScrollReveal } from '../animations/ScrollReveal';
import { AnimatedHeading } from '../animations/AnimatedHeading';

const experiences = [
  {
    title: 'Sales Officer',
    company: 'Abul Khair Group',
    duration: '2021 - 2024',
    description: 'Leading B2C sales initiatives and managing key client relationships. Achieved 150% of annual sales targets through strategic account management and new client acquisition.',
  },
  {
    title: 'Education Consultant',
    company: 'A4 Admission Chittagong',
    duration: '2024 - 2025',
    description: 'Provided comprehensive guidance to students seeking higher education opportunities abroad. Successfully helped 200+ students achieve their academic goals.',
  },
  {
    title: 'SEO Expert',
    company: 'Injamul Hoque',
    duration: '2020 - Present',
    description: 'Developed and executed SEO strategies for multiple clients. Increased organic traffic by an average of 180% within 6 months for client websites.',
  },
  {
    title: 'Web Developer',
    company: 'Injamul Hoque',
    duration: '2019 - Present',
    description: 'Built responsive web applications using modern technologies. Delivered 10+ projects including e-commerce platforms, corporate websites, and web applications.',
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-14 bg-[#F9F9F7] text-[#121212] border-t border-black/5 relative overflow-hidden">
      <div className="container-narrow">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <ScrollReveal delay={0.1}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#FF5733]/25 text-[#FF5733] bg-[#FF5733]/5 mb-4">
              Experience
            </span>
          </ScrollReveal>
          <AnimatedHeading delay={0.2}>
            <h2 className="text-3xl md:text-5xl font-bold flex flex-col items-center justify-center gap-1">
              <span className="font-serif font-medium text-[#121212] italic">My</span>
              <span className="font-sans font-black uppercase tracking-tight text-[#FF5733]">Professional Journey</span>
            </h2>
          </AnimatedHeading>
        </div>

        {/* Experience Timeline - Compact Two-Column Alternating Layout */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line (hidden on mobile) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black/10 hidden md:block transform -translate-x-1/2" />

          {/* Left Line for Mobile Layout */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-black/10 md:hidden" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            
            {/* Left Column (Desktop) / Stacks normally on mobile */}
            <div className="space-y-8">
              {/* Card 1: Sales Officer */}
              <ScrollReveal direction="left" delay={0.1} className="relative">
                {/* Dot for Desktop (Right side of card) */}
                <div className="absolute right-[-34px] top-6 w-4.5 h-4.5 rounded-full bg-[#FF5733] border-4 border-white z-10 hidden md:block transform translate-x-1/2 shadow-sm" />
                {/* Dot for Mobile (Left side of container) */}
                <div className="absolute left-[-30px] top-6 w-3.5 h-3.5 rounded-full bg-[#FF5733] border-4 border-white z-10 md:hidden transform -translate-x-1/2 shadow-sm" />
                
                <div className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#FF5733]/30 hover:shadow-md transition-all duration-300 shadow-sm ml-6 md:ml-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-[#121212]">{experiences[0].title}</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF5733]/5 text-[#FF5733] border border-[#FF5733]/15">
                      {experiences[0].duration}
                    </span>
                  </div>
                  <p className="text-[#FF5733] font-semibold text-sm mb-3">{experiences[0].company}</p>
                  <p className="text-[#666666] text-xs md:text-sm leading-relaxed font-sans">
                    {experiences[0].description}
                  </p>
                </div>
              </ScrollReveal>

              {/* Card 3: SEO Expert */}
              <ScrollReveal direction="left" delay={0.3} className="relative">
                {/* Dot for Desktop (Right side of card) */}
                <div className="absolute right-[-34px] top-6 w-4.5 h-4.5 rounded-full bg-[#FF5733] border-4 border-white z-10 hidden md:block transform translate-x-1/2 shadow-sm" />
                {/* Dot for Mobile (Left side of container) */}
                <div className="absolute left-[-30px] top-6 w-3.5 h-3.5 rounded-full bg-[#FF5733] border-4 border-white z-10 md:hidden transform -translate-x-1/2 shadow-sm" />
                
                <div className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#FF5733]/30 hover:shadow-md transition-all duration-300 shadow-sm ml-6 md:ml-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-[#121212]">{experiences[2].title}</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF5733]/5 text-[#FF5733] border border-[#FF5733]/15">
                      {experiences[2].duration}
                    </span>
                  </div>
                  <p className="text-[#FF5733] font-semibold text-sm mb-3">{experiences[2].company}</p>
                  <p className="text-[#666666] text-xs md:text-sm leading-relaxed font-sans">
                    {experiences[2].description}
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column (Desktop) / Stacks normally on mobile */}
            <div className="space-y-8 md:pt-16">
              {/* Card 2: Education Consultant */}
              <ScrollReveal direction="right" delay={0.2} className="relative">
                {/* Dot for Desktop (Left side of card) */}
                <div className="absolute left-[-34px] top-6 w-4.5 h-4.5 rounded-full bg-[#FF5733] border-4 border-white z-10 hidden md:block transform -translate-x-1/2 shadow-sm" />
                {/* Dot for Mobile (Left side of container) */}
                <div className="absolute left-[-30px] top-6 w-3.5 h-3.5 rounded-full bg-[#FF5733] border-4 border-white z-10 md:hidden transform -translate-x-1/2 shadow-sm" />
                
                <div className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#FF5733]/30 hover:shadow-md transition-all duration-300 shadow-sm ml-6 md:ml-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-[#121212]">{experiences[1].title}</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF5733]/5 text-[#FF5733] border border-[#FF5733]/15">
                      {experiences[1].duration}
                    </span>
                  </div>
                  <p className="text-[#FF5733] font-semibold text-sm mb-3">{experiences[1].company}</p>
                  <p className="text-[#666666] text-xs md:text-sm leading-relaxed font-sans">
                    {experiences[1].description}
                  </p>
                </div>
              </ScrollReveal>

              {/* Card 4: Web Developer */}
              <ScrollReveal direction="right" delay={0.4} className="relative">
                {/* Dot for Desktop (Left side of card) */}
                <div className="absolute left-[-34px] top-6 w-4.5 h-4.5 rounded-full bg-[#FF5733] border-4 border-white z-10 hidden md:block transform -translate-x-1/2 shadow-sm" />
                {/* Dot for Mobile (Left side of container) */}
                <div className="absolute left-[-30px] top-6 w-3.5 h-3.5 rounded-full bg-[#FF5733] border-4 border-white z-10 md:hidden transform -translate-x-1/2 shadow-sm" />
                
                <div className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#FF5733]/30 hover:shadow-md transition-all duration-300 shadow-sm ml-6 md:ml-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-[#121212]">{experiences[3].title}</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF5733]/5 text-[#FF5733] border border-[#FF5733]/15">
                      {experiences[3].duration}
                    </span>
                  </div>
                  <p className="text-[#FF5733] font-semibold text-sm mb-3">{experiences[3].company}</p>
                  <p className="text-[#666666] text-xs md:text-sm leading-relaxed font-sans">
                    {experiences[3].description}
                  </p>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
