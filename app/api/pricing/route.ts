// app/api/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import your existing client
import { PricingInput, PricingResult, calculateMarkup } from '@/lib/pricingAPI';

export async function POST(req: NextRequest) {
  try {
    const input: PricingInput = await req.json();

    // 1. Validate input
    if (!input.tradeType || !input.projectSize) {
      return NextResponse.json(
        { error: 'Missing required fields: tradeType or projectSize' },
        { status: 400 }
      );
    }

    // 2. Try to fetch from Supabase (Live Data)
    const { data: dbPrice, error } = await supabase
      .from('pricing_data')
      .select('*')
      .eq('trade_type', input.tradeType.toLowerCase())
      .eq('project_size', input.projectSize.toLowerCase())
      .single();

    // 3. Use DB data if found, otherwise Mock
    let pricing: PricingResult;

    if (dbPrice && !error) {
      pricing = transformDbResponse(dbPrice, input);
      console.log(`✅ Found live pricing for ${input.tradeType} (${input.projectSize})`);
    } else {
      console.warn(`⚠️ No live pricing for ${input.tradeType}. Using mock fallback.`);
      pricing = generateMockPricing(input);
    }

    return NextResponse.json(pricing);

  } catch (error: any) {
    console.error('Pricing API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}

// Transform Supabase DB row to PricingResult format
function transformDbResponse(record: any, input: PricingInput): PricingResult {
  const baseCost = Number(record.material_cost) + Number(record.labor_cost);
  const markup = calculateMarkup(baseCost);

  return {
    baseCost,
    laborCost: Number(record.labor_cost),
    materialCost: Number(record.material_cost),
    equipmentCost: 0, // Add column to DB if needed
    overhead: markup.overhead,
    profit: markup.profit,
    totalCost: baseCost + markup.overhead + markup.profit,
    marketAverage: Number(record.market_avg),
    highPrice: Number(record.market_max),
    lowPrice: Number(record.market_min),
    competitorCount: 5,
    source: 'live', // Flag as live data
    breakdown: [
      {
        id: '1',
        description: 'Materials & Supplies',
        quantity: 1,
        unit: 'lot',
        unitPrice: Number(record.material_cost),
        total: Number(record.material_cost),
        category: 'material',
      },
      {
        id: '2',
        description: 'Labor & Installation',
        quantity: 1,
        unit: 'lot',
        unitPrice: Number(record.labor_cost),
        total: Number(record.labor_cost),
        category: 'labor',
      },
    ],
  };
}

// Fallback Mock Generator (Preserved from your original code)
function generateMockPricing(input: PricingInput): PricingResult {
  // Simple multipliers for mock scaling
  const multipliers: Record<string, number> = { small: 1, medium: 2.5, large: 5, xlarge: 10 };
  const mult = multipliers[input.projectSize] || 1;

  const baseCosts: Record<string, number> = {
    hvac: 2500, plumbing: 1800, electrical: 2200, roofing: 3500, drywall: 1500, painting: 1200
  };

  const baseVal = (baseCosts[input.tradeType.toLowerCase()] || 2000) * mult;
  const labor = baseVal * 0.6;
  const material = baseVal * 0.4;
  const markup = calculateMarkup(baseVal);

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
      { id: 'm1', description: 'Standard Materials', quantity: 1, unit: 'ls', unitPrice: material, total: material, category: 'material' },
      { id: 'l1', description: 'Standard Labor', quantity: 1, unit: 'ls', unitPrice: labor, total: labor, category: 'labor' }
    ]
  };
}
