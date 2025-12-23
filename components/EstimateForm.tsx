// components/EstimateForm.tsx (MOBILE-OPTIMIZED)
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const MOCK_PRICING = {
  hvac: {
    small: { materials: 350, labor: 500, competitors: { min: 850, max: 1500, avg: 1150 } },
    medium: { materials: 1200, labor: 2500, competitors: { min: 3500, max: 5500, avg: 4200 } },
    large: { materials: 4500, labor: 8000, competitors: { min: 12000, max: 18000, avg: 14500 } },
    xlarge: { materials: 15000, labor: 25000, competitors: { min: 40000, max: 65000, avg: 50000 } }
  },
  plumbing: {
    small: { materials: 200, labor: 400, competitors: { min: 600, max: 1000, avg: 800 } },
    medium: { materials: 800, labor: 1800, competitors: { min: 2500, max: 4000, avg: 3200 } },
    large: { materials: 3000, labor: 6000, competitors: { min: 9000, max: 14000, avg: 11000 } },
    xlarge: { materials: 10000, labor: 18000, competitors: { min: 28000, max: 45000, avg: 35000 } }
  },
  electrical: {
    small: { materials: 250, labor: 450, competitors: { min: 700, max: 1200, avg: 950 } },
    medium: { materials: 1000, labor: 2200, competitors: { min: 3200, max: 5000, avg: 4100 } },
    large: { materials: 4000, labor: 7500, competitors: { min: 11500, max: 17000, avg: 14000 } },
    xlarge: { materials: 12000, labor: 22000, competitors: { min: 34000, max: 55000, avg: 44000 } }
  },
  roofing: {
    small: { materials: 400, labor: 600, competitors: { min: 1000, max: 1800, avg: 1400 } },
    medium: { materials: 1500, labor: 3000, competitors: { min: 4500, max: 7000, avg: 5500 } },
    large: { materials: 5500, labor: 9000, competitors: { min: 14500, max: 22000, avg: 18000 } },
    xlarge: { materials: 18000, labor: 28000, competitors: { min: 46000, max: 70000, avg: 56000 } }
  },
  drywall: {
    small: { materials: 150, labor: 300, competitors: { min: 450, max: 800, avg: 600 } },
    medium: { materials: 600, labor: 1200, competitors: { min: 1800, max: 2800, avg: 2300 } },
    large: { materials: 2500, labor: 4500, competitors: { min: 7000, max: 10500, avg: 8500 } },
    xlarge: { materials: 8000, labor: 14000, competitors: { min: 22000, max: 33000, avg: 27000 } }
  },
  painting: {
    small: { materials: 100, labor: 250, competitors: { min: 350, max: 600, avg: 450 } },
    medium: { materials: 400, labor: 900, competitors: { min: 1300, max: 2000, avg: 1600 } },
    large: { materials: 1500, labor: 3000, competitors: { min: 4500, max: 7000, avg: 5500 } },
    xlarge: { materials: 5000, labor: 10000, competitors: { min: 15000, max: 25000, avg: 20000 } }
  }
}

interface EstimateFormProps {
  userId: string
}

