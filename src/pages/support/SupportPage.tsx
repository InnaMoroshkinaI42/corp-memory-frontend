import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion'

const FAQ = [
  {
    q: 'Как загрузить документ?',
    a: 'Перейдите в раздел «Документы» и нажмите «Загрузить документ». Поддерживаются аудио, видео, PDF, DOC, DOCX, MD, TXT. После загрузки ИИ автоматически сделает транскрибацию и анализ.',
  },
  {
    q: 'Как пригласить коллегу?',
    a: 'Откройте раздел «Участники» и нажмите «Пригласить участника». Отправьте ссылку-приглашение или введите email. Новый участник появится после подтверждения владельцем.',
  },
  {
    q: 'Как задать вопрос ИИ?',
    a: 'Перейдите в «Чаты» и создайте новый диалог. ИИ отвечает только по материалам вашей компании и всегда показывает источники.',
  },
  {
    q: 'Кто может удалить компанию?',
    a: 'Только владелец компании. Удаление находится в «Настройки» → «Опасная зона». Действие необратимо.',
  },
]

export function SupportPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)]">Помощь и поддержка</h1>
        <p className="mt-2 text-[var(--text-2)]">Найдите ответ или свяжитесь с нами.</p>
      </div>

      {/* Поиск */}
      <div className="relative mb-8">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-3)]" />
        <Input placeholder="Поиск по вопросам..." className="pl-9 h-11" />
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Частые вопросы</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Контакт */}
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <p className="text-[var(--text-2)] mb-4">Не нашли ответ? Напишите нам — ответим в течение рабочего дня.</p>
          <Button>
            <a href="mailto:support@meetmind.ru">Написать в поддержку</a>
          </Button>
        </CardContent>
      </Card>

    </div>
  )
}