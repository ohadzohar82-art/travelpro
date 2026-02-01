import { create } from 'zustand'
import type { Database } from '@/types/database'

type User = Database['public']['Tables']['users']['Row']
type Agency = Database['public']['Tables']['agencies']['Row']

interface AuthState {
  user: User | null
  agency: Agency | null
  setUser: (user: User | null) => void
  setAgency: (agency: Agency | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  agency: null,
  setUser: (user) => set({ user }),
  setAgency: (agency) => set({ agency }),
  logout: () => set({ user: null, agency: null }),
}))
