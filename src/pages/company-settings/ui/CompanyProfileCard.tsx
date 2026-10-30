import { CopyIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Badge } from '@/shared/ui/badge'

interface Props {
  company: any
}

export function CompanyProfileCard({ company }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* О компании */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>О компании</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Название компании</Label>
            <Input id="name" defaultValue={company.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Описание</Label>
            <Input id="desc" defaultValue={company.industry || '—'} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="domain">Рабочий домен</Label>
            <Input id="domain" defaultValue={`${company.name.toLowerCase()}.team`} />
          </div>
          <Button className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-dark)] mt-2">
            Сохранить изменения
          </Button>
        </CardContent>
      </Card>

      {/* ID компании */}
      <Card>
        <CardHeader>
          <CardTitle>ID компании</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--text-2)]">Передайте ID коллеге, чтобы он отправил запрос на вступление.</p>
          <div className="flex items-center justify-between rounded-lg bg-[var(--surface-2)] p-4">
            <span className="text-2xl font-bold font-mono tracking-wider text-[var(--brand-primary)]">
              {company.uuid.toUpperCase()}
            </span>
            <Button variant="ghost" size="icon">
              <CopyIcon className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[var(--brand-light)] text-[var(--brand-primary)] rounded-full">
              Владелец: {company.owner_name || 'Алексей Морозов'}
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-3)] mt-2">
            ID постоянный. Знание ID не даёт доступ: каждый запрос подтверждает владелец.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}