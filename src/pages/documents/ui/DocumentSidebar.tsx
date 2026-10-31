import { PlayIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

interface Props {
  participants: string[]
  companyName: string
}

export function DocumentSidebar({ participants, companyName }: Props) {
  return (
    <div className="space-y-6">
      {/* Плеер */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <PlayIcon className="size-12 text-white" />
          <span className="absolute bottom-3 left-3 text-xs text-white/80">00:00 / 42:00</span>
        </div>
      </Card>

      {/* Участники */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Участники встречи</h2>
          <div className="space-y-3">
            {participants.map((name) => (
              <div key={name} className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback variant="brand">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-[var(--text)]">{name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Доступ */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <LockClosedIcon className="size-4 text-[var(--text-3)]" />
            <span className="text-sm font-semibold text-[var(--text)]">Доступ: участники «{companyName}»</span>
          </div>
          <p className="text-sm text-[var(--text-2)]">Документ не виден другим компаниям. Права участников задаёт владелец.</p>
        </CardContent>
      </Card>
    </div>
  )
}