import { FileTextIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

interface Props {
  companyId: string
  setCompanyId: (v: string) => void
  company: any
  isPending: boolean
  isSent: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function JoinRequestForm({ companyId, setCompanyId, company, isPending, isSent, onSubmit }: Props) {
  if (isSent) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--brand-light)]">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-[var(--brand-primary)] text-white font-bold">
              {company?.name?.[0] || 'C'}
            </div>
            <div>
              <div className="font-semibold text-[var(--text)]">{company?.name || 'Компания'}</div>
              <div className="text-xs text-[var(--text-3)]">Продуктовая команда · {company?.members || 6} участников</div>
            </div>
          </div>
          <CheckCircledIcon className="size-5 text-[var(--success)]" />
        </div>
        <Button variant="secondary" disabled className="w-full h-11 gap-2">
          <CheckCircledIcon className="size-4" /> Запрос отправлен
        </Button>
        <p className="text-xs text-[var(--text-3)] text-center">Запрос отправлен 6 октября 2026, 09:40. Уведомление об одобрении придёт на email.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="companyId">ID компании</Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FileTextIcon className="size-4 text-[var(--text-3)]" />
          </div>
          <Input 
            id="companyId" 
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="pl-10 h-11" 
            placeholder="Например, c-1" 
          />
        </div>
        <p className="text-xs text-[var(--text-3)]">Попросите ID у владельца компании.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="link">Или вставьте ссылку-приглашение</Label>
        <Input id="link" className="h-11" placeholder="https://meetmind.app/join/c-1" />
      </div>

      {company && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface-2)]">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-[var(--brand-primary)] text-white font-bold">
              {company.name[0]}
            </div>
            <div>
              <div className="font-semibold text-[var(--text)]">{company.name}</div>
              <div className="text-xs text-[var(--text-3)]">Компания · {company.members} участников</div>
            </div>
          </div>
          <CheckCircledIcon className="size-5 text-[var(--success)]" />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="message">Сообщение владельцу</Label>
        <Input id="message" className="h-11" placeholder="Присоединяюсь к команде как дизайнер." />
      </div>

      <Button 
        type="submit" 
        className="w-full h-11"
        disabled={!company || isPending}
      >
        {isPending ? 'Отправка...' : 'Отправить запрос'}
      </Button>
    </form>
  )
}