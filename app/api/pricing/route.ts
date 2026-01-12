// app/api/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { validatePricingInput } from '@/lib/pricing-validator'
import { PricingResult, calculateMarkup, PricingInput } from '@/lib/pricingAPI'

function numOrThrow(value: unknown, field: string): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`Invalid numeric field "${field}" from pricing_data`)
  }
  return n
}

export async function POST(req: NextRequest) {
  try {
    // 1. Initialize Server Supabase client & check auth
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse & validate input
    const rawBody = await req.json()
    let input: PricingInput

    try {
      input = validatePricingInput(rawBody)
    } catch (e: any) {
      console.warn('[pricing.validation_error]', { message: e?.message })
      return NextResponse.json({ error: 'Invalid pricing input' }, { status: 400 })
    }

    // 3. Fetch pricing_data (live DB)
    const { data: dbPrice, error } = await supabase
      .from('pricing_data')
      .select('*')
      .eq('trade_type', input.tradeType)      // expect normalized to lowercase
      .eq('project_size', input.projectSize)  // expect normalized to lowercase
      .maybeSingle()

    if (error) {
      console.error('[pricing.db_error]', { error })
      throw new Error('Database query failed')
    }

    // 4. Transform or fallback
    let pricing: PricingResult

    if (dbPrice) {
      console.log('[pricing.live_hit]', {
        tradeType: input.tradeType,
        projectSize: input.projectSize,
      })
      pricing = transformDbResponse(dbPrice)
    } else {
      console.warn('[pricing.fallback]', {
        tradeType: input.tradeType,
        projectSize: input.projectSize,
      })
      pricing = generateMockPricing(input)
    }

    return NextResponse.json(pricing)
  } catch (error: any) {
    console.error('[pricing.api_error]', { error: error?.message || String(error) })
    return NextResponse.json(
      { error: 'Internal pricing engine error' },
      { status: 500 }
    )
  }
}

function transformDbResponse(record: any): PricingResult {
  const matCost = numOrThrow(record.material_cost, 'material_cost')
  const labCost = numOrThrow(record.labor_cost, 'labor_cost')
  const baseCost = matCost + labCost
  const markup = calculateMarkup(baseCost)

  const marketAvg =
    record.market_avg != null ? numOrThrow(record.market_avg, 'market_avg') : baseCost * 1.15
  const marketMax =
    record.market_max != null ? numOrThrow(record.market_max, 'market_max') : baseCost * 1.4
  const marketMin =
    record.market_min != null ? numOrThrow(record.market_min, 'market_min') : baseCost * 0.9

  return {
    baseCost,
    laborCost: labCost,
    materialCost: matCost,
    equipmentCost: 0,
    overhead: markup.overhead,
    profit: markup.profit,
    totalCost: baseCost + markup.overhead + markup.profit,
    marketAverage: marketAvg,
    highPrice: marketMax,
    lowPrice: marketMin,
    competitorCount: 5,
    source: 'live',
    breakdown: [
      {
        id: '1',
        description: 'Materials & Supplies',
        quantity: 1,
        unit: 'lot',
        unitPrice: matCost,
        total: matCost,
        category: 'material',
      },
      {
        id: '2',
        description: 'Labor & Installation',
        quantity: 1,
        unit: 'lot',
        unitPrice: labCost,
        total: labCost,
        category: 'labor',
      },
    ],
  }
}

function generateMockPricing(input: PricingInput): PricingResult {
  const multipliers: Record<string, number> = {
    small: 1,
    medium: 2.5,
    large: 5,
    xlarge: 10,
  }
  const mult = multipliers[input.projectSize] || 1

  const baseCosts: Record<string, number> = {
    hvac: 2500,
    plumbing: 1800,
    electrical: 2200,
    roofing: 3500,
    drywall: 1500,
    painting: 1200,
  }

  const baseVal = (baseCosts[input.tradeType] || 2000) * mult
  const labor = baseVal * 0.6
  const material = baseVal * 0.4
  const markup = calculateMarkup(baseVal)

  return {
    baseCost: baseVal,
    laborCost: labor,
    materialCost: material,
    equipmentCost: baseVal * 0.05,
    overhead: markup.overhead,
    profit: markup.profit,
    totalCost: baseVal + markup.overhead + markup.profit,
    marketAverage: baseVal * 1.2,
    highPrice: baseVal * 1.5,
    lowPrice: baseVal * 0.9,
    source: 'fallback',
    breakdown: [
      {
        id: 'm1',
        description: 'Standard Materials',
        quantity: 1,
        unit: 'ls',
        unitPrice: material,
        total: material,
        category: 'material',
      },
      {
        id: 'l1',
        description: 'Standard Labor',
        quantity: 1,
        unit: 'ls',
        unitPrice: labor,
        total: labor,
        category: 'labor',
      },
    ],
  }
}
