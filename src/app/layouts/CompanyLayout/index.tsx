import { Outlet, useParams, NavLink, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/shared/ui/Header'
import { Footer } from '@/shared/ui/Footer'
import { cn } from '@/shared/lib'
import {
  LayersIcon, HomeIcon, ChatBubbleIcon, FileTextIcon,
  CheckCircledIcon, PersonIcon, GearIcon, QuestionMarkCircledIcon,
} from '@radix-ui/react-icons'

const NAV_ITEMS = [
  { to: 'overview', icon: HomeIcon, label: 'Обзор компании' },
  { to: 'chats', icon: ChatBubbleIcon, label: 'Чаты' },
  { to: 'documents', icon: FileTextIcon, label: 'Документы' },
  { to: 'decisions', icon: CheckCircledIcon, label: 'Решения' },
  { to: 'members', icon: PersonIcon, label: 'Участники' },
  { to: 'settings', icon: GearIcon, label: 'Настройки' },
]

export function CompanyLayout() {
  const { id } = useParams()

  const { data: company } = useQuery({
    queryKey: ['company', id],
    queryFn: () => fetch(`/api/companies/${id}`).then(r => r.json()),
    enabled: !!id,
  })

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/profile').then(r => r.json()),
  })

  const companyName = company?.name || '...'
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : '...'

  if (!user) return <div>Загрузка...</div>

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* Сайдбар (прибит слева) */}
      <aside className="flex w-64 flex-col border-r border-[var(--border)] bg-white">
        {/* Бренд */}
        <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-6">
          <Link to="/companies" className="grid size-8 place-items-center rounded-lg bg-[var(--brand-primary)]">
            <LayersIcon className="size-5 text-white" />
          </Link>
          <b className="text-lg tracking-tight text-[var(--text)]">MeetMind</b>
        </div>

        {/* Переключатель компании */}
        <div className="p-4">
          <button className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] p-2 text-left hover:bg-gray-50">
            <div className="grid size-8 place-items-center rounded bg-[var(--brand-primary)] text-white font-bold">
              {companyName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{companyName}</div>
              <div className="text-xs text-[var(--text-3)]">Компания</div>
            </div>
            <span className="text-[var(--text-3)]">↕</span>
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 space-y-1 px-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={`/app/${item.to}/${id}`}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--brand-light)] text-[var(--brand-primary)]"
                  : "text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Помощь и поддержка */}
        <div className="border-t border-[var(--border)] p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]">
            <QuestionMarkCircledIcon className="size-4" />
            Помощь и поддержка
          </button>
        </div>

        {/* Пользователь */}
        <div className="border-t border-[var(--border)] p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-full bg-[var(--brand-light)] text-xs font-bold text-[var(--brand-primary)]">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-[var(--text)]">
                {user.first_name} {user.last_name}
              </div>
              <div className="truncate text-xs text-[var(--text-3)]">
                {user.role || 'Владелец'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Правая часть */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Header
          breadcrumbs={[
            { label: 'Мои компании', to: '/companies' },
            { label: companyName, to: `/app/overview/${id}` },
            { label: 'Обзор' },
          ]}
          user={user}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  )
}