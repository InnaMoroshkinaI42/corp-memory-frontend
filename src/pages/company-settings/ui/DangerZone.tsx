import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

export function DangerZone() {
  return (
    <Card className="border-[var(--danger-soft)] bg-[var(--danger-soft)]/30">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <div className="font-semibold text-[var(--text)]">Удаление компании</div>
          <div className="text-sm text-[var(--text-2)] mt-1">Все документы, чаты и решения будут удалены без возможности восстановления.</div>
        </div>
        <Button variant="destructive" className="bg-[var(--danger)] text-white hover:bg-red-700">Удалить компанию</Button>
      </CardContent>
    </Card>
  )
}