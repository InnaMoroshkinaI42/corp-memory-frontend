import { ClockIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'

interface Props {
  isSent: boolean
  companyName?: string
  ownerName?: string 
  onCancel: () => void
}

export function JoinStatusCard({ isSent, companyName, ownerName, onCancel }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid size-10 place-items-center rounded-lg bg-[var(--warn-soft)] text-[var(--warn)] mb-4">
          <ClockIcon className="size-5" />
        </div>
        <h3 className="text-xl font-bold text-[var(--text)] mb-2">Ожидает подтверждения</h3>
        
        {isSent && (
          <Badge className="mb-4 bg-[var(--warn-soft)] text-[var(--warn)] rounded-full">
            <div className="size-1.5 rounded-full bg-[var(--warn)] mr-1.5" /> Запрос в «{companyName}»
          </Badge>
        )}

        <p className="text-sm text-[var(--text-2)] leading-relaxed mb-4">
          {ownerName} владелец компании, рассмотрит запрос. До одобрения документы и чаты недоступны.
        </p>

        {isSent && (
          <Button variant="outline" className="w-full h-11" onClick={onCancel}>
            Отменить запрос
          </Button>
        )}
      </CardContent>
    </Card>
  )
}