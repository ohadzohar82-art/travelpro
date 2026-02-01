# TravelPro Builder

Professional travel package management SaaS for travel agencies.

## Features

- 🎯 Multi-tenant architecture with agency isolation
- 📦 Package editor with drag & drop
- 🏨 8 item types: Flight, Accommodation, Transfer, Activity, Meal, Transition, Free Time, Custom
- 📄 PDF generation with Hebrew support
- 📧 Email and WhatsApp integration
- 🌐 Hebrew/English bilingual support with RTL
- 👥 Client management
- 🌍 Country and destination management
- 📋 Template system
- 💰 Price calculation and summaries

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Drag & Drop**: @dnd-kit
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **PDF**: react-pdf
- **i18n**: next-intl
- **Forms**: react-hook-form + zod

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials and other environment variables.

3. Set up Supabase:
   - Create a new Supabase project
   - Run the database migrations (create tables as specified in the spec)
   - Set up RLS policies
   - Configure storage buckets

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── app/                # Protected app pages
│   ├── login/              # Auth pages
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── layout/            # Layout components
│   ├── packages/          # Package-related components
│   └── ui/                # UI components
├── lib/                   # Utilities
│   └── supabase/         # Supabase client setup
├── store/                 # Zustand stores
└── types/                # TypeScript types
```

## Database Setup

The database schema is defined in `travelpro-dev-spec.json`. Key tables:

- `agencies` - Multi-tenant root
- `users` - Users linked to agencies
- `packages` - Travel packages
- `package_days` - Days within packages
- `package_items` - Items within days
- `clients` - Agency clients
- `countries` - Countries
- `destinations` - Destinations
- `templates` - Reusable package templates

## License

Private - All rights reserved
