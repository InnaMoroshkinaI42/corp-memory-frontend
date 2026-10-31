import { StarIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'

interface Props {
  summary: string
  createdAt: string
}

export function DocumentSummary({ summary, createdAt }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <StarIcon className="size-5 text-[var(--brand-primary)]" />
          <h2 className="text-lg font-semibold text-[var(--text)]">Краткое содержание</h2>
          <Badge variant="brand" className="rounded-full px-2 py-0">AI</Badge>
        </div>
        <p className="text-sm text-[var(--text-2)] leading-relaxed">{summary}</p>
        <p className="mt-4 text-xs text-[var(--text-3)]">Сформировано {createdAt} · Проверьте важные детали по источнику</p>
      </CardContent>
    </Card>
  )
}