import { Link } from 'react-router-dom'
import { QuestionMarkCircledIcon, LayersIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarFallback } from './avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb'

interface HeaderProps {
  breadcrumbs: { label: string; to?: string }[]
  user: { first_name: string; last_name: string }
}

export function Header({ breadcrumbs, user }: HeaderProps) {
  const initials = `${user.first_name[0]}${user.last_name[0]}`
  const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-8">
      <div className="flex items-center gap-8">
        <Link to="/companies" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-[var(--brand-primary)]">
            <LayersIcon className="size-5 text-white" />
          </div>
          <b className="text-lg tracking-tight text-[var(--text)]">MeetMind</b>
        </Link>

        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, i) => (
              <BreadcrumbItem key={i}>
                {item.to ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.to}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--text-2)]">{today}</span>
        <QuestionMarkCircledIcon className="size-5 text-[var(--text-3)]" />
        <Link to="/profile" className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)]">Личный профиль</Link>
        <Avatar className="size-8">
          <AvatarFallback className="bg-[var(--brand-light)] text-[var(--brand-primary)] text-xs font-bold">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}