import { http, HttpResponse, delay } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import { db, CURRENT_USER_ID } from './db'
import type { Company, Document, Chat, ChatMessage, CompanyJoinRequest } from '../types'

export const handlers = [
  // Получить все компании
  http.get('/api/companies', async () => {
    await delay(300)
    return HttpResponse.json(db.companies)
  }),

  // Создать компанию
  http.post('/api/companies', async ({ request }) => {
    const body = await request.json() as { name: string }
    const company: Company = {
      uuid: uuidv4(),
      name: body.name,
      owner_id: CURRENT_USER_ID,
      created_at: new Date().toISOString(),
    }
    db.companies.push(company)
    return HttpResponse.json(company, { status: 201 })
  }),

  // Получить документы компании
  http.get('/api/companies/:id/documents', async ({ params }) => {
    const docs = db.documents.filter(d => d.company_id === params.id)
    return HttpResponse.json(docs)
  }),

  // Загрузить документ (имитация)
  http.post('/api/documents', async () => {
    const newDoc: Document = {
      uuid: uuidv4(),
      company_id: 'c-1', // хардкод для теста
      user_id: CURRENT_USER_ID,
      s3_key: `mock/file-${Date.now()}`, s3_bucket: 'mock',
      original_name: 'Новый документ.mp4',
      mime_type: 'video/mp4',
      status: 'UPLOAD',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    db.documents.push(newDoc)

    // Имитация перехода статусов
    setTimeout(() => { newDoc.status = 'PREPARING' }, 2000)
    setTimeout(() => { newDoc.status = 'ACTIVE' }, 5000)

    return HttpResponse.json(newDoc, { status: 201 })
  }),

  // Получить чаты компании
  http.get('/api/chats', async () => {
    return HttpResponse.json(db.chats)
  }),

  // Получить сообщения чата
  http.get('/api/chats/:id/messages', async ({ params }) => {
    const msgs = db.chatMessages.filter(m => m.chat_id === params.id)
    return HttpResponse.json(msgs)
  }),

  // Отправить сообщение
  http.post('/api/chats/:id/messages', async ({ params, request }) => {
    const body = await request.json() as { content: string }
    const msg: ChatMessage = {
      uuid: uuidv4(), chat_id: String(params.id), role: 'USER',
      content: body.content, created_at: new Date().toISOString(),
    }
    db.chatMessages.push(msg)
    return HttpResponse.json(msg, { status: 201 })
  }),

  // Получить заявки
  http.get('/api/companies/:id/join-requests', async ({ params }) => {
    return HttpResponse.json(db.joinRequests.filter(r => r.company_id === params.id))
  }),


  // --- Profile ---
http.get('/api/profile', async () => {
  await delay(200)
  return HttpResponse.json({
    uuid: CURRENT_USER_ID,
    first_name: 'Алексей',
    last_name: 'Морозов',
    email: 'a.morozov@nordwind.ru',
    phone: '+7 916 240-18-52',
    role: 'Владелец',
    joined: 'Май 2024',
    timezone: 'Europe/Moscow',
  })
}),
]