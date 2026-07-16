import { Link } from 'react-router-dom'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Integrations', href: '#integrations' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#EEE7DA]">
      <div className="divider-organic" />

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-16 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
          {/* Brand — large, editorial */}
          <div>
            <Link to="/" className="group inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5E6B3F] shadow-soft transition-shadow duration-300 group-hover:shadow-card">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="3" width="12" height="12" rx="3" stroke="#FBF9F5" strokeWidth="1.5" />
                  <path
                    d="M6.5 9l2.5 2.5 4-4"
                    stroke="#FBF9F5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-[#2B2A26]">
                Weave
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#6D685F]">
              Connect your company's knowledge sources and chat with them. AI-powered answers
              with citations from every source you connect.
            </p>

            {/* Newsletter signup */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-[#2B2A26]">
                Stay updated
              </p>
              <div className="mt-3 flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 rounded-btn border border-[#DDD5C8] bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#2B2A26] placeholder:text-[#8A857D] outline-none transition-colors focus:border-[#5E6B3F]/50"
                  aria-label="Email for newsletter"
                />
                <button
                  className="rounded-btn bg-[#5E6B3F] px-4 py-2.5 text-sm font-medium text-[#FBF9F5] transition-colors hover:bg-[#49552F]"
                >
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                className="text-[#8A857D]/50 transition-colors hover:text-[#6D685F]"
                aria-label="Twitter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#8A857D]/50 transition-colors hover:text-[#6D685F]"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
                {col.title}
              </h4>
              <ul className="mt-6 space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#6D685F] transition-colors hover:text-[#2B2A26]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-20">
          <div className="divider-organic" />
          <div className="pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-[#8A857D]/60">
              &copy; {new Date().getFullYear()} Weave. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="text-xs text-[#8A857D]/60 transition-colors hover:text-[#6D685F]">
                Privacy
              </a>
              <a href="/terms" className="text-xs text-[#8A857D]/60 transition-colors hover:text-[#6D685F]">
                Terms
              </a>
              <a href="/security" className="text-xs text-[#8A857D]/60 transition-colors hover:text-[#6D685F]">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
