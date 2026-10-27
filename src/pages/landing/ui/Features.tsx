import { ChatBubbleIcon, StarIcon, FileTextIcon, LockClosedIcon, LayersIcon, RocketIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { IconBox } from '@/shared/ui/IconBox'
import { Badge } from '@/shared/ui/badge'

const FEATURES = [
  { icon: FileTextIcon, title: 'Все материалы в одном месте', desc: 'Аудио, PDF, DOC, DOCX, MD, TXT и текстовые записи — без разрозненных папок.', badge: 'Единая база' },
  { icon: StarIcon, title: 'ИИ-конспект, решения и задачи', desc: 'ИИ делает краткое содержание, выделяет ключевые темы и сохраняет полный транскрипт.', badge: 'AI-анализ' },
  { icon: ChatBubbleIcon, title: 'Решения, которые не теряются', desc: 'Договорённости отделены от обсуждения. У каждого решения — ссылка на исходный фрагмент.', badge: 'Решения' },
  { icon: RocketIcon, title: 'Понятно, кто и что делает', desc: 'Задачи с исполнителями и сроками превращают результаты встречи в следующий шаг.', badge: 'Задачи' },
  { icon: LayersIcon, title: 'Ответы с доказательствами', desc: 'Спрашивайте по-человечески. MeetMind отвечает по памяти компании и показывает цитаты.', badge: 'Чаты с ИИ' },
  { icon: LockClosedIcon, title: 'Компания — граница доступа', desc: 'Каждая компания имеет свои документы и чаты. Владелец управляет ролями и вступлением.', badge: 'Доступы' }
]

export function Features() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--text)]">Общая память, на которую можно опереться</h2>
        <p className="mt-4 text-center text-[var(--text-2)]">
            <p>Меньше повторных вопросов и забытых договорённостей.</p>
            <p>Больше ясности — на встрече, после неё и через месяц.</p>
        </p>
        
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Card key={i} className="bg-[var(--bg)] border-none shadow-none">
              <CardContent className="p-6">
                <IconBox icon={f.icon} className="mb-4 bg-white shadow-sm" />
                <h3 className="text-lg font-semibold text-[var(--text)]">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-2)] leading-relaxed">{f.desc}</p>
                <Badge variant="secondary" className="mt-4 bg-white shadow-sm text-[var(--text-2)]">{f.badge}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}