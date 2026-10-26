import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Switch } from '@/shared/ui/switch'

export function NotificationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Уведомления</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <div className="text-sm font-semibold text-[var(--text)]">Документ готов</div>
            <div className="text-xs text-[var(--text-3)]">Письмо после транскрибации и AI-анализа</div>
          </div>
          <Switch defaultChecked={true} />
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <div className="text-sm font-semibold text-[var(--text)]">Запросы на вступление</div>
            <div className="text-xs text-[var(--text-3)]">Новые заявки в компании, где вы владелец</div>
          </div>
          <Switch defaultChecked={true} />
        </div>
      </CardContent>
    </Card>
  )
}