import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          company_name: string
          company_address: string
          company_phone: string
          company_email: string
          created_at: string
        }
        Insert: {
          id: string
          email?: string
          company_name?: string
          company_address?: string
          company_phone?: string
          company_email?: string
        }
        Update: {
          company_name?: string
          company_address?: string
          company_phone?: string
          company_email?: string
        }
      }
      estimates: {
        Row: {
          id: string
          user_id: string
          estimate_number: string
          client_name: string
          client_email: string
          project_type: string
          county: string
          state: string
          project_description: string
          project_size: string
          subtotal: number
          tax: number
          total: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          estimate_number?: string
          client_name: string
          client_email: string
          project_type: string
          county: string
          state: string
          project_description?: string
          project_size: string
          subtotal: number
          tax: number
          total: number
          status?: string
        }
        Update: {
          client_name?: string
          client_email?: string
          project_description?: string
          subtotal?: number
          tax?: number
          total?: number
          status?: string
        }
      }
      estimate_line_items: {
        Row: {
          id: string
          estimate_id: string
          description: string
          quantity: number
          unit_price: number
          total: number
          display_order: number
        }
        Insert: {
          estimate_id: string
          description: string
          quantity?: number
          unit_price: number
          total: number
          display_order?: number
        }
        Update: {
          description?: string
          quantity?: number
          unit_price?: number
          total?: number
        }
      }
    }
  }
}
