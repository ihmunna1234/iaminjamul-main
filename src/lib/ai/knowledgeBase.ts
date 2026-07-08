export interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'about' | 'experience' | 'skills' | 'services' | 'projects' | 'certifications' | 'testimonials' | 'faqs' | 'contact';
  content: string;
  tags: string[];
}

export const knowledgeBase: KnowledgeDoc[] = [
  // ─── ABOUT & PROFILE ───────────────────────────────────────────────────────
  {
    id: 'profile-injamul',
    title: 'Who is Injamul Hoque?',
    category: 'about',
    content: 'Injamul Hoque (also known as Munna) is a versatile digital professional with over 7 years of experience spanning web development, SEO, sales officer roles, and education consulting. He is passionate about turning ideas into functional, beautiful, and business-focused digital experiences. Injamul has completed 100+ projects and worked with 50+ happy clients globally.',
    tags: ['about', 'injamul hoque', 'profile', 'experience', 'who is', 'munna']
  },
  {
    id: 'profile-stats',
    title: 'Injamul Hoque Stats & Experience Summary',
    category: 'about',
    content: 'Injamul Hoque has: \n- 7+ Years of Professional Experience \n- 100+ Projects Completed successfully \n- 50+ Happy Clients \n- Dual expertise in technical fields (Web Development, SEO) and client-facing fields (Sales, Education Consulting).',
    tags: ['stats', 'experience', 'projects', 'clients', 'years']
  },

  // ─── SKILLS ────────────────────────────────────────────────────────────────
  {
    id: 'skills-overview',
    title: 'Injamul Hoque Skills & Proficiencies',
    category: 'skills',
    content: 'Injamul Hoque possesses a robust skillset across technical and consulting domains: \n' +
      '1. Sales: Expert in B2B and B2C sales strategies, client relationship management, and achieving targets (90% proficiency).\n' +
      '2. Education Consulting: Personalized guidance and career counseling for students seeking study abroad opportunities (85% proficiency).\n' +
      '3. SEO (Search Engine Optimization): Driving organic growth through technical SEO audits, keyword research, on-page optimization, and link building (88% proficiency).\n' +
      '4. Web Development: Building modern, responsive web applications using React, TypeScript, Node.js, and Tailwind CSS (82% proficiency).',
    tags: ['skills', 'technologies', 'sales', 'seo', 'web development', 'education consulting', 'languages', 'react', 'typescript']
  },

  // ─── EXPERIENCE ────────────────────────────────────────────────────────────
  {
    id: 'exp-sales-officer',
    title: 'Experience: Sales Officer at Abul Khair Group',
    category: 'experience',
    content: 'Role: Sales Officer at Abul Khair Group (2021 - 2024). Injamul led B2C sales initiatives and managed key client relationships. He achieved 150% of annual sales targets through strategic account management and new client acquisition.',
    tags: ['experience', 'sales officer', 'abul khair group', 'b2c sales', 'targets', 'client relationships']
  },
  {
    id: 'exp-education-consultant',
    title: 'Experience: Education Consultant at A4 Admission Chittagong',
    category: 'experience',
    content: 'Role: Education Consultant at A4 Admission Chittagong (2024 - 2025). Provided comprehensive guidance to students seeking higher education opportunities abroad. Successfully helped 200+ students achieve their academic goals and secure placements.',
    tags: ['experience', 'education consultant', 'a4 admission', 'chittagong', 'study abroad', 'career counseling']
  },
  {
    id: 'exp-seo-expert',
    title: 'Experience: SEO Expert (Independent)',
    category: 'experience',
    content: 'Role: SEO Expert (2020 - Present). Developed and executed SEO strategies for multiple international clients. Increased organic traffic by an average of 180% within 6 months for client websites.',
    tags: ['experience', 'seo expert', 'seo specialist', 'organic traffic', 'ranking', 'strategy']
  },
  {
    id: 'exp-web-developer',
    title: 'Experience: Web Developer (Freelance & Independent)',
    category: 'experience',
    content: 'Role: Web Developer (2019 - Present). Built responsive web applications using modern front-end and back-end technologies. Delivered 10+ projects including e-commerce platforms, corporate websites, SaaS dashboards, and custom software.',
    tags: ['experience', 'web developer', 'projects', 'freelance', 'react', 'tailwind']
  },

  // ─── SERVICES ──────────────────────────────────────────────────────────────
  {
    id: 'services-overview',
    title: 'Services Offered by Injamul',
    category: 'services',
    content: 'Injamul Hoque offers the following professional services:\n' +
      '- Custom Web Development: Front-end (React, TypeScript, Tailwind CSS) and Back-end development, Admin Dashboards, Payment Integrations (Stripe, Paypal), CRM Systems, SaaS platforms, and mobile optimization.\n' +
      '- SEO Optimization: Technical SEO Audits, Local SEO, Keyword Research, On-Page SEO (meta tags, titles, headings, structural markup), Speed Optimization, and Content Marketing Strategy.\n' +
      '- Sales & Lead Qualification: Consultation for sales pipelines, client outreach, B2B/B2C strategies, and customer relationship setup.\n' +
      '- Education Consulting: Career counseling, study abroad application assistance, university search, and visa guidance.',
    tags: ['services', 'what he offers', 'web development', 'seo', 'sales consulting', 'crm', 'saas', 'wordpress', 'static websites']
  },

  // ─── PORTFOLIO / PROJECTS ──────────────────────────────────────────────────
  {
    id: 'project-ecommerce',
    title: 'Project: E-Commerce Platform',
    category: 'projects',
    content: 'Description: A full-featured e-commerce website with product catalogs, shopping cart, secure payment integration (Stripe), product management dashboards, and user authentication. Built using React, Node.js, MongoDB, and Stripe.',
    tags: ['projects', 'e-commerce', 'online store', 'stripe', 'payments', 'react', 'mongodb', 'node.js']
  },
  {
    id: 'project-seo-startup',
    title: 'Project: SEO Campaign for Tech Startup',
    category: 'projects',
    content: 'Description: Designed and executed a comprehensive SEO strategy for a growing tech startup. Deliverables included structural audits, keyword mapping, content plan, and backlink outreach. Results: Increased organic traffic by 250%, achieved 45+ keywords in Top 10 rankings, and increased Domain Authority (DA) by 18 points.',
    tags: ['projects', 'seo', 'campaign', 'traffic', 'rankings', 'analytics', 'growth', 'domain authority']
  },
  {
    id: 'project-corporate-portfolio',
    title: 'Project: Corporate Portfolio Website',
    category: 'projects',
    content: 'Description: Modern, responsive portfolio website featuring smooth scroll effects, animations, an interactive contact form, and blog integration. Technologies: React, TypeScript, Tailwind CSS, and Framer Motion.',
    tags: ['projects', 'corporate website', 'portfolio', 'animations', 'typescript', 'tailwind css', 'framer motion']
  },
  {
    id: 'project-saas-dashboard',
    title: 'Project: SaaS Analytics Dashboard',
    category: 'projects',
    content: 'Description: A feature-rich administration dashboard displaying real-time analytics, user access controls, graphs, charts, and invoice tracking. Built with React, Next.js, PostgreSQL, and Chart.js.',
    tags: ['projects', 'saas', 'dashboard', 'analytics', 'data visualization', 'postgresql', 'next.js']
  },
  {
    id: 'project-local-seo',
    title: 'Project: Local SEO for Restaurant Chain',
    category: 'projects',
    content: 'Description: Executed local search optimization for a local multi-location restaurant chain. Optimized Google Business Profiles, built local citations, and improved review gathering. Results: Top 3 Local Map Pack rankings, +180% online orders, and +65% in-store foot traffic.',
    tags: ['projects', 'local seo', 'restaurant', 'google business profile', 'orders', 'citations']
  },
  {
    id: 'project-realestate',
    title: 'Project: Real Estate Portal',
    category: 'projects',
    content: 'Description: Interactive property listing platform with advanced map integrations, virtual tours, dynamic search filters (price, area, bedrooms), and agent/agency management dashboards. Technologies: React, Firebase, Google Maps API, and Image Gallery.',
    tags: ['projects', 'real estate', 'property', 'maps api', 'firebase', 'filters', 'virtual tour']
  },

  // ─── CERTIFICATIONS ────────────────────────────────────────────────────────
  {
    id: 'cert-aws',
    title: 'Certification: AWS Certified Solutions Architect',
    category: 'certifications',
    content: 'Issuer: Amazon Web Services (AWS) | Issued: January 2024 | Valid Until: January 2027 | Credential ID: AWS-SA-2024-12345. Validates expertise in designing and deploying scalable, highly available, secure, and cost-optimized distributed systems on the AWS platform.',
    tags: ['certifications', 'aws', 'cloud architecture', 'solutions architect', 'security']
  },
  {
    id: 'cert-react',
    title: 'Certification: Meta React Developer',
    category: 'certifications',
    content: 'Issuer: Meta | Issued: June 2023 | Valid Until: Lifetime | Credential ID: META-REACT-2023-67890. Covers advanced React.js concepts, custom hooks, state management, components lifecycle, and responsive design performance.',
    tags: ['certifications', 'react', 'meta', 'hooks', 'state management', 'web development']
  },
  {
    id: 'cert-fullstack',
    title: 'Certification: Full Stack Web Development',
    category: 'certifications',
    content: 'Issuer: freeCodeCamp | Issued: March 2023 | Valid Until: Lifetime | Credential ID: FCC-FULLSTACK-2023-11223. Completed 1,800+ hours of curriculum and project builds covering HTML, CSS, JavaScript, Node.js, Express, MongoDB, and RESTful APIs.',
    tags: ['certifications', 'full stack', 'freecodecamp', 'javascript', 'node.js', 'mongodb']
  },
  {
    id: 'cert-scrum',
    title: 'Certification: Professional Scrum Master (PSM I)',
    category: 'certifications',
    content: 'Issuer: Scrum.org | Issued: September 2022 | Valid Until: Lifetime | Credential ID: SCRUM-PSM-2022-44556. Demonstrates deep understanding of the Scrum framework, Agile values, sprint management, team facilitation, and product backlog management.',
    tags: ['certifications', 'scrum master', 'agile', 'scrum.org', 'sprints', 'methodology']
  },

  // ─── TESTIMONIALS ──────────────────────────────────────────────────────────
  {
    id: 'testimonial-sarah',
    title: 'Testimonial from Sarah Johnson (CEO, TechStartup)',
    category: 'testimonials',
    content: '"Thanks to Injamul for their professional work. The website they created for my business exceeded my expectations, and my clients have given positive feedback about its design and user-friendliness." (Upwork Client, 5/5 stars rating)',
    tags: ['testimonials', 'upwork', 'sarah johnson', 'ceo', 'web development', 'reviews']
  },
  {
    id: 'testimonial-michael',
    title: 'Testimonial from Michael Chen (Marketing Director)',
    category: 'testimonials',
    content: '"Excellent SEO work! Our website traffic increased by 200% within three months. Injamul is a true professional who delivers results." (Fiverr Client, 5/5 stars rating)',
    tags: ['testimonials', 'fiverr', 'michael chen', 'seo', 'traffic', 'reviews']
  },
  {
    id: 'testimonial-emily',
    title: 'Testimonial from Emily Davis (Business Owner)',
    category: 'testimonials',
    content: '"As an education consultant, Injamul helped me reach more students than ever before. His expertise in sales and marketing is outstanding." (LinkedIn Client, 5/5 stars rating)',
    tags: ['testimonials', 'linkedin', 'emily davis', 'education consulting', 'sales', 'reviews']
  },
  {
    id: 'testimonial-david',
    title: 'Testimonial from David Rodriguez (E-commerce Manager)',
    category: 'testimonials',
    content: '"Working with Injamul transformed our online presence. His web development skills are top-notch, and the attention to detail is remarkable. Highly recommended!" (Upwork Client, 5/5 stars rating)',
    tags: ['testimonials', 'upwork', 'david rodriguez', 'e-commerce', 'reviews']
  },

  // ─── FAQS & PRICING ────────────────────────────────────────────────────────
  {
    id: 'faq-pricing',
    title: 'What are Injamul Hoque\'s rates and pricing?',
    category: 'faqs',
    content: 'Injamul\'s rates vary depending on the project scope and complexity:\n' +
      '- Static Website Development: Packages start from $28.\n' +
      '- WordPress Development: Packages start from $48.\n' +
      '- Custom Web Apps, Dashboards, and CRMs: Custom quotes based on specifications.\n' +
      '- SEO / Consulting Work: Hourly and monthly retainer packages are available.\n' +
      'Disclaimer: Final pricing depends on project requirements and complexity.',
    tags: ['pricing', 'rates', 'cost', 'fee', 'static site', 'wordpress', 'custom app', 'retainer']
  },
  {
    id: 'faq-timelines',
    title: 'What are the typical project timelines?',
    category: 'faqs',
    content: 'Project timelines depend on complexity. A simple landing page takes 3-5 days, while a full website or web application takes 2-4 weeks. A clear, customized timeline estimate is always provided before starting any project.',
    tags: ['timeline', 'delivery', 'time', 'how long', 'sprint', 'schedule']
  },
  {
    id: 'faq-support',
    title: 'Is there ongoing post-project support?',
    category: 'faqs',
    content: 'Yes! Post-project maintenance packages are available, including website maintenance, regular SEO monitoring, software updates, and content management. Ongoing support is discussed and structured after project completion.',
    tags: ['support', 'maintenance', 'updates', 'post-project', 'seo monitoring']
  },
  {
    id: 'faq-communication',
    title: 'How does Injamul communicate during projects?',
    category: 'faqs',
    content: 'Injamul prefers WhatsApp for quick daily updates and messages, email for detailed briefs/files, and Zoom/Google Meet video calls for project kickoffs, reviews, and feedback. He is flexible and adapts to the client\'s preferred communication tools.',
    tags: ['communication', 'contact', 'whatsapp', 'email', 'meetings', 'calls']
  },

  // ─── CONTACT INFO ──────────────────────────────────────────────────────────
  {
    id: 'contact-details',
    title: 'How to contact Injamul Hoque directly?',
    category: 'contact',
    content: 'You can contact Injamul Hoque directly using: \n' +
      '- Email: ihmunna1234@gmail.com or ihmunna212@gmail.com \n' +
      '- Phone / Mobile: +966 582 822 130 \n' +
      '- WhatsApp: +966 582 822 130 (Direct WhatsApp Link: https://wa.me/966582822130) \n' +
      '- Location: Makkah, Saudi Arabia \n' +
      'Alternatively, you can submit the contact form at the bottom of the home page.',
    tags: ['contact', 'email', 'phone', 'whatsapp', 'location', 'makkah', 'saudi arabia', 'socials']
  }
];
