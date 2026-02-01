export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          logo_dark_url: string | null
          primary_color: string
          secondary_color: string
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          address: string | null
          website: string | null
          default_currency: string
          default_language: string
          terms_text: string | null
          email_signature: string | null
          pdf_footer_text: string | null
          subscription_plan: 'basic' | 'pro' | 'enterprise'
          subscription_status: 'active' | 'trial' | 'expired' | 'cancelled'
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['agencies']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['agencies']['Insert']>
      }
      users: {
        Row: {
          id: string
          agency_id: string
          full_name: string
          email: string
          phone: string | null
          role: 'owner' | 'admin' | 'agent' | 'viewer'
          avatar_url: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      countries: {
        Row: {
          id: string
          agency_id: string
          name: string
          name_en: string | null
          code: string
          currency: string
          currency_symbol: string | null
          language: string | null
          timezone: string | null
          visa_info: string | null
          best_season: string | null
          description: string | null
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['countries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['countries']['Insert']>
      }
      destinations: {
        Row: {
          id: string
          agency_id: string
          country_id: string
          name: string
          name_en: string | null
          region: string | null
          airport_code: string | null
          latitude: number | null
          longitude: number | null
          highlights: string[]
          description: string | null
          image_url: string | null
          gallery: string[]
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['destinations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['destinations']['Insert']>
      }
      clients: {
        Row: {
          id: string
          agency_id: string
          name: string
          email: string | null
          phone: string | null
          whatsapp: string | null
          address: string | null
          notes: string | null
          preferences: Record<string, any>
          tags: string[]
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      packages: {
        Row: {
          id: string
          agency_id: string
          title: string
          description: string | null
          country_id: string | null
          client_id: string | null
          status: 'draft' | 'sent' | 'confirmed' | 'cancelled'
          start_date: string | null
          end_date: string | null
          currency: string
          total_price: number
          adults: number
          children: number
          infants: number
          client_name: string | null
          client_email: string | null
          client_phone: string | null
          client_notes: string | null
          internal_notes: string | null
          public_token: string | null
          public_expires_at: string | null
          language: string
          sent_at: string | null
          confirmed_at: string | null
          created_by: string | null
          duplicated_from: string | null
          template_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['packages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['packages']['Insert']>
      }
      package_days: {
        Row: {
          id: string
          package_id: string
          agency_id: string
          day_number: number
          date: string | null
          title: string
          destination_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['package_days']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['package_days']['Insert']>
      }
      package_items: {
        Row: {
          id: string
          day_id: string
          package_id: string
          agency_id: string
          type: 'flight' | 'accommodation' | 'transfer' | 'activity' | 'meal' | 'transition' | 'free_time' | 'custom'
          sort_order: number
          title: string
          subtitle: string | null
          description: string | null
          time_start: string | null
          time_end: string | null
          duration: string | null
          price: number
          price_per: 'total' | 'person' | 'night' | 'unit'
          notes: string | null
          data: Record<string, any>
          image_url: string | null
          is_included: boolean
          is_optional: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['package_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['package_items']['Insert']>
      }
      templates: {
        Row: {
          id: string
          agency_id: string
          name: string
          description: string | null
          country_id: string | null
          duration_days: number | null
          base_price: number
          currency: string
          template_data: Record<string, any>
          image_url: string | null
          is_active: boolean
          usage_count: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['templates']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['templates']['Insert']>
      }
    }
  }
}
