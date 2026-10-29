import { http, HttpResponse, delay } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import { db, CURRENT_USER_ID } from './db'
import type { Company, Document, ChatMessage } from '../types'

export const handlers = [
  // --- Companies ---
  http.get('/api/companies', async () => {
    await delay(300)
    return HttpResponse.json(db.companies)
  }),

  http.get('/api/companies/:id', async ({ params }) => {
    const company = db.companies.find(c => c.uuid === params.id)
    if (!company) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(company)
  }),

  http.post('/api/companies', async ({ request }) => {
    const body = await request.json() as { name: string }
    const company: Company = {
      uuid: uuidv4(),
      name: body.name,
      owner_id: CURRENT_USER_ID,
      created_at: new Date().toISOString(),
    }
    db.companies.push(company as any)
    return HttpResponse.json(company, { status: 201 })
  }),

  // --- Documents ---
  http.get('/api/companies/:id/documents', async ({ params }) => {
    const docs = db.documents.filter(d => d.company_id === params.id)
    return HttpResponse.json(docs)
  }),

  http.post('/api/documents', async () => {
    const newDoc: Document = {
      uuid: uuidv4(),
      company_id: 'c-1',
      user_id: CURRENT_USER_ID,
      s3_key: `mock/file-${Date.now()}`, s3_bucket: 'mock',
      original_name: 'Новый документ.mp4',
      mime_type: 'video/mp4',
      status: 'UPLOAD',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    db.documents.push(newDoc)
    setTimeout(() => { newDoc.status = 'PREPARING' }, 2000)
    setTimeout(() => { newDoc.status = 'ACTIVE' }, 5000)
    return HttpResponse.json(newDoc, { status: 201 })
  }),

  // --- Chats ---
  http.get('/api/chats', async () => {
    return HttpResponse.json(db.chats)
  }),

  http.get('/api/chats/:id/messages', async ({ params }) => {
    const msgs = db.chatMessages.filter(m => m.chat_id === params.id)
    return HttpResponse.json(msgs)
  }),

  http.post('/api/chats/:id/messages', async ({ params, request }) => {
    const body = await request.json() as { content: string }
    const msg: ChatMessage = {
      uuid: uuidv4(), chat_id: String(params.id), role: 'USER',
      content: body.content, created_at: new Date().toISOString(),
    }
    db.chatMessages.push(msg)
    return HttpResponse.json(msg, { status: 201 })
  }),

  // --- Join Requests ---
  // Заявки для конкретной компании
  http.get('/api/companies/:id/join-requests', async ({ params }) => {
    return HttpResponse.json(db.joinRequests.filter(r => r.company_id === params.id))
  }),

  // Все заявки с обогащёнными данными (имя пользователя, название компании)
  http.get('/api/join-requests', async () => {
    const requests = db.joinRequests.map(req => {
      const company = db.companies.find(c => c.uuid === req.company_id)
      const user = db.users.find(u => u.uuid === req.user_id)
      return {
        ...req,
        company_name: company?.name || '—',
        user_name: user ? `${user.first_name} ${user.last_name}` : '—',
        user_email: req.user_id === 'u-4' ? 'elena@sever.team' : 'unknown@mail.ru',
      }
    })
    return HttpResponse.json(requests)
  }),

  // --- Users ---
  http.get('/api/users', async () => {
    return HttpResponse.json(db.users)
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

  // --- Dashboard ---
  http.get('/api/companies/:id', async ({ params }) => {
  const company = db.companies.find(c => c.uuid === params.id)
  if (!company) return new HttpResponse(null, { status: 404 })
  return HttpResponse.json(company)
}),

http.get('/api/company/:id/dashboard', async ({ params }) => {
  const dashboard = db.dashboards[params.id as keyof typeof db.dashboards]
  if (!dashboard) return new HttpResponse(null, { status: 404 })
  return HttpResponse.json(dashboard)
}),

http.get('/api/profile/security', async () => {
  return HttpResponse.json(db.profileSecurity)
}),


http.post('/api/companies/:id/join-requests', async ({ params, request }) => {
  const body = await request.json() as { companyId: string }
  const newRequest = {
    uuid: uuidv4(),
    company_id: String(params.id),
    user_id: CURRENT_USER_ID,
    status: 'SENDED',
    created_at: new Date().toISOString(),
    dateText: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) + ', ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  db.joinRequests.push(newRequest as any)
  return HttpResponse.json(newRequest, { status: 201 })
}),

]