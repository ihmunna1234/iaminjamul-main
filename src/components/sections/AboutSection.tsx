import { TrendingUp, GraduationCap, Search, Code } from 'lucide-react';
import { FourPointStar } from '@/components/StarDecoration';

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
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20">
        <FourPointStar size="lg" className="text-primary" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="section-badge mb-4 inline-block">About Me</span>
          <h2 className="section-title">
            Know More <span className="gradient-text">About Me</span>
          </h2>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <div className="card-hover bg-card rounded-2xl p-6 text-center min-w-[150px]">
            <p className="text-4xl font-bold gradient-text mb-2">5+</p>
            <p className="text-muted-foreground text-sm">Years of Experience</p>
          </div>
          <div className="card-hover bg-card rounded-2xl p-6 text-center min-w-[150px]">
            <p className="text-4xl font-bold gradient-text mb-2">100+</p>
            <p className="text-muted-foreground text-sm">Projects Completed</p>
          </div>
          <div className="card-hover bg-card rounded-2xl p-6 text-center min-w-[150px]">
            <p className="text-4xl font-bold gradient-text mb-2">50+</p>
            <p className="text-muted-foreground text-sm">Happy Clients</p>
          </div>
        </div>

        {/* About Content */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-muted-foreground text-lg leading-relaxed">
            As a versatile professional, I bring a unique combination of skills in sales, education consulting, 
            SEO, and web development. With over 5 years of experience across these domains, I excel in 
            creating value-driven solutions that help businesses grow and individuals achieve their goals. 
            My passion lies in turning ideas into functional and aesthetically pleasing digital experiences.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.title}
              className="card-hover bg-card rounded-2xl p-6 border border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <skill.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {skill.description}
              </p>
              {/* Progress bar */}
              <div className="mt-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Proficiency</span>
                  <span className="font-semibold text-primary">{skill.percentage}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-bg rounded-full transition-all duration-1000"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
