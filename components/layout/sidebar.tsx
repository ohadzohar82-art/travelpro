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
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <div
        className={cn(
          'fixed right-0 top-0 h-full bg-dark text-white transition-all duration-300 z-40',
          collapsed ? 'w-14' : 'w-56'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {!collapsed && (
              <h1 className="text-xl font-bold text-white">TravelPro</h1>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      <div className={cn('transition-all duration-300', collapsed ? 'w-14' : 'w-56')} />
    </>
  )
}
