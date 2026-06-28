import { useState } from 'react';
import { ExternalLink, Github, Globe, TrendingUp, Code, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '../animations/ScrollReveal';
import { AnimatedHeading } from '../animations/AnimatedHeading';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Website' | 'SEO' | 'Web App' | 'E-commerce';
  image?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce website with payment integration, product management, and user authentication.',
    category: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: undefined,
    githubUrl: undefined,
  },
  {
    id: '2',
    title: 'SEO Campaign - Tech Startup',
    description: 'Increased organic traffic by 250% through comprehensive SEO strategy, keyword optimization, and content marketing.',
    category: 'SEO',
    tags: ['SEO', 'Google Analytics', 'Content Strategy', 'Link Building'],
    metrics: [
      { label: 'Traffic Increase', value: '+250%' },
      { label: 'Keyword Rankings', value: '45+ Top 10' },
      { label: 'Domain Authority', value: '+18' },
    ],
  },
  {
    id: '3',
    title: 'Corporate Portfolio Website',
    description: 'Modern, responsive portfolio website with smooth animations, contact forms, and blog integration.',
    category: 'Website',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: undefined,
    githubUrl: undefined,
  },
  {
    id: '4',
    title: 'SaaS Dashboard',
    description: 'Feature-rich admin dashboard with real-time analytics, user management, and data visualization.',
    category: 'Web App',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    tags: ['React', 'Next.js', 'PostgreSQL', 'Chart.js'],
    liveUrl: undefined,
    githubUrl: undefined,
  },
  {
    id: '5',
    title: 'Local Business SEO',
    description: 'Local SEO optimization for a restaurant chain, resulting in increased foot traffic and online orders.',
    category: 'SEO',
    tags: ['Local SEO', 'Google My Business', 'Citations', 'Reviews'],
    metrics: [
      { label: 'Local Rankings', value: 'Top 3' },
      { label: 'Online Orders', value: '+180%' },
      { label: 'Foot Traffic', value: '+65%' },
    ],
  },
  {
    id: '6',
    title: 'Real Estate Platform',
    description: 'Property listing website with advanced search filters, virtual tours, and agent management system.',
    category: 'Website',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    tags: ['React', 'Firebase', 'Maps API', 'Image Gallery'],
    liveUrl: '#',
  },
];

const categories = ['All', 'Website', 'SEO', 'Web App', 'E-commerce'];

export function MyWorkSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Website':
        return <Globe className="w-4 h-4" />;
      case 'SEO':
        return <TrendingUp className="w-4 h-4" />;
      case 'Web App':
        return <Code className="w-4 h-4" />;
      case 'E-commerce':
        return <Palette className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <section id="works" className="py-24 bg-[#111111] text-white border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <ScrollReveal delay={0.1}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#e49797]/30 text-[#e49797] bg-[#e49797]/5 mb-4">
              Portfolio
            </span>
          </ScrollReveal>
          <AnimatedHeading delay={0.2}>
            <h2 className="text-3xl md:text-5xl font-bold flex flex-col items-center justify-center gap-1">
              <span className="font-serif font-medium text-white italic">My</span>
              <span className="font-sans font-black uppercase tracking-tight text-[#e49797]">Work</span>
            </h2>
          </AnimatedHeading>
          <ScrollReveal delay={0.3}>
            <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto mt-4 font-sans leading-relaxed">
              Explore my latest projects and successful campaigns
            </p>
          </ScrollReveal>
        </div>

        {/* Category Filter */}
        <ScrollReveal delay={0.4} className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-[#e49797] text-[#1a0505] shadow-md scale-105'
                    : 'border border-white/10 text-white/70 hover:text-white hover:border-white/30 bg-transparent'
                }`}
              >
                {category !== 'All' && getCategoryIcon(category)}
                {category}
              </button>
            );
          })}
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={0.2 + index * 0.1} className="h-full">
            <article
              className="group h-full bg-white/5 border border-white/10 hover:border-[#e49797]/30 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:bg-white/10"
            >
              <div>
                {/* Project Image or Placeholder */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#A31414]/20 to-[#A31414]/5 border-b border-white/5">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      {getCategoryIcon(project.category)}
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#e49797]/30 text-[#e49797] bg-[#111111]/80 backdrop-blur-sm">
                      {getCategoryIcon(project.category)}
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-white group-hover:text-[#e49797] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-xs md:text-sm mb-4 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Metrics (for SEO projects) */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
                      {project.metrics.map((metric, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-base font-black text-[#e49797]">{metric.value}</p>
                          <p className="text-[10px] text-white/40 uppercase font-medium">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2.5 py-1 bg-[#e49797]/5 text-[#e49797] border border-[#e49797]/15 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 bg-white/5 text-white/50 border border-white/10 rounded-full">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="p-6 pt-0 mt-4">
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  {project.liveUrl && (
                    <button
                      className="flex-1 py-2 px-4 rounded-xl border border-white/10 hover:border-[#e49797]/30 hover:bg-[#e49797]/5 text-white/70 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      onClick={() => window.open(project.liveUrl, '_blank')}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Live
                    </button>
                  )}
                  {project.githubUrl && (
                    <button
                      className="flex-1 py-2 px-4 rounded-xl border border-white/10 hover:border-[#e49797]/30 hover:bg-[#e49797]/5 text-white/70 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      <Github className="w-3.5 h-3.5" />
                      Code
                    </button>
                  )}
                </div>
              </div>
            </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-base mb-4">
              No projects found in this category yet.
            </p>
            <button
              className="px-5 py-2.5 rounded-full border border-white/10 text-white/80 hover:text-white hover:border-white/30 text-xs font-bold uppercase tracking-wider"
              onClick={() => setSelectedCategory('All')}
            >
              View All Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
