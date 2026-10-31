import { PlayIcon } from '@radix-ui/react-icons'
import { Card } from './card'

export function DocumentViewer({ mimeType, meta }: { mimeType: string; meta: string }) {
  if (mimeType.includes('video') || mimeType.includes('audio')) {
    return (
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <PlayIcon className="size-12 text-white" />
          <span className="absolute bottom-3 left-3 text-xs text-white/80">00:00 / {meta}</span>
        </div>
      </Card>
    )
  }
  return null // Если PDF — плеер не нужен (или можно добавить превью PDF)
}