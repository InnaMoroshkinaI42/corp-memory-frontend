import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { AiAvatar } from '@/shared/ui/AiAvatar'
import { Badge } from '@/shared/ui/badge'
import { ChatTaskCard } from '@/shared/ui/ChatTaskCard'
import { ChatSourcesList } from '@/shared/ui/ChatSourcesList'

export function ChatMessageBubble({ message }: { message: any }) {
  const isUser = message.role === 'USER'

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? (
        <Avatar>
          <AvatarFallback variant="brand">АМ</AvatarFallback>
        </Avatar>
      ) : (
        <AiAvatar />
      )}

      <div className={`max-w-[85%] space-y-4 ${isUser ? 'items-end' : ''}`}>
        {!isUser && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[var(--text)]">MeetMind</span>
            <Badge variant="brand" className="rounded-full px-2 py-0">
              По материалам компании
            </Badge>
          </div>
        )}

        <div
          className={`text-sm leading-relaxed ${
            isUser
              ? 'bg-[var(--surface-2)] p-4 rounded-2xl rounded-tr-sm text-[var(--text)]'
              : 'text-[var(--text)] whitespace-pre-wrap'
          }`}
        >
          {message.content}
        </div>

        {message.tasks && message.tasks.length > 0 && <ChatTaskCard tasks={message.tasks} />}
        {message.sources && message.sources.length > 0 && <ChatSourcesList sources={message.sources} />}
      </div>
    </div>
  )
}