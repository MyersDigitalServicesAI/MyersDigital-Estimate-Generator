# 🏗️ MyersDigital Construction Estimate Generator

> **AI-powered construction estimates with real-time market pricing, PDF export, and instant email delivery**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

## 📖 About

**MyersDigital Estimate Generator** is a professional construction estimating platform built for contractors, tradespeople, and construction professionals. Generate accurate, competitive estimates in minutes with real-time market pricing data, beautiful PDF exports, and one-click email delivery to clients.

### 🎯 Built For

- **HVAC Contractors** - Heating, cooling, and ventilation projects
- **Plumbers** - Residential and commercial plumbing
- **Electricians** - Electrical installations and repairs  
- **Roofers** - Roof replacements and repairs
- **General Contractors** - Multi-trade construction projects
- **Remodelers** - Home improvement and renovation

## ✨ Key Features

### 💰 **Real-Time Market Pricing**
- County-level pricing data powered by 1build API
- Automatic labor and material cost calculations
- Competitive rate comparisons
- Dynamic markup calculations (15% overhead + 20% profit)

### 📄 **Professional PDF Generation**
- Custom company letterhead
- Itemized cost breakdowns
- Material, labor, and equipment sections
- Tax calculations
- Payment terms and timeline
- Professional formatting

### 📧 **Instant Email Delivery**
- One-click send to clients
- Branded email templates
- Automatic PDF attachment
- Delivery confirmation

### 📊 **Dashboard & Analytics**
- View all estimates in one place
- Track estimate status (draft, sent, accepted)
- Client management
- Revenue tracking
- PostHog analytics integration

### 📱 **Mobile-First Design**
- Fully responsive UI
- Works on phone, tablet, and desktop
- Touch-optimized inputs (44-48px tap targets)
- Generate estimates on-site

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Vercel account (optional, for deployment)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/MyersDigitalServicesAI/MyersDigital-Estimate-Generator.git
cd MyersDigital-Estimate-Generator

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Add your Supabase credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=your-project-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 5. Run the development server
npm run dev

# 6. Open http://localhost:3000
```

## 🗄️ Database Setup

### Supabase Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Create estimates table
CREATE TABLE estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT,
  client_email TEXT,
  trade_type TEXT NOT NULL,
  project_size TEXT NOT NULL,
  county TEXT NOT NULL,
  state TEXT NOT NULL,
  description TEXT,
  total_cost DECIMAL(10, 2),
  labor_cost DECIMAL(10, 2),
  material_cost DECIMAL(10, 2),
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
CREATE POLICY "Users can view their own estimates"
  ON estimates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own estimates"
  ON estimates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own estimates"
  ON estimates FOR UPDATE
  USING (auth.uid() = user_id);
```

## 🔧 Environment Variables

Create `.env.local` with these variables:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend (for email delivery)
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=estimates@yourdomain.com

# PostHog (analytics - optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# 1build (pricing API - optional, uses mock data without it)
ONEBUILD_API_KEY=your_1build_api_key
ONEBUILD_API_URL=https://api.1build.com/v1

# Company Info
COMPANY_NAME=MyersDigital Services AI
```

## 📦 Tech Stack

| Technology | Purpose |
|-----------|----------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Supabase** | Authentication, database, storage |
| **Resend** | Email delivery |
| **PostHog** | Analytics and tracking |
| **1build API** | Real-time construction pricing |
| **Vercel** | Hosting and deployment |

## 📁 Project Structure

```
MyersDigital-Estimate-Generator/
├── app/
│   ├── api/
│   │   ├── pricing/          # Pricing API endpoint
│   │   └── send-estimate/    # Email delivery endpoint
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Dashboard UI
│   ├── estimates/            # Estimate management
│   └── layout.tsx            # Root layout
├── components/
│   ├── EstimateForm.tsx      # Main estimate form
│   └── ...                   # Other components
├── lib/
│   ├── analytics.ts          # PostHog integration
│   ├── pdfGenerator.ts       # PDF generation
│   ├── pricingAPI.ts         # Pricing API wrapper
│   └── supabase.ts           # Supabase client
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MyersDigitalServicesAI/MyersDigital-Estimate-Generator)

1. Click the button above or go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard
4. Click "Deploy"

Your app will be live in ~2 minutes! 🎉

## 🎨 Customization

### Update Company Branding

Edit `lib/pdfGenerator.ts` to customize:
- Company name and logo
- Letterhead design
- Color scheme
- Footer text

### Add New Trade Types

Edit `components/EstimateForm.tsx`:

```typescript
const TRADES = [
  'HVAC', 
  'Plumbing', 
  'Electrical', 
  'Roofing',
  'Your New Trade' // Add here
];
```

## 📊 Features Roadmap

- [x] Real-time pricing integration
- [x] PDF generation with letterhead
- [x] Email delivery
- [x] Mobile-responsive design
- [x] User authentication
- [x] Analytics tracking
- [ ] Stripe payment integration
- [ ] Client portal for estimate acceptance
- [ ] Recurring estimates
- [ ] Multi-user team accounts
- [ ] Invoice generation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Need help? 
- 📧 Email: hello@myersdigital.com
- 🐛 Issues: [GitHub Issues](https://github.com/MyersDigitalServicesAI/MyersDigital-Estimate-Generator/issues)

## 🙏 Acknowledgments

- [1build](https://1build.com/) - Construction pricing data
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Vercel](https://vercel.com/) - Hosting platform
- [Resend](https://resend.com/) - Email delivery

---

**Built with ❤️ by [MyersDigital Services AI](https://myersdigital.com)**

*Helping contractors win more bids with intelligent estimating*
