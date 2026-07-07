export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-black/5 bg-[#121212]">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <button
              onClick={() => {
                if (window.location.pathname === '/') {
                  document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/';
                }
              }}
              className="cursor-pointer"
            >
              <span className="font-sans text-xl font-black text-white tracking-tight">
                Injamul.Hoque
              </span>
            </button>
          </div>
          
          <p className="text-white/60 text-sm flex items-center gap-1 font-medium tracking-wide">
            © {currentYear} <span className="text-[#FF5733]">INJAMUL HOQUE</span> • ARCHITECTING THE FUTURE
          </p>
          
          <div className="flex gap-6">
            <a
              href="https://github.com/ihmunna1234"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-white/40 hover:text-[#FF5733] transition-colors text-sm font-medium"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/injamul-hoque-164988224"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/40 hover:text-[#FF5733] transition-colors text-sm font-medium"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/ihmunna212"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-white/40 hover:text-[#FF5733] transition-colors text-sm font-medium"
            >
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
