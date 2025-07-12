import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
  
  const variants = {
    primary: 'bg-cta-500 hover:bg-cta-600 text-white focus:ring-cta-500 hover:shadow-medium',
    secondary: 'bg-accent-100 hover:bg-accent-200 text-text-primary focus:ring-accent-500 hover:shadow-soft',
    outline: 'border-2 border-cta-500 text-cta-500 hover:bg-cta-500 hover:text-white focus:ring-cta-500',
    success: 'bg-success-500 hover:bg-success-600 text-white focus:ring-success-500 hover:shadow-medium',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500 hover:shadow-medium',
    danger: 'bg-alert-500 hover:bg-alert-600 text-white focus:ring-alert-500 hover:shadow-medium',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
} 