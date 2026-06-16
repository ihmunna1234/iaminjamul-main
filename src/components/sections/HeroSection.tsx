import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypewriterText } from '@/components/TypewriterText';
import { FourPointStar } from '@/components/StarDecoration';
import profilePhoto from '@/assets/profile-photo.jpg';

const roles = [
  'Sales Officer',
  'Education Consultant',
  'SEO Expert',
  'Web Developer',
];

export function HeroSection() {
  const handleContactClick = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 pb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 opacity-10">
          <FourPointStar size="lg" className="text-foreground" filled={false} />
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-10">
          <FourPointStar size="md" className="text-foreground" filled />
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Hey 👋 I'm{' '}
              <span className="gradient-text text-4xl md:text-5xl lg:text-6xl">Injamul Hoque</span>
            </h1>
            
            <div className="mb-6">
              <TypewriterText texts={roles} />
            </div>
            
            <p className="text-muted-foreground text-lg mb-8 max-w-lg leading-relaxed">
              Hi, my name is Injamul Hoque. I'm a versatile professional with expertise in sales, education consulting, SEO, and web development. I'm passionate about creating value and helping businesses grow.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="xl" onClick={handleContactClick} className="gap-2">
                Hire Me Now <ArrowUpRight className="w-5 h-5" />
              </Button>
              
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=100068977550578&rdid=8gtb9bj0VtbSH2TV&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1FBY6xZRZ1%2F#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/injamul-hoque-164988224?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in-right" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              {/* Decorative elements */}
              <FourPointStar size="lg" className="text-primary absolute -top-4 -right-4 animate-float" />
              <FourPointStar size="md" className="text-primary absolute top-1/4 -right-8 opacity-70" />
              
              {/* Main image container */}
              <div className="relative w-72 md:w-80 lg:w-96">
                <div className="absolute inset-0 bg-primary rounded-2xl transform rotate-6 opacity-90" />
                <div className="relative bg-primary rounded-2xl overflow-hidden">
                  <img
                    src={profilePhoto}
                    alt="Injamul Hoque"
                    className="w-full h-auto "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
