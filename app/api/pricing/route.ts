// app/api/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PricingInput, PricingResult, getSizeMultiplier, calculateMarkup } from '@/lib/pricingAPI';

/**
 * POST /api/pricing
 * Fetch real-time construction pricing from 1build API
 */
export async function POST(req: NextRequest) {
  try {
    const input: PricingInput = await req.json();

    // Validate input
    if (!input.tradeType || !input.county || !input.state) {
      return NextResponse.json(
        { error: 'Missing required fields: tradeType, county, state' },
        { status: 400 }
      );
    }

    // Call 1build API (or mock data for now)
    const pricing = await fetch1buildPricing(input);

    return NextResponse.json(pricing);
  } catch (error: any) {
    console.error('Pricing API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}

/**
 * Fetch pricing from 1build API
 */
async function fetch1buildPricing(input: PricingInput): Promise<PricingResult> {
  const apiKey = process.env.ONEBUILD_API_KEY;
  const apiUrl = process.env.ONEBUILD_API_URL || 'https://api.1build.com/v1';

  // If no API key, return mock data
  if (!apiKey) {
    console.warn('1build API key not configured - using mock data');
    return generateMockPricing(input);
  }

  try {
    const response = await fetch(`${apiUrl}/pricing`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trade: input.tradeType,
        location: {
          county: input.county,
          state: input.state,
        },
        projectSize: input.projectSize,
      }),
    });

    if (!response.ok) {
      throw new Error(`1build API error: ${response.statusText}`);
    }

    const data = await response.json();
    return transform1buildResponse(data, input);
  } catch (error) {
    console.error('1build API failed, using fallback:', error);
    return generateMockPricing(input);
  }
}

/**
 * Transform 1build response to our format
 */
function transform1buildResponse(data: any, input: PricingInput): PricingResult {
  const sizeMultiplier = getSizeMultiplier(input.projectSize);
  const baseCost = data.totalCost * sizeMultiplier;
  const markup = calculateMarkup(baseCost);

  return {
    baseCost,
    laborCost: data.laborCost * sizeMultiplier,
    materialCost: data.materialCost * sizeMultiplier,
    equipmentCost: data.equipmentCost * sizeMultiplier,
    overhead: markup.overhead,
    profit: markup.profit,
    totalCost: baseCost + markup.overhead + markup.profit,
    marketAverage: data.marketAverage,
    highPrice: data.highPrice,
    lowPrice: data.lowPrice,
    competitorCount: data.competitorCount,
    source: 'live',
    breakdown: data.lineItems || [],
  };
}

/**
 * Generate mock pricing data for development
 */
function generateMockPricing(input: PricingInput): PricingResult {
  const sizeMultiplier = getSizeMultiplier(input.projectSize);
  
  // Base costs by trade type
  const baseCosts: Record<string, number> = {
    'hvac': 2500,
    'plumbing': 1800,
    'electrical': 2200,
    'roofing': 3500,
    'painting': 1200,
    'flooring': 2000,
  };

  const baseCost = (baseCosts[input.tradeType.toLowerCase()] || 2000) * sizeMultiplier;
  const laborCost = baseCost * 0.60;
  const materialCost = baseCost * 0.40;
  const markup = calculateMarkup(baseCost);

  return {
    baseCost,
    laborCost,
    materialCost,
    equipmentCost: baseCost * 0.10,
    overhead: markup.overhead,
    profit: markup.profit,
    totalCost: baseCost + markup.overhead + markup.profit,
    marketAverage: baseCost * 1.15,
    highPrice: baseCost * 1.40,
    lowPrice: baseCost * 0.85,
    competitorCount: 12,
    source: 'fallback',
    breakdown: [
      {
        id: '1',
        description: 'Labor',
        quantity: 1,
        unit: 'project',
        unitPrice: laborCost,
        total: laborCost,
        category: 'labor',
      },
      {
        id: '2',
        description: 'Materials',
        quantity: 1,
        unit: 'project',
        unitPrice: materialCost,
        total: materialCost,
        category: 'material',
      },
    ],
  };
}
