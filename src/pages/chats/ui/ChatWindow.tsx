import { useState } from 'react'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Badge } from '@/shared/ui/badge'
import { ChatMessageBubble } from './ChatMessageBubble'
import { EmptyChatState } from '@/shared/ui/EmptyChatState' // <-- импорт

export function ChatWindow({ chat, companyName, documentCount, onSend }: any) {
  const [input, setInput] = useState('')

  // Если чат не выбран или в нём нет сообщений — показываем EmptyChatState
  if (!chat || chat.messages?.length === 0) {
    return (
      <EmptyChatState
        companyName={companyName}
        documentCount={documentCount}
        onSend={onSend}
      />
    )
  }

  // Иначе — обычный чат с историей
  return (
    <div className="flex h-full flex-col bg-[var(--bg)]">
      {/* Шапка чата */}
      <Card className="border-none shadow-none rounded-none border-b border-[var(--border)]">
        <CardContent className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="font-bold text-[var(--text)]">{chat.title}</h2>
            <p className="text-xs text-[var(--text-3)]">{companyName} · {new Date(chat.created_at).toLocaleDateString('ru-RU')}</p>
          </div>
          <Badge variant="brand">• {documentCount} документа</Badge>
        </CardContent>
      </Card>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chat.messages?.map((msg: any) => <ChatMessageBubble key={msg.uuid} message={msg} />)}
      </div>

      {/* Ввод */}
      <Card className="border-none shadow-none rounded-none border-t border-[var(--border)]">
        <CardContent className="p-4 space-y-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Задайте вопрос по материалам компании..."
            className="h-11"
            onKeyDown={(e) => e.key === 'Enter' && (onSend(input), setInput(''))}
          />
          <div className="flex justify-end">
            <Button onClick={() => { onSend(input); setInput('') }} className="gap-2">
              <PaperPlaneIcon className="size-4" /> Отправить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}