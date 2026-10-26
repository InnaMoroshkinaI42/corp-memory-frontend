import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { CheckCircledIcon, DesktopIcon } from '@radix-ui/react-icons'
import { Badge } from '@/shared/ui/badge'

export function SecuritySidebar() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Безопасность</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <CheckCircledIcon className="size-5 text-[var(--success)]" />
            <Badge variant="secondary" className="bg-[var(--success-soft)] text-[var(--success)] rounded-full">
              Email подтверждён
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            Пароль обновлён 1 октября 2026. Рекомендуем менять его регулярно.
          </p>
          <Button variant="outline" className="w-full">Изменить пароль</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активные сессии</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex gap-3">
            <DesktopIcon className="mt-0.5 size-5 text-[var(--text-2)]" />
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Chrome · macOS</div>
              <div className="text-xs text-[var(--text-3)]">Москва · 6 октября, 10:24</div>
              <Badge variant="secondary" className="mt-2 bg-[var(--brand-light)] text-[var(--brand-primary)] uppercase tracking-wider text-[10px]">
                Текущая сессия
              </Badge>
            </div>
          </div>
          <button className="text-left text-sm font-medium text-[var(--brand-primary)] hover:underline">
            Завершить остальные сессии
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Управление аккаунтом</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            Чтобы удалить аккаунт, сначала передайте владение компанией «Север».
          </p>
          <button className="text-left text-sm font-medium text-[var(--danger)] hover:underline">
            Удаление аккаунта
          </button>
        </CardContent>
      </Card>
    </div>
  )
}