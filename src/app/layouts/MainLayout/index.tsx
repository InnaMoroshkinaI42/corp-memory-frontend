import { Outlet, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/shared/ui/Header'
import { Footer } from '@/shared/ui/Footer'

export function MainLayout() {
  const location = useLocation()
  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/profile').then(r => r.json()),
  })

  if (!user) return <div className="p-8">Загрузка...</div>

  const breadcrumbs = location.pathname === '/profile'
    ? [{ label: 'Профиль' }]
    : [{ label: 'Мои компании' }]

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <Header breadcrumbs={breadcrumbs} user={user} />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}
