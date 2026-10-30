import { Link } from 'react-router-dom'
import { StarIcon, PlayIcon, ArrowRightIcon, LayersIcon, ChatBubbleIcon, FileTextIcon } from '@radix-ui/react-icons'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent } from '@/shared/ui/card'

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        
        {/* Левая часть */}
        <div>
          <Badge variant="secondary" className="bg-[var(--brand-light)] text-[var(--brand-primary)] rounded-full px-3 py-1 text-xs font-semibold">
            <StarIcon className="size-3 mr-1" /> ИИ-память встреч для команд
          </Badge>
          <h1 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-[var(--text)]">
            Каждая встреча компании становится <span className="text-[var(--brand-primary)]">знанием</span>, а не потерянной записью
          </h1>
          <p className="mt-6 text-lg text-[var(--text-2)] leading-relaxed max-w-lg">
            Превратите записи встреч и документы в общую память компании. Находите решения ответы вместе с их источниками.
          </p>
          <div className="mt-10 flex gap-4">
            <Link to="/register">
              <Button size="lg" className="h-12 px-6">
                <ArrowRightIcon className="mr-2 size-4" /> Создать компанию
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-6">
              <PlayIcon className="mr-2 size-4" /> Посмотреть демо
            </Button>
          </div>
        </div>
        
        {/* Правая часть — Иллюстрация */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-xl">
            
            {/* Верхняя панель браузера */}
            <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-gray-300" />
                <div className="size-2.5 rounded-full bg-gray-300" />
                <div className="size-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="ml-2 flex-1 rounded bg-white/50 px-2 py-0.5 text-[10px] text-[var(--text-3)]">
                app.MeetMind.ru / sever
              </div>
            </div>

            {/* Основной контент иллюстрации */}
            <div className="grid grid-cols-[120px_1fr] h-[330px]">
              
              {/* Мини-сайдбар */}
              <div className="border-r border-[var(--border)] p-3 bg-white">
                <div className="mb-4 flex items-center gap-1.5">
                  <div className="grid size-5 place-items-center rounded bg-[var(--brand-primary)] text-white">
                    <LayersIcon className="size-3" />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text)]">MeetMind</span>
                </div>
                <div className="mb-3 flex items-center gap-1 text-[10px] text-[var(--text-2)]">
                  Север <span className="text-[8px]">▼</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 rounded bg-[var(--brand-light)] px-1.5 py-1 text-[9px] font-medium text-[var(--brand-primary)]">
                    <LayersIcon className="size-3" /> Обзор
                  </div>
                  <div className="flex items-center gap-1.5 px-1.5 py-1 text-[9px] text-[var(--text-2)]">
                    <ChatBubbleIcon className="size-3" /> Чаты
                  </div>
                  <div className="flex items-center gap-1.5 px-1.5 py-1 text-[9px] text-[var(--text-2)]">
                    <FileTextIcon className="size-3" /> Документы
                  </div>
                </div>
              </div>

              {/* Основная область */}
              <div className="bg-[var(--bg)] p-4 overflow-hidden">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text)]">Обзор компании</span>
                  <div className="grid size-5 place-items-center rounded-full bg-blue-100 text-[8px] font-bold text-green-600">
                    АС
                  </div>
                </div>

                {/* Блок метрик */}
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {['24\nДокумента', '9\nРешений', '29,5\nЧасов'].map((s, i) => (
                    <div key={i} className="rounded bg-white p-2 shadow-sm border border-[var(--border)]">
                      <div className="text-sm font-bold text-[var(--text)]">{s.split('\n')[0]}</div>
                      <div className="text-[9px] text-[var(--text-3)] mt-0.5">{s.split('\n')[1]}</div>
                    </div>
                  ))}
                </div>

                {/* Последняя встреча */}
                <div className="mb-1 text-[10px] font-semibold text-[var(--text)]">Последняя встреча</div>
                <Card className="mb-2 border-blue-200 shadow-sm ">
                  <CardContent className="flex items-center justify-between p-2 ">
                    <div className="flex items-center gap-2 ">
                      <div className="grid size-6 place-items-center rounded bg-blue-50 text-green-600">
                        <PlayIcon className="size-3" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[var(--text)]">Планирование запуска Atlas</div>
                        <div className="text-[8px] text-[var(--text-3)]">5 октября · 42 мин</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-[var(--success-soft)] text-[var(--success)] text-[9px] px-1.5 py-0.5">
                      <div className="size-1 rounded-full bg-[var(--success)] mr-1" /> Готов
                    </Badge>
                  </CardContent>
                </Card>

                {/* Вопрос-ответ */}
                <Card className="shadow-sm ">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <StarIcon className="size-3 text-[var(--brand-primary)]" />
                      <span className="text-[10px] font-bold text-[var(--text)]">Когда запускаем Atlas?</span>
                    </div>
                    <p className="text-[9px] text-[var(--text-2)] leading-snug">
                      Пилот — 12 октября. Публичный запуск — 20 октября 2026.
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 rounded bg-[var(--brand-light)] px-1.5 py-1 text-[8px] font-medium text-[var(--brand-primary)] w-fit">
                      [1] Планирование запуска Atlas · 12:40 ↗
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}