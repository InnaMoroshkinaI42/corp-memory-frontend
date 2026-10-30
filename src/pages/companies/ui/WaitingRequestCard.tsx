import { LockClosedIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

interface Props {
  company: any
  request: any
  ownerName?: string
}

export function WaitingRequestCard({ company, request, ownerName }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-[var(--brand-light)] text-xl font-bold text-[var(--brand-primary)]">
              {company?.name?.[0] || 'C'}
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--text)]">{company?.name || 'Компания'}</div>
              <div className="text-xs text-[var(--text-3)]">{company?.industry} · {company?.uuid}</div>
            </div>
          </div>
          <Badge variant="secondary" className="text-[var(--warn)]">
            <div className="size-1.5 rounded-full bg-[var(--warn)] mr-1.5" /> Ожидает подтверждения
          </Badge>
        </div>

        <div className="border-t border-[var(--border)] pt-4 space-y-3">
          <div className="text-sm text-[var(--text-2)]">Запрос отправлен {request?.dateText || '6 октября 2026, 09:40'}</div>
          <div className="text-sm italic text-[var(--text-3)]">«Присоединяюсь к команде как дизайнер.»</div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
            <Avatar className="size-5 bg-[var(--surface-2)]">
              <AvatarFallback className="text-[8px] text-[var(--text-2)]">
                {ownerName ? ownerName.split(' ').map((n: string) => n[0]).join('') : 'АС'}
              </AvatarFallback>
            </Avatar>
            Подтверждает {ownerName || 'владелец'} · владелец
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button disabled>
            <LockClosedIcon className="size-4" /> Доступ ещё не открыт
          </Button>
          <Button variant="outline">Отменить запрос</Button>
        </div>
      </CardContent>
    </Card>
  )
}