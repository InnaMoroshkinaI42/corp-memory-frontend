import { CheckCircledIcon, LockClosedIcon, FileTextIcon, ChatBubbleIcon, Share2Icon, LayersIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

const BENEFITS = [
  { title: 'Изолированные пространства', desc: 'Документы и чаты не смешиваются между компаниями.' },
  { title: 'Доступ по ролям', desc: 'Владелец, администратор, участник и наблюдатель.' },
  { title: 'Вступление с подтверждением', desc: 'ID или ссылка создают запрос, а не открывают данные.' },
  { title: 'Данные не обучают модели', desc: 'Корпоративные материалы используются только для ваших ответов.' }
]

export function CompanyKnowledge() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        
        {/* Левая часть с текстом */}
        <div>
          <h2 className="text-4xl font-bold text-[var(--text)] tracking-tight leading-tight">
            Знания компании.<br/>
            Не общий доступ.
          </h2>
          <p className="mt-6 text-lg text-[var(--text-2)] leading-relaxed">
            MeetMind создаёт отдельную границу для каждой компании — от первого документа до последнего ответа ИИ.
          </p>
          
          <ul className="mt-10 space-y-6">
            {BENEFITS.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircledIcon className="mt-0.5 size-5 shrink-0 text-[var(--success)]" />
                <div>
                  <h3 className="font-semibold text-[var(--text)]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-2)] leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Правая часть — карточка на сером фоне */}
        
          <Card className="bg-[var(--bg)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-[var(--brand-primary)] text-white">
                    <LayersIcon className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-[var(--text)]">Север</div>
                    <div className="text-xs text-[var(--text-3)]">Защищённое пространство компании</div>
                  </div>
                </div>
                <LockClosedIcon className="size-5 text-[var(--text-3)]" />
              </div>

              {/* Пунктирная рамка */}
              <div className="rounded-xl border border-dashed border-[var(--border-strong)] p-5 space-y-5 bg-white p-3">
                {[
                  { icon: FileTextIcon, title: '24 документа', sub: 'Записи, файлы и заметки' },
                  { icon: ChatBubbleIcon, title: '8 чатов', sub: 'Ответы только по материалам компании' },
                  { icon: Share2Icon, title: 'Решения и задачи', sub: 'Источники сохранены' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className="size-5 text-[var(--brand-primary)]" />
                      <div>
                        <div className="text-sm font-semibold text-[var(--text)]">{item.title}</div>
                        <div className="text-xs text-[var(--text-3)]">{item.sub}</div>
                      </div>
                    </div>
                    <CheckCircledIcon className="size-5 text-[var(--success)]" />
                  </div>
                ))}
              </div>

              {/* Карточка с запросом */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-white p-3 border border-[var(--border)] shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 bg-[var(--brand-light)]">
                    <AvatarFallback className="text-[var(--brand-primary)] text-xs font-bold">ЕС</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">Елена запрашивает доступ</div>
                    <div className="text-xs text-[var(--text-3)]">Владелец подтверждает вступление</div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-[var(--warn-soft)] text-[var(--warn)] border-none">
                  <div className="size-1.5 rounded-full bg-[var(--warn)] mr-1.5" /> Ожидает
                </Badge>
              </div>
            </CardContent>
          </Card>
      

      </div>
    </section>
  )
}