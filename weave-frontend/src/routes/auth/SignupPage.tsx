import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function SignupPage() {
  const [error] = useState('')

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-[440px] rounded-card border border-line bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Sign up</h1>
        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-xs font-medium text-text-muted">Email</label>
            <input type="email" className="mt-1 h-10 w-full rounded-btn border border-line bg-surface-raised px-3 text-sm text-text-primary focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted">Password</label>
            <input type="password" className="mt-1 h-10 w-full rounded-btn border border-line bg-surface-raised px-3 text-sm text-text-primary focus:border-accent focus:outline-none" />
          </div>
          {error && <p className="text-xs text-signal-red">{error}</p>}
          <button type="submit" className="h-10 w-full rounded-btn bg-accent text-sm font-medium text-white hover:opacity-90">Create account</button>
        </form>
        <p className="mt-4 text-center text-xs text-text-muted">
          Already have an account? <Link to="/login" className="text-accent hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
