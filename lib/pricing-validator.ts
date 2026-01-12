import { z } from 'zod'
import type { PricingInput } from './pricingAPI'

// Runtime schema + TS type in one place
const PricingSchema = z.object({
  tradeType: z.enum(['hvac', 'plumbing', 'electrical', 'roofing', 'drywall', 'painting']),
  projectSize: z.enum(['small', 'medium', 'large', 'xlarge']),
  county: z.string().min(2).max(64).trim(),
  state: z.string().trim().length(2),
  description: z.string().max(500).optional(),
})

export function validatePricingInput(data: unknown): PricingInput {
  const parsed = PricingSchema.safeParse(data)

  if (!parsed.success) {
    // For API callers you can return a generic message; log details server-side
    throw new Error('Invalid pricing input')
  }

  const input = parsed.data

  return {
    tradeType: input.tradeType,                    // already constrained + normalized
    county: input.county,
    state: input.state.toUpperCase(),             // normalize state for DB/UI
    projectSize: input.projectSize,
    description: input.description,
  }
}
