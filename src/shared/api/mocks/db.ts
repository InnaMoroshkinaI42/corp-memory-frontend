import type { User, Company, Chat, ChatMessage, Document, CompanyJoinRequest } from '../types'

export const CURRENT_USER_ID = 'u-1'

export interface CompanyWithStats extends Company {}

export const db = {
  users: [
    { uuid: 'u-1', first_name: 'Алексей', last_name: 'Морозов' },
    { uuid: 'u-2', first_name: 'Марина', last_name: 'Соколова' },
    { uuid: 'u-3', first_name: 'Дмитрий', last_name: 'Волков' },
    { uuid: 'u-4', first_name: 'Елена', last_name: 'Соколова' },
  ] as User[],

  companies: [
    { 
      uuid: 'c-1', 
      name: 'Nordwind Analytics company', 
      owner_id: 'u-1', 
      owner_name: 'Алексей Морозов',
      created_at: new Date().toISOString(),
      role: 'Владелец',
      members: 6,
      documents: 24,
      chats: 8,
      plan: 'Team',
      industry: 'Продуктовая команда',
      lastActive: 'сегодня, 10:24'
    },
    { 
      uuid: 'c-2', 
      name: 'Skyline Retail', 
      owner_id: 'u-2', 
      owner_name: 'Марина Соколова',
      created_at: new Date().toISOString(),
      role: 'Администратор',
      members: 12,
      documents: 34,
      chats: 15,
      plan: 'Business',
      industry: 'Ритейл',
      lastActive: 'вчера, 18:30'
    },
  ] as CompanyWithStats[],

  documents: [
    {
      uuid: 'd-1', company_id: 'c-1', user_id: 'u-1',
      s3_key: 'mock/strategy-q3.mp4', s3_bucket: 'mock',
      original_name: 'Стратегическая сессия Q3 2026.mp4',
      mime_type: 'video/mp4', status: 'ACTIVE',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      uuid: 'd-2', company_id: 'c-1', user_id: 'u-2',
      s3_key: 'mock/board-meeting.m4a', s3_bucket: 'mock',
      original_name: 'Совет директоров — 14 сентября.m4a',
      mime_type: 'audio/m4a', status: 'ACTIVE',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      uuid: 'd-3', company_id: 'c-2', user_id: 'u-3',
      s3_key: 'mock/release-plan.pdf', s3_bucket: 'mock',
      original_name: 'План запуска продукта v2.4.pdf',
      mime_type: 'application/pdf', status: 'ACTIVE',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
  ] as Document[],

  chats: [
    { uuid: 'ch-1', company_id: 'c-1', user_id: 'u-1', title: 'Ключевые решения за сентябрь', created_at: new Date().toISOString() },
  ] as Chat[],

chatMessages: [
  {
  uuid: 'm-1', 
  chat_id: 'ch-1', 
  role: 'USER', 
  content: 'Что решили по запуску Atlas и кто за что отвечает?', 
  created_at: new Date().toISOString() 
},
{
  uuid: 'm-2', 
  chat_id: 'ch-1', 
  role: 'AI', 
  content: 'На встрече 5 октября команда согласовала сроки и приоритеты первого релиза Atlas. Вот основные договорённости:\n\n• Сроки запуска. Пилот для 10 клиентов — 12 октября 2026, публичный запуск — 20 октября. [1]\n• Объём релиза. Приоритет — поиск по источникам. Экспорт в CRM перенесён на следующий этап. [2]',
  created_at: new Date().toISOString(),
  sources: [
    { docId: 'd-1', label: 'Планирование запуска Atlas', quote: '«Фиксируем запуск Atlas на 20 октября. Пилот для десяти клиентов начинаем 12 октября.»', timestamp: '12:40' },
    { docId: 'd-1', label: 'Планирование запуска Atlas', quote: '«Приоритет релиза — поиск по источникам. Экспорт в CRM переносим на следующий этап. План запуска подготовлю к 9 октября.»', timestamp: '18:15' },
    { docId: 'd-1', label: 'Планирование запуска Atlas', quote: '«Проверю готовность аналитики к 8 октября. Анна, обнови FAQ для продаж к 7 октября.»', timestamp: '26:10' }
  ],
  tasks: [
    { id: 't-1', title: 'Подготовить план запуска', assignee: 'Мария Крылова', due: '9 октября', sourceIndex: 2 },
    { id: 't-2', title: 'Проверить готовность аналитики', assignee: 'Илья Волков', due: '8 октября', sourceIndex: 3 },
    { id: 't-3', title: 'Обновить FAQ для продаж', assignee: 'Анна Лебедева', due: '7 октября', sourceIndex: 3 }
  ]
},
] as ChatMessage[],

  joinRequests: [
    { 
      uuid: 'jr-1', 
      company_id: 'c-1', 
      user_id: 'u-4',
      status: 'SENDED', 
      created_at: new Date().toISOString(),
      dateText: '6 октября, 09:40'
    },
  ] as (CompanyJoinRequest & { dateText: string })[],

  // Данные для дашборда (по ID компании)
  dashboards: {
    'c-1': {
      stats: { documents: 24, chats: 18.5, decisions: 9 },
      recentDocuments: [
        { id: 'd1', title: 'Исследование клиентов Atlas', type: 'pdf', meta: 'PDF · 12 страниц · 4 окт 2026', status: 'ready' },
        { id: 'd2', title: 'Интервью с клиентом', type: 'audio', meta: 'Аудио · 28 мин · 6 окт 2026', status: 'processing' },
      ],
      recentDecisions: [
        { id: 'dec1', text: 'Запуск Atlas — 20 октября 2026', sub: 'Пилот для 10 клиентов — 12 октября. Приоритет релиза — поиск по источникам.', source: 'Планирование запуска Atlas · 12:40' },
      ],
      teamActivity: [
        { id: 't1', text: 'Мария добавила «Планирование запуска Atlas»', date: '5 октября, 16:20', initials: 'МС' },
        { id: 't2', text: 'Елена Соколова ждёт одобрения', date: '5 октября, 16:20', link: 'Рассмотреть запрос', initials: 'ЕС' },
      ],
    },
    'c-2': {
      stats: { documents: 34, chats: 12, decisions: 15 },
      recentDocuments: [
        { id: 'd3', title: 'Отчёт по продажам Q3', type: 'pdf', meta: 'PDF · 24 страницы · 1 окт 2026', status: 'ready' },
      ],
      recentDecisions: [
        { id: 'dec2', text: 'Открыть новый филиал в Казани', sub: 'Запуск в ноябре 2026.', source: 'Стратегическая сессия · 15:00' },
      ],
      teamActivity: [
        { id: 't3', text: 'Анна обновила прогноз продаж', date: '4 октября, 11:15', initials: 'АП' },
      ],
    },
  },

  
  profileSecurity: {
    passwordUpdatedAt: '1 октября 2026',
    sessions: [
      {
        id: 's1',
        device: 'Chrome · macOS',
        location: 'Москва',
        lastActive: '6 октября, 10:24',
        isCurrent: true,
      },
    ],
    companyToTransfer: 'Nordwind Analytics', // <-- без хардкода «Север»
  },
}