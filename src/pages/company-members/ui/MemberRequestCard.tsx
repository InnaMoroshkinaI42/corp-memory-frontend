import { CheckIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

interface Props {
  requests: any[]
  onApprove: (id: string) => void
}

export function MemberRequestCard({ requests, onApprove }: Props) {
  if (requests.length === 0) return null

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Запросы на вступление · {requests.length}</CardTitle>
          <p className="text-sm text-[var(--text-3)] mt-1">Подтвердить или отклонить запрос может только владелец</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {requests.map((req) => (
          <div key={req.uuid} className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-3">
              <Avatar className="size-9 bg-[var(--brand-light)]">
                <AvatarFallback className="text-[var(--brand-primary)] text-xs font-bold">
                  {req.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">{req.user_name}</div>
                <div className="text-xs text-[var(--text-3)]">
                  {req.user_email} · по ID SEV-4821 · {req.dateText}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-[var(--warn-soft)] text-[var(--warn)] rounded-full px-3 py-1">
                <div className="size-1.5 rounded-full bg-[var(--warn)] mr-1.5" /> Ожидает подтверждения
              </Badge>
              <Button variant="outline" className="h-9 px-4">Отклонить</Button>
              <Button className="h-9 px-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-dark)] text-white gap-2" onClick={() => onApprove(req.uuid)}>
                <CheckIcon className="size-4" /> Одобрить
              </Button>
            </div>
          </div>
        ))}
        <div className="px-6 pb-4 text-xs text-[var(--text-3)]">
          После одобрения пользователь получит роль «Участник».
        </div>
      </CardContent>
    </Card>
  )
}