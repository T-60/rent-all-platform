'use client'

import { cn } from "@/lib/utils"

interface NotificationBadgeProps {
  count: number
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showZero?: boolean
  maxCount?: number
}

export function NotificationBadge({ 
  count, 
  variant = 'destructive',
  size = 'md',
  className,
  showZero = false,
  maxCount = 99
}: NotificationBadgeProps) {
  if (count <= 0 && !showZero) return null

  const sizeClasses = {
    sm: 'h-4 w-4 text-xs min-w-[16px]',
    md: 'h-5 w-5 text-xs min-w-[20px]',
    lg: 'h-6 w-6 text-sm min-w-[24px]'
  }

  const variantClasses = {
    default: 'bg-blue-500 text-white',
    destructive: 'bg-red-500 text-white',
    secondary: 'bg-gray-500 text-white',
    outline: 'bg-white text-gray-700 border border-gray-300',
    warning: 'bg-orange-500 text-white'
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()

  return (
    <div 
      className={cn(
        'flex items-center justify-center font-semibold rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label={`${count} notificaciones sin leer`}
    >
      {displayCount}
    </div>
  )
}
