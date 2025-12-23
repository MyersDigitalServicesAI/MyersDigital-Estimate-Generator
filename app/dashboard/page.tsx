'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [estimates, setEstimates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      setUser(session.user)

      // Fetch user estimates
      const { data: estimatesData } = await supabase
        .from('estimates')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (estimatesData) {
        setEstimates(estimatesData)
      }

      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">⚙️ MyersDigital</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
            <p className="text-slate-600">Welcome back! Create or view your estimates.</p>
          </div>
          <Link href="/app/estimates/new">
            <button className="btn btn-primary py-3 px-6">+ New Estimate</button>
          </Link>
        </div>

        {/* Estimates List */}
        <div className="grid gap-6">
          {estimates.length === 0 ? (
            <div className="card text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No estimates yet</h3>
              <p className="text-slate-600 mb-4">Create your first estimate to get started</p>
              <Link href="/app/estimates/new">
                <button className="btn btn-primary">Create Estimate</button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {estimates.map((estimate) => (
                <Link key={estimate.id} href={`/app/estimates/${estimate.id}`}>
                  <div className="card hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-slate-600">{estimate.estimate_number}</div>
                        <h3 className="font-semibold text-lg">{estimate.client_name}</h3>
                        <p className="text-sm text-slate-600">{estimate.project_type} • {estimate.county}, {estimate.state}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`text-xs font-semibold px-2 py-1 rounded mt-2 ${
                          estimate.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {estimate.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-3">
                      {new Date(estimate.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// app/app/estimates/new/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EstimateForm from '@/components/EstimateForm'

export default function NewEstimate() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/auth/login')
        return
      }
      setUser(session.user)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-slate-900">⚙️ MyersDigital</h1>
        </div>
      </header>

      <div className="container py-8">
        <Link href="/app/dashboard">
          <button className="text-blue-600 hover:underline mb-4">← Back to Dashboard</button>
        </Link>
        <EstimateForm userId={user?.id} />
      </div>
    </div>
  )
}

// Import Link
import Link from 'next/link'
