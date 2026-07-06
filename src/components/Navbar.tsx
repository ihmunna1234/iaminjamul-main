import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#works' },
  { name: 'Experience', href: '#experience' },
  { name: 'Expertise', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    if (location.pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      sessionStorage.setItem('pendingScrollHash', href);
      navigate('/');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              if (location.pathname === '/') {
                handleNavClick('#home');
              } else {
                navigate('/');
              }
            }}
            className="cursor-pointer"
          >
            <span className="font-sans text-xl md:text-2xl font-black text-[#121212] tracking-tight">
              INJAMUL.EXE
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-[#121212]/70 hover:text-[#FF5733] transition-colors duration-200 font-medium text-sm tracking-wide"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => handleNavClick('#contact')}
              className="px-6 py-2 bg-[#121212] hover:bg-[#FF5733] text-white font-semibold text-sm rounded-lg transition-all duration-300"
            >
              Hire Me
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#121212]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in bg-white border border-black/5 rounded-xl p-4 shadow-lg">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-[#121212]/70 hover:text-[#FF5733] transition-colors duration-200 font-medium py-2"
                >
                  {item.name}
                </a>
              ))}

              <button
                onClick={() => handleNavClick('#contact')}
                className="mt-2 px-6 py-3 bg-[#121212] hover:bg-[#FF5733] text-white font-semibold text-sm rounded-lg transition-all duration-300 w-full"
              >
                Hire Me
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
