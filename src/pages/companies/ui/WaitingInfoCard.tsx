import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'

interface Props {
  companyName?: string
}

export function WaitingInfoCard({ companyName }: Props) {
  return (
    <Card className="bg-[var(--brand-light)] border-none">
      <CardContent className="p-6">
        <div className="grid size-10 place-items-center rounded-lg bg-white text-[var(--brand-primary)] mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h3 className="text-xl font-bold text-[var(--text)] mb-4">Что будет после одобрения</h3>
        <ul className="space-y-3">
          {[
            'Компания появится в вашем списке',
            'Вы получите роль «Участник»',
            `Откроются документы и чаты «${companyName || 'Компания'}»`,
            'На email придёт подтверждение'
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <CheckCircledIcon className="size-4 text-[var(--success)] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}