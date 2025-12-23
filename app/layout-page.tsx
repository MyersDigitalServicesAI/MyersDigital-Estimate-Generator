import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyersDigital Estimate Generator',
  description: 'Real-time construction project estimates with competitive pricing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  @apply box-border;
}

body {
  @apply bg-slate-50 text-slate-900;
}

.container {
  @apply max-w-7xl mx-auto px-4;
}

.btn {
  @apply px-4 py-2 rounded-lg font-semibold transition-all duration-200;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg;
}

.btn-secondary {
  @apply bg-slate-200 text-slate-900 hover:bg-slate-300;
}

.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700;
}

.card {
  @apply bg-white rounded-lg border border-slate-200 shadow-sm p-6;
}

.input-field {
  @apply w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-semibold text-slate-700 mb-2;
}

// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        router.push('/app/dashboard')
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">⚙️ MyersDigital</h1>
        <h2 className="text-3xl text-blue-100 mb-6">Estimate Generator</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Generate professional construction estimates in seconds with real-time competitive pricing. 
          Perfect for HVAC, plumbing, electrical, and all construction trades.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-bold mb-2">Real-Time Pricing</h3>
          <p className="text-sm text-slate-600">Get live market data by county</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-bold mb-2">Competitive Analysis</h3>
          <p className="text-sm text-slate-600">See what competitors are charging</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="text-3xl mb-3">📧</div>
          <h3 className="font-bold mb-2">One-Click Export</h3>
          <p className="text-sm text-slate-600">Download PDF or email to client</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/auth/signup">
          <button className="btn btn-primary px-8 py-3 text-lg">Get Started Free</button>
        </Link>
        <Link href="/auth/login">
          <button className="btn btn-secondary px-8 py-3 text-lg">Sign In</button>
        </Link>
      </div>

      <div className="mt-16 text-center text-blue-100">
        <p className="text-sm">Free forever • No credit card required • Unlimited estimates</p>
      </div>
    </div>
  )
}
