import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'draft' | 'sent' | 'confirmed' | 'cancelled' | 'default'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
          {
            'bg-gray-100 text-gray-800': variant === 'draft',
            'bg-blue-100 text-blue-800': variant === 'sent',
            'bg-green-100 text-green-800': variant === 'confirmed',
            'bg-red-100 text-red-800': variant === 'cancelled',
            'bg-gray-100 text-gray-800': variant === 'default',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }
