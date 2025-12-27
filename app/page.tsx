import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            MyersDigital Estimate Generator
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Create professional construction estimates with real-time market pricing
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <button className="btn btn-primary px-8 py-3 text-lg">
                Get Started Free
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="btn btn-secondary px-8 py-3 text-lg">
                Sign In
              </button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold mb-2">Real-Time Pricing</h3>
              <p className="text-sm text-slate-600">
                Get live market data by county
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-bold mb-2">Competitive Analysis</h3>
              <p className="text-sm text-slate-600">
                See what competitors are charging
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold mb-2">One-Click Export</h3>
              <p className="text-sm text-slate-600">
                Download PDF or email to client
              </p>
            </div>
          </div>

          <div className="mt-16 text-center text-blue-100">
            <p className="text-sm">
              Free forever • No credit card required • Unlimited estimates
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
