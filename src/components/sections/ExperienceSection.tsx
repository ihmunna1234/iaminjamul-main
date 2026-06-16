const experiences = [
  {
    title: 'Sales Officer',
    company: 'Abul KhairGroup',
    duration: '2021 - 2024',
    description: 'Leading B2C sales initiatives and managing key client relationships. Achieved 150% of annual sales targets through strategic account management and new client acquisition.',
    color: 'bg-orange-500',
  },
  {
    title: 'Education Consultant',
    company: 'A4 Admission Chittagong',
    duration: '2024 - 2025',
    description: 'Provided comprehensive guidance to students seeking higher education opportunities abroad. Successfully helped 200+ students achieve their academic goals.',
    color: 'bg-blue-500',
  },
  {
    title: 'SEO Expert',
    company: 'Injamul Hoque',
    duration: '2020 - Present',
    description: 'Developed and executed SEO strategies for multiple clients. Increased organic traffic by an average of 180% within 6 months for client websites.',
    color: 'bg-green-500',
  },
  {
    title: 'Web Developer',
    company: 'Injamul Hoque',
    duration: '2019 - Present',
    description: 'Built responsive web applications using modern technologies. Delivered 10+ projects including e-commerce platforms, corporate websites, and web applications.',
    color: 'bg-purple-500',
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="section-badge mb-4 inline-block">Experience</span>
          <h2 className="section-title">
            My <span className="gradient-text">Professional Journey</span>
          </h2>
        </div>

        {/* Experience Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

            {experiences.map((exp, index) => (
              <div
                key={exp.title}
                className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 animate-fade-in ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                {/* Content */}
                <div className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="card-hover bg-background rounded-2xl p-6 border border-border/50">
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <h3 className="text-xl font-semibold">{exp.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${exp.color}`}>
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-primary font-medium mb-3">{exp.company}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
