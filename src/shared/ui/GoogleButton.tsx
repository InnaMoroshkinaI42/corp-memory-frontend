import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

export function GoogleButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[14px] font-medium text-[var(--text)] transition-colors hover:bg-gray-50',
        className
      )}
      {...props}
    >
      <img 
        src="https://www.svgrepo.com/show/475656/google-color.svg" 
        alt="Google" 
        className="size-[18px]" 
      />
      {children}
    </button>
  )
}