import { TrendingUp, GraduationCap, Search, Code } from 'lucide-react';
import { ScrollReveal } from '../animations/ScrollReveal';
import { AnimatedHeading } from '../animations/AnimatedHeading';
import { motion } from 'framer-motion';

const skills = [
  {
    icon: TrendingUp,
    title: 'Sales',
    description: 'Expert in B2B and B2C sales strategies, client relationship management, and achieving targets.',
    percentage: 90,
  },
  {
    icon: GraduationCap,
    title: 'Education Consulting',
    description: 'Helping students achieve their academic goals with personalized guidance and career counseling.',
    percentage: 85,
  },
  {
    icon: Search,
    title: 'SEO',
    description: 'Driving organic growth through technical SEO, content optimization, and link building strategies.',
    percentage: 88,
  },
  {
    icon: Code,
    title: 'Web Development',
    description: 'Building modern, responsive websites using React, TypeScript, and cutting-edge technologies.',
    percentage: 82,
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-14 bg-white text-[#121212] border-t border-black/5 relative overflow-hidden">
      <div className="container-narrow">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <ScrollReveal delay={0.1}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#FF5733]/25 text-[#FF5733] bg-[#FF5733]/5 mb-4 font-sans">
              About Me
            </span>
          </ScrollReveal>
          <AnimatedHeading delay={0.2}>
            <h2 className="text-3xl md:text-5xl font-bold flex flex-col items-center justify-center gap-1">
              <span className="font-serif font-medium text-[#121212] italic">Know More</span>
              <span className="font-sans font-black uppercase tracking-tight text-[#FF5733]">About Me</span>
            </h2>
          </AnimatedHeading>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-16">
          {[
            { value: '5+', label: 'Years of Experience' },
            { value: '100+', label: 'Projects Completed' },
            { value: '50+', label: 'Happy Clients' }
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={0.3 + i * 0.1}>
              <div className="bg-[#F9F9F7] border border-black/5 hover:border-[#FF5733]/30 rounded-2xl p-6 text-center min-w-[160px] transition-all duration-300 shadow-sm hover:shadow-md">
                <p className="text-4xl md:text-5xl font-black text-[#FF5733] mb-2 font-sans">{stat.value}</p>
                <p className="text-[#666666] text-xs md:text-sm font-medium">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* About Content */}
        <ScrollReveal delay={0.4} className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-[#666666] text-base md:text-lg leading-relaxed font-sans">
            As a versatile professional, I bring a unique combination of skills in sales, education consulting, 
            SEO, and web development. With over 5 years of experience across these domains, I excel in 
            creating value-driven solutions that help businesses grow and individuals achieve their goals. 
            My passion lies in turning ideas into functional and aesthetically pleasing digital experiences.
          </p>
        </ScrollReveal>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <ScrollReveal
              key={skill.title}
              delay={0.2 + index * 0.1}
            >
              <div className="bg-white border border-black/5 hover:border-[#FF5733]/30 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full shadow-sm">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center mb-5">
                    <skill.icon className="w-6 h-6 text-[#FF5733]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#121212]">{skill.title}</h3>
                  <p className="text-[#666666] text-xs md:text-sm mb-6 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-auto pt-4 border-t border-black/5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#666666]/50">Proficiency</span>
                    <span className="font-semibold text-[#FF5733]">{skill.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#FF5733] to-[#FF8b73] rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
