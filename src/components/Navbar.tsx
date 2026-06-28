import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Profile', href: '#experience' },
  { name: 'My Works', href: '#works' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll-to-section after cross-page navigation
  useEffect(() => {
    const pendingHash = sessionStorage.getItem('pendingScrollHash');
    if (pendingHash) {
      sessionStorage.removeItem('pendingScrollHash');
      const tryScroll = (attempts: number) => {
        const element = document.querySelector(pendingHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts > 0) {
          setTimeout(() => tryScroll(attempts - 1), 100);
        }
      };
      setTimeout(() => tryScroll(10), 100);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    
    // Apply theme to document
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Toggle dark class on document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    // Check if we're on the home page
    if (location.pathname === '/') {
      // We're on home page, use smooth scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // We're on a different page: store hash and navigate to home
      sessionStorage.setItem('pendingScrollHash', href);
      navigate('/');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-card/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Fades in only when scrolled */}
          <button
            onClick={() => {
              if (location.pathname === '/') {
                handleNavClick('#home');
              } else {
                navigate('/');
              }
            }}
            className={`text-2xl font-bold cursor-pointer transition-all duration-300 ${
              scrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <span className="gradient-text">Injamul Hoque</span>
            <span className="text-foreground">.</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 ml-auto mr-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`transition-colors duration-200 font-medium ${
                  scrolled
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Theme Toggle & CTA Button - Fades in only when scrolled */}
          <div className={`hidden md:flex items-center gap-4 transition-all duration-300 ${
            scrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none w-0 overflow-hidden'
          }`}>
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative w-9 h-9"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* CTA Button */}
            <Button
              variant="heroOutline"
              size="lg"
              onClick={() => handleNavClick('#contact')}
              className="gap-2"
            >
              Let's Talk <MessageCircle className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Theme Toggle */}
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="justify-start gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                )}
              </Button>

              <Button
                variant="hero"
                size="lg"
                onClick={() => handleNavClick('#contact')}
                className="mt-2"
              >
                Let's Talk <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
