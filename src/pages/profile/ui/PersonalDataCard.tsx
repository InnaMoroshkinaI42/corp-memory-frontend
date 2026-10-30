import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

interface PersonalDataCardProps {
  user: {
    first_name: string
    last_name: string
    email: string
  }
}

export function PersonalDataCard({ user }: PersonalDataCardProps) {
  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Личные данные</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center gap-6">
          <Avatar className="size-20">
            <AvatarFallback className="bg-[var(--brand-light)] text-[var(--brand-primary)] text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="mb-2">Изменить фото</Button>
            <p className="text-xs text-[var(--text-3)]">JPG или PNG · до 5 МБ</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">Имя и фамилия</label>
            <Input defaultValue={`${user.first_name} ${user.last_name}`} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">Email</label>
            <Input defaultValue={user.email} />
            <p className="mt-1.5 text-xs text-[var(--text-3)]">Email подтверждён. Используется для входа и уведомлений.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">Язык интерфейса</label>
              <Select defaultValue="ru">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите язык" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">Часовой пояс</label>
              <Select defaultValue="msk">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пояс" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="msk">Москва · UTC+3</SelectItem>
                  <SelectItem value="ber">Берлин · UTC+2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <Button >Сохранить изменения</Button>
          <span className="text-sm text-[var(--text-3)]">Последнее обновление: 6 октября</span>
        </div>
      </CardContent>
    </Card>
  )
}