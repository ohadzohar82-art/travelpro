# TravelPro Setup Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_DEFAULT_LOCALE=he
   ```

3. **Supabase Database Setup**
   
   You need to create the following tables in Supabase:
   - agencies
   - users
   - countries
   - destinations
   - clients
   - packages
   - package_days
   - package_items
   - templates
   - activity_log

   See `travelpro-dev-spec.json` for the complete schema.

   **Important**: Set up Row Level Security (RLS) policies as specified in the spec.

4. **Storage Buckets**
   Create these buckets in Supabase Storage:
   - `logos` (public)
   - `package-images` (public)
   - `destination-images` (public)
   - `generated-pdfs` (private)

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Current Status

✅ **Completed:**
- Project structure and configuration
- Authentication (login, signup, forgot password)
- Layout components (Sidebar, Header, AppLayout)
- Dashboard with stats
- Package list page
- Package editor (basic version)
- Item types palette
- Days timeline
- Item cards and forms
- Price summary
- Client management page
- Countries page
- Templates page
- Settings page
- Common UI components

⏳ **Pending:**
- Full drag & drop implementation (currently simplified)
- Advanced item type forms with all fields
- PDF generation
- Email sending
- WhatsApp integration
- Public package viewer
- API routes for all endpoints
- i18n full implementation
- Database migrations script

## Next Steps

1. Set up Supabase database with all tables
2. Configure RLS policies
3. Test authentication flow
4. Implement remaining features as needed
5. Add database migration scripts
6. Set up email service (Resend)
7. Implement PDF generation
8. Add full i18n support

## Notes

- The design is inspired by modern dashboard UIs with RTL support for Hebrew
- The project uses a multi-tenant architecture with agency isolation
- All database queries include agency_id filtering for security
- The package editor is the core feature - it allows creating travel packages with days and items
