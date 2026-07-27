import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Integrations', href: '#integrations' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 16);
      setHidden(currentY > 80 && currentY > lastScrollY.current);
      lastScrollY.current = currentY;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [mobileOpen]);

  return (
    <motion.header
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#F5F1E8]/85 backdrop-blur-xl shadow-warm border-b border-[#E8E2D8]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label="Weave home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5E6B3F] shadow-soft transition-all duration-300 group-hover:shadow-warm-lg group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 4a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
                stroke="#FBF9F5"
                strokeWidth="1.5"
              />
              <path
                d="M5.5 8L7.5 10L10.5 6"
                stroke="#FBF9F5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-[#2B2A26]">
            Weave
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative px-4 py-2.5 text-sm font-medium text-[#6D685F] transition-colors hover:text-[#2B2A26]"
            >
              {link.label}
              <span className="absolute inset-x-4 bottom-0 h-[2px] origin-left scale-x-0 bg-[#5E6B3F]/40 transition-transform duration-300 group-hover:scale-x-100 rounded-full" />
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-[#6D685F] transition-colors hover:text-[#2B2A26]"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-btn bg-[#5E6B3F] px-5 py-2.5 text-sm font-semibold text-[#FBF9F5] shadow-soft transition-all duration-300 hover:bg-[#49552F] hover:shadow-warm-lg active:scale-[0.97]"
          >
            Get started
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative flex h-12 w-12 items-center justify-center rounded-xl text-[#6D685F] transition-all duration-300 hover:bg-[#EEE7DA] hover:text-[#2B2A26] md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="overflow-hidden border-t border-[#E8E2D8] bg-[#F5F1E8]/98 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-2 px-6 py-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl px-5 py-4 text-base font-medium text-[#6D685F] transition-all duration-300 hover:bg-[#EEE7DA] hover:text-[#2B2A26]"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4" />
                </a>
              ))}
              <div className="mt-8 space-y-3 pt-6 border-t border-[#E8E2D8]">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-xl px-5 py-4 text-base font-medium text-[#6D685F] transition-all duration-300 hover:bg-[#EEE7DA] hover:text-[#2B2A26]"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2 rounded-btn bg-[#5E6B3F] px-5 py-4 text-base font-semibold text-[#FBF9F5] transition-all active:scale-[0.98]"
                >
                  Get started
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