export default function EstimateForm({ userId }: EstimateFormProps) {
  const [formData, setFormData] = useState({
    projectType: 'hvac',
    county: 'Cuyahoga',
    state: 'OH',
    projectSize: 'medium',
    projectDesc: '',
    clientEmail: ''
  })
  
  const [estimate, setEstimate] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleGenerateEstimate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!formData.projectType || !formData.county || !formData.state || !formData.clientEmail) {
      setError('Please fill in all required fields')
      return
    }

    setError('')
    setLoading(true)
    
    try {
      // Simulate API delay for realism
      await new Promise(resolve => setTimeout(resolve, 800))

      const pricingData = (MOCK_PRICING as any)[formData.projectType][formData.projectSize]
      const baseCost = pricingData.materials + pricingData.labor
      const markupCost = baseCost * 1.35 // 35% markup
      const subtotal = markupCost
      const tax = subtotal * 0.0875 // 8.75% Ohio tax
      const total = subtotal + tax

      const lineItems = [
        { desc: 'Materials & Supplies', qty: 1, rate: pricingData.materials, total: pricingData.materials },
        { desc: 'Labor (Professional Installation)', qty: 1, rate: pricingData.labor, total: pricingData.labor },
        { desc: 'Service & Overhead (35% markup)', qty: 1, rate: markupCost - baseCost, total: markupCost - baseCost }
      ]

      const competitorData = pricingData.competitors

      setEstimate({
        subtotal,
        tax,
        total,
        lineItems,
        competitorData,
        estimateNumber: `EST-${Date.now().toString().slice(-6)}`
      })

      // Scroll to estimate on mobile
      setTimeout(() => {
        document.getElementById('estimate-preview')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      setError('Error generating estimate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEstimate = async () => {
    if (!formData.clientEmail) {
      setError('Please enter client email')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { data, error: insertError } = await supabase.from('estimates').insert({
        user_id: userId,
        estimate_number: estimate.estimateNumber,
        client_name: formData.projectType.toUpperCase(),
        client_email: formData.clientEmail,
        project_type: formData.projectType,
        county: formData.county,
        state: formData.state,
        project_description: formData.projectDesc,
        project_size: formData.projectSize,
        subtotal: estimate.subtotal,
        tax: estimate.tax,
        total: estimate.total,
        status: 'draft'
      }).select().single()

      if (insertError) throw insertError

      if (data?.id) {
        // Save line items
        await supabase.from('estimate_line_items').insert(
          estimate.lineItems.map((item: any, idx: number) => ({
            estimate_id: data.id,
            description: item.desc,
            quantity: item.qty,
            unit_price: item.rate,
            total: item.total,
            display_order: idx
          }))
        )
      }

      setSuccess('✓ Estimate saved!')
      setTimeout(() => router.push('/app/dashboard'), 1500)
    } catch (error: any) {
      setError('Error saving estimate: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* MOBILE + TABLET + DESKTOP RESPONSIVE */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-900">
              📋 Quick Estimate
            </h2>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 md:p-4 rounded mb-4 text-sm md:text-base">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 md:p-4 rounded mb-4 text-sm md:text-base">
                {success}
              </div>
            )}

            <form onSubmit={handleGenerateEstimate} className="space-y-3 md:space-y-4">
              {/* TRADE TYPE */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Trade Type *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-3 md:px-4 py-3 md:py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base md:text-base"
                >
                  <option value="hvac">🔧 HVAC (Heating/Cooling)</option>
                  <option value="plumbing">💧 Plumbing</option>
                  <option value="electrical">⚡ Electrical</option>
                  <option value="roofing">🏠 Roofing</option>
                  <option value="drywall">🔨 Drywall/Finishing</option>
                  <option value="painting">🎨 Painting</option>
                </select>
              </div>

              {/* COUNTY & STATE - SIDE BY SIDE ON MOBILE */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    County *
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    placeholder="Cuyahoga"
                    className="w-full px-3 md:px-4 py-3 md:py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    maxLength={2}
                    placeholder="OH"
                    className="w-full px-3 md:px-4 py-3 md:py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
              </div>

              {/* PROJECT SIZE */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Project Size *
                </label>
                <select
                  name="projectSize"
                  value={formData.projectSize}
                  onChange={handleInputChange}
                  className="w-full px-3 md:px-4 py-3 md:py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  <option value="small">💰 Small ($500-$2,000)</option>
                  <option value="medium">💰💰 Medium ($2,000-$10,000)</option>
                  <option value="large">💰💰💰 Large ($10,000-$50,000)</option>
                  <option value="xlarge">💰💰💰💰 Extra Large ($50,000+)</option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="projectDesc"
                  value={formData.projectDesc}
                  onChange={handleInputChange}
                  placeholder="Any special notes or requirements..."
                  rows={2}
                  className="w-full px-3 md:px-4 py-3 md:py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
                />
              </div>

              {/* CLIENT EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Client Email *
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  placeholder="client@example.com"
                  className="w-full px-3 md:px-4 py-3 md:py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>

              {/* GENERATE BUTTON - 48PX MOBILE, 44PX MIN DESKTOP */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-4 md:py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-4 text-base md:text-base font-semibold"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⚙️</span> Generating...
                  </span>
                ) : (
                  '🚀 Generate Estimate (2 min)'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ESTIMATE PREVIEW (HIDDEN ON MOBILE, SHOWS ON TABLET/DESKTOP) */}
        {estimate && (
          <div id="estimate-preview" className="w-full">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-6 sticky md:top-20">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">
                📊 Your Estimate
              </h2>

              {/* ESTIMATE HEADER */}
              <div className="border-b border-slate-200 pb-4 mb-4">
                <div className="text-xs md:text-sm text-slate-600 font-mono mb-1">
                  {estimate.estimateNumber}
                </div>
                <div className="text-lg md:text-xl font-bold text-blue-600">
                  ${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* COMPETITIVE PRICING INSIGHT */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 rounded mb-4">
                <p className="text-xs md:text-sm font-semibold text-blue-900 mb-2">💡 Market Price</p>
                <p className="text-xs md:text-sm text-blue-800 mb-2">
                  <strong>${estimate.competitorData.min.toLocaleString()}</strong> - <strong>${estimate.competitorData.max.toLocaleString()}</strong>
                </p>
                <p className="text-xs text-blue-700">
                  {estimate.total < estimate.competitorData.avg
                    ? '🟢 Below market average - Very competitive!'
                    : estimate.total > estimate.competitorData.max
                    ? '🔴 Above market average'
                    : '🟡 At market average'}
                </p>
              </div>

              {/* LINE ITEMS */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-3 text-slate-900">Breakdown</h4>
                <div className="space-y-2 text-xs md:text-sm">
                  {estimate.lineItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-700">{item.desc}</span>
                      <span className="font-semibold text-slate-900">
                        ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTALS */}
              <div className="space-y-2 border-t border-slate-200 pt-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${estimate.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.75%)</span>
                  <span>${estimate.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-base font-bold bg-blue-600 text-white p-3 rounded mt-4">
                  <span>Total</span>
                  <span>${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-2">
                <button
                  onClick={handleSaveEstimate}
                  disabled={saving}
                  className="w-full bg-green-600 text-white font-semibold py-3 md:py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 text-base"
                >
                  {saving ? '💾 Saving...' : '💾 Save Estimate'}
                </button>
                <button className="w-full bg-purple-600 text-white font-semibold py-3 md:py-3 px-4 rounded-lg hover:bg-purple-700 transition-all duration-200 text-base">
                  ✉️ Email to Client
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE-ONLY ESTIMATE PREVIEW (SHOWN BELOW FORM ON MOBILE) */}
      {estimate && (
        <div className="md:hidden mt-4 bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <h3 className="text-lg font-bold mb-4 text-slate-900">✓ Estimate Ready</h3>
          
          <div className="text-2xl font-bold text-blue-600 mb-4">
            ${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
            <p className="text-xs font-semibold text-blue-900 mb-2">Market Price</p>
            <p className="text-xs text-blue-800">
              ${estimate.competitorData.min.toLocaleString()} - ${estimate.competitorData.max.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2 mb-4 text-sm">
            {estimate.lineItems.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between py-1">
                <span>{item.desc}</span>
                <span className="font-semibold">${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleSaveEstimate}
              disabled={saving}
              className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 text-base"
            >
              {saving ? '💾 Saving...' : '💾 Save'}
            </button>
            <button className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 text-base">
              ✉️ Email
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
