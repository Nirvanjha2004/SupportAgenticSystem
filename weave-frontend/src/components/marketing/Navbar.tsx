import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Integrations', href: '#integrations' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 16)
      setHidden(currentY > 80 && currentY > lastScrollY.current)
      lastScrollY.current = currentY
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <motion.header
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#F5F1E8]/85 backdrop-blur-md'
          : 'bg-transparent'
      }`}
      style={{
        borderBottom: scrolled ? '1px solid #E8E2D8' : '1px solid transparent',
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          aria-label="Weave home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5E6B3F] shadow-soft transition-shadow duration-300 group-hover:shadow-card-hover">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
          <span className="font-display text-base font-semibold tracking-tight text-[#2B2A26]">
            Weave
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative px-3.5 py-2 text-sm text-[#6D685F] transition-colors hover:text-[#2B2A26]"
            >
              {link.label}
              <span className="absolute inset-x-3.5 bottom-0 h-px origin-left scale-x-0 bg-[#5E6B3F]/40 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/login"
            className="text-sm text-[#6D685F] transition-colors hover:text-[#2B2A26]"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-btn bg-[#5E6B3F] px-5 py-2.5 text-sm font-medium text-[#FBF9F5] shadow-soft transition-all duration-300 hover:bg-[#49552F] hover:shadow-card-hover active:scale-[0.97]"
          >
            Get started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#6D685F] transition-colors hover:bg-[#EEE7DA] hover:text-[#2B2A26] md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[#E8E2D8] bg-[#F5F1E8]/95 backdrop-blur-md md:hidden"
          >
            <div className="space-y-1 px-6 py-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm text-[#6D685F] transition-colors hover:bg-[#EEE7DA] hover:text-[#2B2A26]"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 border-t border-[#E8E2D8] pt-4">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm text-[#6D685F] transition-colors hover:bg-[#EEE7DA] hover:text-[#2B2A26]"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center justify-center rounded-btn bg-[#5E6B3F] px-5 py-3 text-sm font-medium text-[#FBF9F5] transition-all active:scale-[0.98]"
                >
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
