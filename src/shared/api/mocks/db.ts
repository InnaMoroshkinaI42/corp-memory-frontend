import type { User, Company, Chat, ChatMessage, Document, CompanyJoinRequest } from '../types'

export const CURRENT_USER_ID = 'u-1'

export const db = {
  users: [
    { uuid: 'u-1', first_name: 'Алексей', last_name: 'Морозов' },
    { uuid: 'u-2', first_name: 'Марина', last_name: 'Соколова' },
    { uuid: 'u-3', first_name: 'Дмитрий', last_name: 'Волков' },
  ] as User[],

  companies: [
    { uuid: 'c-1', name: 'Nordwind Analytics', owner_id: 'u-1', created_at: new Date().toISOString() },
    { uuid: 'c-2', name: 'Skyline Retail', owner_id: 'u-2', created_at: new Date().toISOString() },
  ] as Company[],

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
      uuid: 'd-3', company_id: 'c-1', user_id: 'u-3',
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
    { uuid: 'm-1', chat_id: 'ch-1', role: 'USER', content: 'Какие решения были приняты по онбордингу?', created_at: new Date().toISOString() },
    { uuid: 'm-2', chat_id: 'ch-1', role: 'AI', content: 'Онбординг корпоративного клиента сокращён с 14 до 6 дней. Введён ролевой доступ.', created_at: new Date().toISOString() },
  ] as ChatMessage[],

  joinRequests: [
    { uuid: 'jr-1', company_id: 'c-1', user_id: 'u-2', status: 'SENDED', created_at: new Date().toISOString() },
  ] as CompanyJoinRequest[],
}