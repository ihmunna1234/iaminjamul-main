import { useState } from 'react';
import { ExternalLink, Github, Globe, TrendingUp, Code, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    liveUrl: '#',
    githubUrl: '#',
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
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: '4',
    title: 'SaaS Dashboard',
    description: 'Feature-rich admin dashboard with real-time analytics, user management, and data visualization.',
    category: 'Web App',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    tags: ['React', 'Next.js', 'PostgreSQL', 'Chart.js'],
    liveUrl: '#',
    githubUrl: '#',
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
    <section id="works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <span className="section-badge mb-4 inline-block">Portfolio</span>
          <h2 className="section-title">
            My <span className="gradient-text">Work</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
            Explore my latest projects and successful campaigns
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="gap-2"
            >
              {category !== 'All' && getCategoryIcon(category)}
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image or Placeholder */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getCategoryIcon(project.category)}
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="section-badge text-xs flex items-center gap-1.5">
                    {getCategoryIcon(project.category)}
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Metrics (for SEO projects) */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                    {project.metrics.map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <p className="text-lg font-bold text-primary">{metric.value}</p>
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Links */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  {project.liveUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 group/btn"
                      onClick={() => window.open(project.liveUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      View Live
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 group/btn"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      <Github className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                      Code
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              No projects found in this category yet.
            </p>
            <Button variant="outline" onClick={() => setSelectedCategory('All')}>
              View All Projects
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
