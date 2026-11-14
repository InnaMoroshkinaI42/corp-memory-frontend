import type { ElementType } from 'react'

interface Props {
  icon?: ElementType
  title: string
  description?: string
}

export function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="p-8 text-center">
      {Icon && (
        <Icon className="size-8 mx-auto mb-3 text-[var(--text-3)]" />
      )}

      <h2 className="text-lg font-semibold">{title}</h2>

      {description && (
        <p className="mt-1 text-sm text-[var(--text-3)] max-w-md mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}