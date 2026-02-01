'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Globe,
  MapPin,
  Users,
  FileText,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import Image from 'next/image'

const navigation = [
  { name: 'לוח בקרה', href: '/app', icon: LayoutDashboard },
  { name: 'חבילות', href: '/app/packages', icon: Package },
  { name: 'מדינות', href: '/app/countries', icon: Globe },
  { name: 'יעדים', href: '/app/destinations', icon: MapPin },
  { name: 'לקוחות', href: '/app/clients', icon: Users },
  { name: 'תבניות', href: '/app/templates', icon: FileText },
  { name: 'הגדרות', href: '/app/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { agency } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <div
        className={cn(
          'fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-lg transition-all duration-300 z-40',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            {!collapsed ? (
              agency?.logo_url ? (
                <div className="relative h-10 w-32">
                  <Image
                    src={agency.logo_url}
                    alt={agency.name || 'Logo'}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <h1 className="text-xl font-bold text-gray-900">TravelPro</h1>
              )
            ) : agency?.logo_url ? (
              <div className="relative h-8 w-8 mx-auto">
                <Image
                  src={agency.logo_url}
                  alt={agency.name || 'Logo'}
                  fill
                  className="object-contain"
                />
              </div>
            ) : null}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium',
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  )}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      <div className={cn('transition-all duration-300', collapsed ? 'w-16' : 'w-64')} />
    </>
  )
}
