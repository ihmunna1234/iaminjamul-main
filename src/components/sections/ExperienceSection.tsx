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
    <section id="experience" className="py-24 bg-[#f7f7f7] text-black border-t border-black/5 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <ScrollReveal delay={0.1}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#A31414]/20 text-[#A31414] bg-[#A31414]/5 mb-4">
              Experience
            </span>
          </ScrollReveal>
          <AnimatedHeading delay={0.2}>
            <h2 className="text-3xl md:text-5xl font-bold flex flex-col items-center justify-center gap-1">
              <span className="font-serif font-medium text-black italic">My</span>
              <span className="font-sans font-black uppercase tracking-tight text-[#A31414]">Professional Journey</span>
            </h2>
          </AnimatedHeading>
        </div>

        {/* Experience Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line background */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-[#A31414]/10" />
            
            {/* Timeline line animated drawing */}
            <motion.div 
              className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-[#A31414]"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />

            {experiences.map((exp, index) => (
              <ScrollReveal
                key={exp.title}
                direction={index % 2 === 0 ? 'right' : 'left'}
                delay={0.3 + index * 0.2}
                className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#A31414] border-4 border-[#f7f7f7] z-10" />

                {/* Content */}
                <div className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:border-[#A31414]/30 hover:shadow-md transition-all duration-300">
                    <div className={`flex flex-wrap items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <h3 className="text-lg font-bold text-black">{exp.title}</h3>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#A31414]/5 text-[#A31414] border border-[#A31414]/15">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-[#A31414] font-semibold text-sm mb-3">{exp.company}</p>
                    <p className="text-black/60 text-xs md:text-sm leading-relaxed font-sans">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
