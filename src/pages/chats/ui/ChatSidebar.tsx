import { Link, useNavigate } from 'react-router-dom'
import { PlusIcon, MagnifyingGlassIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
  chats: any[]
  activeChatId?: string
  companyId: string
}

export function ChatSidebar({ chats, activeChatId, companyId }: Props) {
  // Все хуки — ВНУТРИ компонента
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createChat = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: companyId, title: 'Новый диалог' }),
      })
      return res.json()
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['chats', companyId] })
      navigate(`/app/chats/${companyId}/${newChat.uuid}`)
    },
  })

  return (
    <div className="flex h-full w-80 flex-col border-r border-[var(--border)] bg-white">
      <div className="p-4 border-b border-[var(--border)]">
        <Button 
          className="w-full gap-2 mb-4" 
          onClick={() => createChat.mutate()} 
          disabled={createChat.isPending}
        >
          <PlusIcon className="size-4" /> {createChat.isPending ? 'Создание...' : 'Новый чат'}
        </Button>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-3)]" />
          <Input placeholder="Найти чат..." className="pl-9 bg-[var(--surface-2)] border-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        <div>
          <div className="px-2 pb-2 text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider">Сегодня</div>
          {chats.map((chat) => (
            <Link key={chat.uuid} to={`/app/chats/${companyId}/${chat.uuid}`}>
              <div className={cn(
                "flex flex-col gap-1 rounded-lg p-3 transition-colors",
                activeChatId === chat.uuid ? "bg-[var(--brand-light)]" : "hover:bg-[var(--surface-2)]"
              )}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[var(--text)] truncate">{chat.title}</span>
                  <span className="text-[10px] text-[var(--text-3)]">
                    {new Date(chat.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className="text-xs text-[var(--text-3)] truncate">Сроки, решения и ответственные</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--border)] text-xs text-[var(--text-3)] flex items-center gap-2">
        <LockClosedIcon className="size-4" /> Только материалы компании
      </div>
    </div>
  )
}