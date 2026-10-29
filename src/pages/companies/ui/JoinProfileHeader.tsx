import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

interface Props {
  user: { first_name: string; last_name: string; email: string }
}

export function JoinProfileHeader({ user }: Props) {
  const initials = `${user.first_name[0]}${user.last_name[0]}`
  
  return (
    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border)]">
      <Avatar className="size-10 bg-[var(--brand-light)]">
        <AvatarFallback className="text-[var(--brand-primary)] text-sm font-bold">{initials}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold text-[var(--text)]">{user.first_name} {user.last_name}</div>
        <div className="text-sm text-[var(--text-3)]">{user.email} · личный аккаунт</div>
      </div>
    </div>
  )
}