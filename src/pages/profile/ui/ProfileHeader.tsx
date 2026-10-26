import { Link } from 'react-router-dom'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

export function ProfileHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-8">
      <div className="flex items-center gap-8">
        <Link to="/companies" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-[var(--brand-primary)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <b className="text-lg tracking-tight text-[var(--text)]">MeetMind</b>
        </Link>
        <Link to="/companies" className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)]">
          Мои компании
        </Link>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-[var(--text-3)] hover:text-[var(--text)]">
          <QuestionMarkCircledIcon className="size-5" />
        </button>
        <Link to="/profile" className="text-sm font-semibold text-[var(--brand-primary)]">
          Личный профиль
        </Link>
        <Avatar className="size-9">
          <AvatarFallback className="bg-[var(--brand-light)] text-[var(--brand-primary)] text-xs font-bold">
            АС
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}