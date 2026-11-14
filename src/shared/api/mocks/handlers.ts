import { http, HttpResponse, delay } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import { db, CURRENT_USER_ID } from './db'
import type { Company, Document, ChatMessage } from '../types'

export const handlers = [
  
  // --- Companies ---
  http.get('*/api/companies', async () => {
    await delay(300)
    return HttpResponse.json(db.companies)
  }),

  http.get('*/api/companies/:id', async ({ params }) => {
    const company = db.companies.find(c => c.uuid === params.id)
    if (!company) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(company)
  }),

  http.post('*/api/companies', async ({ request }) => {
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
  http.get('*/api/companies/:id/documents', async ({ params }) => {
    const docs = db.documents.filter(d => d.company_id === params.id)
    return HttpResponse.json(docs)
  }),

    
  http.post('*/api/documents', async ({ request }) => {
    const formData = await request.formData()

    const companyId = String(formData.get('company_id') || '')
    const title = String(formData.get('title') || '').trim()
    const language = String(formData.get('language') || 'Русский')
    const mode = String(formData.get('mode') || '')

    const company = db.companies.find(
      (item) => item.uuid === companyId,
    )

    if (!company) {
      return HttpResponse.json(
        { message: 'Компания не найдена' },
        { status: 404 },
      )
    }

    if (!title) {
      return HttpResponse.json(
        { message: 'Укажите название документа' },
        { status: 400 },
      )
    }

    let originalName = title
    let mimeType = 'text/plain'
    let content = ''

    if (mode === 'files') {
      const files = formData.getAll('files').filter(
        (item): item is File => typeof item !== 'string',
      )

      if (files.length === 0) {
        return HttpResponse.json(
          { message: 'Не выбраны файлы' },
          { status: 400 },
        )
      }

      const file = files[0]
      originalName = file.name || title
      mimeType = file.type || 'application/octet-stream'
    } else if (mode === 'text') {
      content = String(formData.get('content') || '').trim()

      if (!content) {
        return HttpResponse.json(
          { message: 'Текст документа не может быть пустым' },
          { status: 400 },
        )
      }
    } else {
      return HttpResponse.json(
        { message: 'Неизвестный тип загрузки' },
        { status: 400 },
      )
    }

    const now = new Date().toISOString()

    const newDoc: Document & {
      title: string
      language: string
      content?: string
    } = {
      uuid: uuidv4(),
      company_id: companyId,
      user_id: CURRENT_USER_ID,
      s3_key: `mock/${uuidv4()}`,
      s3_bucket: 'mock',
      original_name: originalName,
      mime_type: mimeType,
      status: 'UPLOAD',
      created_at: now,
      updated_at: now,
      title,
      language,
      ...(mode === 'text' ? { content } : {}),
    }

    db.documents.push(newDoc)

    return HttpResponse.json(newDoc, { status: 201 })
  }),


  // --- Chats ---
  http.get('*/api/chats/:id/messages', async ({ params }) =>
    HttpResponse.json(db.chatMessages.filter(m => m.chat_id === params.id))),
  http.post('*/api/chats/:id/messages', async ({ params, request }) => {
    const body = await request.json() as { content: string }
    const msg: ChatMessage = {
      uuid: uuidv4(), chat_id: String(params.id), role: 'USER',
      content: body.content, created_at: new Date().toISOString(),
    }
    db.chatMessages.push(msg)
    return HttpResponse.json(msg, { status: 201 })
  }),

  // --- Join Requests (обогащённые) ---
  http.get('*/api/companies/:id/join-requests', async ({ params }) => {
    const reqs = db.joinRequests.filter(r => r.company_id === params.id)
    return HttpResponse.json(reqs.map(r => {
      const user = db.users.find(u => u.uuid === r.user_id)
      return {
        ...r,
        user_name: user ? `${user.first_name} ${user.last_name}` : 'Пользователь',
        user_email: r.user_id === 'u-4' ? 'elena@sever.team' : 'user@sever.team',
        initials: user ? `${user.first_name[0]}${user.last_name[0]}` : '?',
      }
    }))
  }),

  http.post('*/api/companies/:id/join-requests', async ({ params }) => {
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

  http.post('*/api/join-requests/:id/approve', async ({ params }) => {
    const req = db.joinRequests.find(r => r.uuid === params.id)
    if (req) req.status = 'ACCEPT'
    return HttpResponse.json({ success: true })
  }),

  http.get('*/api/join-requests', async () => {
    return HttpResponse.json(db.joinRequests.map(req => {
      const company = db.companies.find(c => c.uuid === req.company_id)
      const user = db.users.find(u => u.uuid === req.user_id)
      return {
        ...req,
        company_name: company?.name || '—',
        user_name: user ? `${user.first_name} ${user.last_name}` : '—',
        user_email: req.user_id === 'u-4' ? 'elena@sever.team' : 'unknown@mail.ru',
      }
    }))
  }),

  // --- Members ---
  http.get('*/api/companies/:id/members', async () => {
    return HttpResponse.json([
      { uuid: 'u-1', first_name: 'Алексей', last_name: 'Морозов', email: 'alexey@sever.team', role: 'Владелец' },
      { uuid: 'u-2', first_name: 'Мария', last_name: 'Крылова', email: 'maria@sever.team', role: 'Администратор' },
      { uuid: 'u-3', first_name: 'Илья', last_name: 'Волков', email: 'ilya@sever.team', role: 'Участник' },
      { uuid: 'u-4', first_name: 'Анна', last_name: 'Лебедева', email: 'anna@sever.team', role: 'Участник' },
      { uuid: 'u-5', first_name: 'Дмитрий', last_name: 'Орлов', email: 'dmitry@sever.team', role: 'Участник' },
      { uuid: 'u-6', first_name: 'Ольга', last_name: 'Миронова', email: 'olga@sever.team', role: 'Наблюдатель' },
    ])
  }),

  // --- Users / Profile / Security ---
  http.get('*/api/users', async () => HttpResponse.json(db.users)),
  
  http.get('*/api/profile', async () => {
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

  http.get('*/api/profile/security', async () => HttpResponse.json(db.profileSecurity)),

  // --- Dashboard ---
  http.get('*/api/company/:id/dashboard', async ({ params }) => {
    const dashboard = db.dashboards[params.id as keyof typeof db.dashboards]
    if (!dashboard) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(dashboard)
  }),


  http.get('*/api/chats', async ({ request }) => {
  const url = new URL(request.url)
  const companyId = url.searchParams.get('companyId')
  const filtered = companyId ? db.chats.filter(c => c.company_id === companyId) : db.chats
  return HttpResponse.json(filtered)
}),

http.post('*/api/chats', async ({ request }) => {
  const body = await request.json() as { company_id: string; title: string }
  const newChat = {
    uuid: uuidv4(),
    company_id: body.company_id,
    user_id: CURRENT_USER_ID,
    title: body.title || 'Новый диалог',
    created_at: new Date().toISOString(),
  }
  db.chats.push(newChat)
  return HttpResponse.json(newChat, { status: 201 })
}),

http.post('*/api/chats/:id/ai-messages', async ({ params, request }) => {
  const body = await request.json() as { content: string }
  const msg: ChatMessage = {
    uuid: uuidv4(),
    chat_id: String(params.id),
    role: 'AI',
    content: body.content,
    created_at: new Date().toISOString(),
    sources: [
      { docId: 'd-1', label: 'Планирование запуска Atlas', quote: '«Фиксируем запуск Atlas на 20 октября»', timestamp: '12:40' },
    ],
  }
  db.chatMessages.push(msg)
  return HttpResponse.json(msg, { status: 201 })
}),

http.get('*/api/companies/:id/decisions', async ({ params }) => {
  const decisions = db.decisions.filter(d => d.company_id === params.id)
  return HttpResponse.json(decisions)
}),

http.get('*/api/documents/:id', async ({ params }) => {
  const doc = db.documents.find(d => d.uuid === params.id)
  if (!doc) return new HttpResponse(null, { status: 404 })
  return HttpResponse.json(doc)
}),
]