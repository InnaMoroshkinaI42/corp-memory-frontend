import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

interface Props {
  companyName: string
  companyId: string
}

export function DocumentMetaForm({ companyName, companyId }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Название документа</Label>
        <Input id="title" placeholder="Например, Планирование запуска Atlas" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Компания</Label>
          <div className="flex h-10 items-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text-2)]">
            {companyName} · {companyId}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Язык записи</Label>
          <Select defaultValue="ru">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru">Русский</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}