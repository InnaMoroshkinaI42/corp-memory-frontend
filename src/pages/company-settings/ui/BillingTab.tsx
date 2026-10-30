import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'

export function BillingTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Текущий тариф</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">Team</div>
              <p className="text-sm text-[var(--text-3)]">2,4 из 10 ГБ использовано</p>
            </div>
            <Badge variant="secondary" className="text-[var(--success)]">Активен</Badge>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--surface-2)]">
            <div className="h-2 rounded-full bg-[var(--brand-primary)]" style={{ width: '24%' }} />
          </div>
          <div className="flex justify-end">
            <Button >
              Управление тарифом
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}