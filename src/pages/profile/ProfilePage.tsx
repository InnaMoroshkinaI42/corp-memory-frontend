import { useQuery } from '@tanstack/react-query'
import { ProfileHeader } from './ui/ProfileHeader'
import { PersonalDataCard } from './ui/PersonalDataCard'
import { NotificationsCard } from './ui/NotificationsCard'
import { SecuritySidebar } from './ui/SecuritySidebar'

interface Profile {
  uuid: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  joined: string
  timezone: string
}

const fetchProfile = async (): Promise<Profile> => {
  const res = await fetch('/api/profile')
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })

  if (isLoading) return <div className="p-8 text-center text-[var(--text-2)]">Загрузка профиля...</div>
  if (!user) return <div className="p-8 text-center text-[var(--danger)]">Профиль не найден</div>

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ProfileHeader />
      
      <main className="mx-auto max-w-6xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight">Личный профиль</h1>
          <p className="mt-2 text-[15px] text-[var(--text-2)]">
            Настройки вашего аккаунта. Они не меняют настройки компании.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PersonalDataCard user={user} />
            <NotificationsCard />
          </div>
          
          <div className="lg:col-span-1">
            <SecuritySidebar />
          </div>
        </div>

        <footer className="mt-12 flex justify-between border-t border-[var(--border)] pt-6 text-sm text-[var(--text-3)]">
          <div>© 2026 MeetMind</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[var(--text)]">Конфиденциальность</a>
            <a href="#" className="hover:text-[var(--text)]">Поддержка</a>
          </div>
        </footer>
      </main>
    </div>
  )
}