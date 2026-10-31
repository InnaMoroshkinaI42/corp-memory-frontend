import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { Input } from './input'
import { Button } from './button'
import { useState } from 'react'
import { PaperPlaneIcon } from '@radix-ui/react-icons'

interface Props {
  companyName: string
  documentCount: number
  onSend: (text: string) => void
}

export function EmptyChatState({ companyName, documentCount, onSend }: Props) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  return (
    <Card className="m-8 border-none shadow-none bg-transparent">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <ChatBubbleIcon className="size-12 text-[var(--brand-primary)]" />
        <h2 className="text-2xl font-bold text-[var(--text)]">Спросите память вашей команды</h2>
        <p className="text-[var(--text-2)] max-w-md">
          Контекст найдёт решения, сроки и договорённости в материалах компании «{companyName}».
        </p>

        <div className="w-full max-w-2xl space-y-2">
          {['Что решили по запуску Atlas?', 'Почему экспорт в CRM перенесли?'].map((q, i) => (
            <Card key={i} className="cursor-pointer hover:border-[var(--brand-primary)] shadow-none" onClick={() => onSend(q)}>
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <ChatBubbleIcon className="size-4 text-[var(--brand-primary)]" />
                  {q}
                </div>
                <span className="text-[var(--text-3)]">↗</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="w-full max-w-2xl space-y-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Задайте вопрос..."
            className="h-11"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <div className="flex items-center justify-between">
            <Badge variant="secondary">📎 {companyName} · {documentCount}</Badge>
            <Button onClick={handleSend} className="gap-2">
              <PaperPlaneIcon className="size-4" /> Отправить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}