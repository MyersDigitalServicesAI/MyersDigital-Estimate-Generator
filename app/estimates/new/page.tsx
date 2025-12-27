'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EstimateForm from '@/components/EstimateForm'
import Link from 'next/link'

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/app/dashboard">
              <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                <span>←</span> Back to Dashboard
              </button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">⚙️ MyersDigital Estimate Generator</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create New Estimate</h2>
          <p className="text-slate-600">Generate professional estimates with real-time market pricing</p>
        </div>
        
        <EstimateForm userId={user?.id} />
      </div>
    </div>
  )
}
