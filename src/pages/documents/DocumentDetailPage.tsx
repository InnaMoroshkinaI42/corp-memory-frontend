import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon, DownloadIcon, ChatBubbleIcon, LockClosedIcon, StarIcon } from '@radix-ui/react-icons'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent } from '@/shared/ui/card'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { DocumentViewer } from '@/shared/ui/DocumentViewer'

export function DocumentDetailPage() {
  const { id, docId } = useParams()

  const { data: company } = useQuery({
    queryKey: ['company', id],
    queryFn: () => fetch(`/api/companies/${id}`).then(r => r.json()),
    enabled: !!id,
  })

  const { data: doc, isLoading } = useQuery({
    queryKey: ['document', docId],
    queryFn: () => fetch(`/api/documents/${docId}`).then(r => r.json()),
    enabled: !!docId,
  })

  if (isLoading || !doc || !company) return <div className="p-8">Загрузка...</div>

  const isMedia = doc.mime_type?.includes('video') || doc.mime_type?.includes('audio')
  const typeLabel = doc.mime_type?.includes('video') ? 'Видео' : doc.mime_type?.includes('audio') ? 'Аудио' : 'PDF'
  const meta = doc.mime_type?.includes('pdf') ? `${doc.pages || 12} страниц` : doc.duration || '42 мин'

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      <Link to={`/app/documents/${id}`} className="inline-flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--text)] mb-6">
        <ArrowLeftIcon className="size-4" /> К документам
      </Link>

      {/* Шапка */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">{doc.original_name?.replace(/\.[^.]+$/, '')}</h1>
          <p className="mt-2 text-sm text-[var(--text-2)]">
            {typeLabel} · 5 октября 2026 · Компания «{company.name}»
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2"><DownloadIcon className="size-4" /> Скачать</Button>
          <Link to={`/app/chats/${id}`}>
            <Button className="gap-2"><ChatBubbleIcon className="size-4" /> Спросить ИИ</Button>
          </Link>
        </div>
      </div>

      {/* Мета-данные (плашки) */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-3)] mb-8">
        <Badge variant="success"><div className="size-1.5 rounded-full bg-[var(--success)] mr-1.5" /> Готов</Badge>
        <span>{meta}</span>
        <span>·</span>
        <span>{doc.mime_type?.split('/')[1]?.toUpperCase()} · {doc.size || '148 МБ'}</span>
        <span>·</span>
        <span>Загрузила Мария Крылова · 5 окт, 16:20</span>
        <span>·</span>
        <span>{doc.participants?.length || 4} участника встречи</span>
      </div>

      {/* Табы */}
      <div className="flex gap-6 border-b border-[var(--border)] mb-6">
        <button className="pb-3 text-sm font-medium text-[var(--brand-primary)] border-b-2 border-[var(--brand-primary)]">Обзор и результаты</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Левая колонка (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Краткое содержание */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <StarIcon className="size-5 text-[var(--brand-primary)]" />
                <h2 className="text-lg font-semibold text-[var(--text)]">Краткое содержание</h2>
                <Badge variant="brand" className="rounded-full px-2 py-0 text-[10px]">AI</Badge>
              </div>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">
                {doc.summary || 'Команда согласовала сроки запуска Atlas и объём первого релиза. Пилот на 10 клиентов начинается 12 октября, публичный запуск — 20 октября 2026. В фокусе — поиск по источникам; экспорт в CRM отложен.'}
              </p>
              <p className="mt-4 text-xs text-[var(--text-3)]">Сформировано 5 октября, 16:24 · Проверьте важные детали по источнику</p>
            </CardContent>
          </Card>

          {/* Транскрипт */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-[var(--text)]">Транскрипт</h2>
                <a href="#" className="text-sm text-[var(--brand-primary)] hover:underline">Полная расшифровка →</a>
              </div>
              <p className="text-xs text-[var(--text-3)] mb-4">Ключевые фрагменты · русский язык</p>
              <div className="space-y-4">
                {(doc.transcript || [
                  { time: '12:40', name: 'Алексей Смирнов', text: 'Фиксируем запуск Atlas на 20 октября. Пилот для десяти клиентов начинаем 12 октября.' },
                  { time: '18:15', name: 'Мария Крылова', text: 'Приоритет релиза — поиск по источникам. Экспорт в CRM переносим на следующий этап. План запуска подготовлю к 9 октября.' },
                  { time: '26:10', name: 'Илья Волков', text: 'Проверю готовность аналитики к 8 октября. Анна, обнови FAQ для продаж к 7 октября.' },
                ]).map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 text-sm">
                    <span className="shrink-0 font-mono text-xs text-[var(--brand-primary)] w-10 pt-0.5">{item.time}</span>
                    <div>
                      <div className="font-semibold text-[var(--text)]">{item.name}</div>
                      <div className="text-[var(--text-2)] mt-0.5">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Плеер (только если видео/аудио) */}
          {isMedia && <DocumentViewer mimeType={doc.mime_type} meta={meta} />}

          {/* Участники */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Участники встречи</h2>
              <div className="space-y-3">
                {(doc.participants || ['Алексей Смирнов', 'Мария Крылова', 'Илья Волков', 'Анна Лебедева']).map((name: string) => (
                  <div key={name} className="flex items-center gap-3">
                    <Avatar size="sm">
                      <AvatarFallback variant="brand">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-[var(--text)]">{name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Доступ */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <LockClosedIcon className="size-4 text-[var(--text-3)]" />
                <span className="text-sm font-semibold text-[var(--text)]">Доступ: участники «{company.name}»</span>
              </div>
              <p className="text-sm text-[var(--text-2)]">Документ не виден другим компаниям. Права участников задаёт владелец.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}