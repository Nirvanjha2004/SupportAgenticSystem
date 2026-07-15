import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-[440px] rounded-card border border-line bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Log in</h1>
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setError('Invalid credentials') }}>
          <div>
            <label className="text-xs font-medium text-text-muted">Email</label>
            <input type="email" className="mt-1 h-10 w-full rounded-btn border border-line bg-surface-raised px-3 text-sm text-text-primary focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted">Password</label>
            <div className="relative mt-1">
              <input type={show ? 'text' : 'password'} className="h-10 w-full rounded-btn border border-line bg-surface-raised px-3 pr-10 text-sm text-text-primary focus:border-accent focus:outline-none" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-signal-red">{error}</p>}
          <button type="submit" className="h-10 w-full rounded-btn bg-accent text-sm font-medium text-white hover:opacity-90">Log in</button>
        </form>
        <p className="mt-4 text-center text-xs text-text-muted">
          No account? <Link to="/signup" className="text-accent hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
