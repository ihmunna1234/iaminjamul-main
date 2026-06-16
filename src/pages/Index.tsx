import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { MyWorkSection } from '@/components/sections/MyWorkSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { PhotoGallerySection } from '@/components/sections/PhotoGallerySection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { BlogSection } from '@/components/sections/BlogSection';
import { FreelanceCTASection } from '@/components/sections/FreelanceCTASection';
import { FAQSection } from '@/components/sections/FAQSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <MyWorkSection />
        <CertificationsSection />
        <PhotoGallerySection />
        <TestimonialsSection />
        <BlogSection />
        <FreelanceCTASection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
