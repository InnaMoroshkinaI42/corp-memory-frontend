import { CopyIcon, UpdateIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Badge } from '@/shared/ui/badge'

interface Props {
  companyId: string
}

export function InviteLinkCard({ companyId }: Props) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ссылка-приглашение</CardTitle>
        <p className="text-sm text-[var(--text-3)] mt-1">Активна до 31 октября 2026</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input 
            readOnly 
            value={`app.meetmind.ru/join/${companyId}-k7m2`} 
            className="bg-[var(--surface-2)]" 
          />
          <Button variant="outline" className="gap-2">
            <CopyIcon className="size-4" /> Скопировать
          </Button>
          <Button variant="outline" className="gap-2">
            <UpdateIcon className="size-4" /> Обновить ссылку
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
            <CheckCircledIcon className="size-4 text-[var(--success)]" /> 
            Вступление по ссылке — только после одобрения владельцем.
          </div>
          <Badge variant="secondary" className="bg-[var(--success-soft)] text-[var(--success)]">
            Обязательно
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}