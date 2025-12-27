// lib/pricingAPI.ts
/**
 * Real-time construction pricing API integration
 * Connects to 1build API for live market data
 */

export type PricingInput = {
  tradeType: string;
  county: string;
  state: string;
  projectSize: 'small' | 'medium' | 'large' | 'xlarge';
  description?: string;
};

export type PricingResult = {
  baseCost: number;
  laborCost: number;
  materialCost: number;
  equipmentCost?: number;
  overhead: number;
  profit: number;
  totalCost: number;
  marketAverage?: number;
  highPrice?: number;
  lowPrice?: number;
  competitorCount?: number;
  source: 'live' | 'cache' | 'fallback';
  breakdown: LineItem[];
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  category: 'labor' | 'material' | 'equipment' | 'other';
};

/**
 * Fetch live pricing from backend API
 */
export async function getLivePricing(
  input: PricingInput
): Promise<PricingResult> {
  try {
    const res = await fetch('/api/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Pricing API failed');
    }

    return (await res.json()) as PricingResult;
  } catch (error) {
    console.error('Pricing API error:', error);
    throw error;
  }
}

/**
 * Get project size multipliers
 */
export function getSizeMultiplier(size: PricingInput['projectSize']): number {
  const multipliers = {
    small: 1.0,
    medium: 2.5,
    large: 5.0,
    xlarge: 10.0,
  };
  return multipliers[size] || 1.0;
}

/**
 * Calculate markup percentages
 */
export function calculateMarkup(baseCost: number): {
  overhead: number;
  profit: number;
} {
  const overheadPercent = 0.15; // 15%
  const profitPercent = 0.20; // 20%
  
  return {
    overhead: baseCost * overheadPercent,
    profit: baseCost * profitPercent,
  };
}
