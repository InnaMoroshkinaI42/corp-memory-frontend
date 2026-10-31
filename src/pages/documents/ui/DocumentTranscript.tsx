import { Card, CardContent } from '@/shared/ui/card'

interface TranscriptItem {
  time: string
  name: string
  text: string
}

interface Props {
  items: TranscriptItem[]
}

export function DocumentTranscript({ items }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">Транскрипт</h2>
          <a href="#" className="text-sm text-[var(--brand-primary)] hover:underline">Полная расшифровка →</a>
        </div>
        <p className="text-xs text-[var(--text-3)] mb-4">Ключевые фрагменты · русский язык</p>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 text-sm">
              <span className="shrink-0 font-mono text-xs text-[var(--brand-primary)] w-12">{item.time}</span>
              <div>
                <div className="font-semibold text-[var(--text)]">{item.name}</div>
                <div className="text-[var(--text-2)] mt-0.5">{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}