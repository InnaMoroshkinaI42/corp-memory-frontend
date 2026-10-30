import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircledIcon, HomeIcon  } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { WaitingRequestCard } from './ui/WaitingRequestCard'
import { WaitingInfoCard } from './ui/WaitingInfoCard'

export function CompanyWaitingPage() {
  const [searchParams] = useSearchParams()
  const companyId = searchParams.get('companyId') || 'c-1' // По умолчанию 'c-1'

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/profile').then(r => r.json()),
  })

  const { data: company } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => fetch(`/api/companies/${companyId}`).then(r => r.json()),
  })

  if (!user || !company) return <div className="p-8">Загрузка...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Заголовок */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Мои компании</h1>
          <p className="mt-2 text-[var(--text-2)]">{user.first_name}, здесь появятся компании, к которым у вас есть доступ.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/companies/join">
            <Button variant="outline" className="gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
              Вступить в компанию
            </Button>
          </Link>
          <Link to="/companies/create">
            <Button className="gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-dark)] text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              Создать компанию
            </Button>
          </Link>
        </div>
      </div>

      {/* Зелёный баннер */}
      <div className="mb-8 flex items-center gap-3 rounded-lg bg-[var(--success-soft)] px-4 py-3 text-sm text-[var(--success)]">
        <CheckCircledIcon className="size-5" />
        Запрос на вступление в «{company.name}» отправлен. Мы уведомим вас, когда владелец его рассмотрит.
      </div>

      {/* Ожидающие запросы */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-[var(--text)] mb-4">Ожидающие запросы · 1</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WaitingRequestCard company={company} request={null} ownerName={company.owner_name} />
          <WaitingInfoCard companyName={company.name} />
        </div>
      </div>

      {/* Ваши компании · 0 */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text)] mb-4">Ваши компании · 0</h2>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--text-3)]">
                <HomeIcon  className="size-6" />
              </div>
              <div>
                <div className="font-semibold text-[var(--text)]">Пока нет доступных компаний</div>
                <div className="text-sm text-[var(--text-2)] mt-1">Дождитесь одобрения запроса или создайте своё пространство. Чужие материалы до подтверждения недоступны.</div>
              </div>
            </div>
            <Link to="/companies/create">
              <Button variant="outline">Создать компанию</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}