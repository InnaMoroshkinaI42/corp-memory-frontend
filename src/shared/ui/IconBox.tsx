import { cn } from '@/shared/lib'

export function IconBox({ icon: Icon, className }: { icon: React.ElementType; className?: string }) {
  return (
    <div className={cn("grid size-10 place-items-center rounded-lg bg-[var(--brand-light)] text-[var(--brand-primary)]", className)}>
      <Icon className="size-5" />
    </div>
  )
}