import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Switch } from '@/shared/ui/switch'

export function SecurityTab() {
  const [requireApproval, setRequireApproval] = useState(true)
  const [publicLinks, setPublicLinks] = useState(false)
  const [retention, setRetention] = useState('unlimited')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Правила вступления</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[var(--text)]">Подтверждение владельцем</div>
              <div className="text-sm text-[var(--text-3)]">Новые участники входят только после одобрения.</div>
            </div>
            <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[var(--text)]">Публичные ссылки на конспект</div>
              <div className="text-sm text-[var(--text-3)]">Разрешить Администраторам создавать ссылки.</div>
            </div>
            <Switch checked={publicLinks} onCheckedChange={setPublicLinks} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Хранение материалов</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--text-2)]">Срок хранения загруженных файлов и транскриптов.</p>
          <Select value={retention} onValueChange={setRetention}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Выберите срок" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unlimited">Без ограничений</SelectItem>
              <SelectItem value="12">12 месяцев</SelectItem>
              <SelectItem value="6">6 месяцев</SelectItem>
              <SelectItem value="3">90 дней</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-dark)]">
          Сохранить настройки безопасности
        </Button>
      </div>
    </div>
  )
}