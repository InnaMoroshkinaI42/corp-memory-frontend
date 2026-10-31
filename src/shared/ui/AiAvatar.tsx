import { StarIcon } from '@radix-ui/react-icons'
import { cn } from '@/shared/lib'

export function AiAvatar({ className }: { className?: string }) {
  return (
    <div className={cn("grid size-8 shrink-0 place-items-center rounded-full bg-[var(--brand-light)] text-[var(--brand-primary)]", className)}>
      <StarIcon className="size-4" />
    </div>
  )
}