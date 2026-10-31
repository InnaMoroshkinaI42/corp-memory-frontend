import { FileTextIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from './card'

interface Props {
  sources: any[]
}

export function ChatSourcesList({ sources }: Props) {
  return (
    <div className="space-y-2 mt-4">
      <div className="text-xs font-semibold uppercase text-[var(--text-3)] tracking-wider">
        Источники · {sources.length} фрагмента
      </div>
      {sources.map((src, i) => (
        <Card key={i} className="p-3 flex gap-3 border-[var(--border)] bg-white shadow-none">
          <FileTextIcon className="size-4 mt-0.5 text-[var(--brand-primary)] shrink-0" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-sm text-[var(--text)]">{src.label}</span>
              <span className="text-xs text-[var(--text-3)]">[{i + 1}] {src.timestamp}</span>
            </div>
            <p className="text-sm text-[var(--text-2)] mt-1">{src.quote}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}