import { http, HttpResponse, delay } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import { db, CURRENT_USER_ID } from './db'
import type { Company,
  ChatMessage,
  Document } from '../types'

export const handlers = [
  
  // --- Companies ---

  http.get('*/api/companies', async () => {
    await delay(300)
    return HttpResponse.json(db.companies)
  }),

  http.get('*/api/companies/:id', async ({ params }) => {
    const company = db.companies.find(c => c.uuid === params.id)

    if (!company) {
      return HttpResponse.json(
        { message: 'Компания не найдена' },
        { status: 404 }
      )
    }

    return HttpResponse.json(company)
  }),

  // Создание компании
  http.post('*/api/companies', async ({ request }) => {
    let body: {
      name?: string
      description?: string
      domain?: string
    }

    try {
      body = await request.json() as typeof body
    } catch {
      return HttpResponse.json(
        { message: 'Некорректный JSON' },
        { status: 400 }
      )
    }

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const description =
      typeof body.description === 'string' ? body.description.trim() : ''
    const domain =
      typeof body.domain === 'string' ? body.domain.trim() : ''

    if (!name) {
      return HttpResponse.json(
        { message: 'Название компании обязательно' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return HttpResponse.json(
        { message: 'Название компании не должно превышать 100 символов' },
        { status: 400 }
      )
    }

    if (description.length > 500) {
      return HttpResponse.json(
        { message: 'Описание не должно превышать 500 символов' },
        { status: 400 }
      )
    }

    if (domain.length > 253) {
      return HttpResponse.json(
        { message: 'Домен слишком длинный' },
        { status: 400 }
      )
    }

    const company: Company = {
      uuid: uuidv4(),
      name,
      description,
      domain,
      owner_id: CURRENT_USER_ID,
      created_at: new Date().toISOString(),
      role: 'Владелец',
      members: 1,
      documents: 0,
      chats: 0,
    }

    db.companies.push(company)

    return HttpResponse.json(company, { status: 201 })
  }),

  // Редактирование компании
  http.put('*/api/companies/:id', async ({ params, request }) => {
    const company = db.companies.find(c => c.uuid === params.id)

    if (!company) {
      return HttpResponse.json(
        { message: 'Компания не найдена' },
        { status: 404 }
      )
    }

    if (company.owner_id !== CURRENT_USER_ID) {
      return HttpResponse.json(
        { message: 'Недостаточно прав для редактирования компании' },
        { status: 403 }
      )
    }

    let body: {
      name?: string
      description?: string
      domain?: string
    }

    try {
      body = await request.json() as typeof body
    } catch {
      return HttpResponse.json(
        { message: 'Некорректный JSON' },
        { status: 400 }
      )
    }

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const description =
      typeof body.description === 'string' ? body.description.trim() : ''
    const domain =
      typeof body.domain === 'string' ? body.domain.trim() : ''

    if (!name) {
      return HttpResponse.json(
        { message: 'Название компании обязательно' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return HttpResponse.json(
        { message: 'Название компании не должно превышать 100 символов' },
        { status: 400 }
      )
    }

    if (description.length > 500) {
      return HttpResponse.json(
        { message: 'Описание не должно превышать 500 символов' },
        { status: 400 }
      )
    }

    if (domain.length > 253) {
      return HttpResponse.json(
        { message: 'Домен слишком длинный' },
        { status: 400 }
      )
    }

    company.name = name
    company.description = description
    company.domain = domain

    return HttpResponse.json(company)
  }),

  // Удаление компании
  http.delete('*/api/companies/:id', async ({ params }) => {
    const companyIndex = db.companies.findIndex(
      c => c.uuid === params.id
    )

    if (companyIndex === -1) {
      return HttpResponse.json(
        { message: 'Компания не найдена' },
        { status: 404 }
      )
    }

    const company = db.companies[companyIndex]

    if (company.owner_id !== CURRENT_USER_ID) {
      return HttpResponse.json(
        { message: 'Недостаточно прав для удаления компании' },
        { status: 403 }
      )
    }

    const companyId = company.uuid

    // Находим чаты компании
    const companyChatIds = db.chats
      .filter(chat => chat.company_id === companyId)
      .map(chat => chat.uuid)

    // Удаляем компанию
    db.companies.splice(companyIndex, 1)

    // Удаляем документы
    db.documents = db.documents.filter(
      doc => doc.company_id !== companyId
    )

    // Удаляем решения
    db.decisions = db.decisions.filter(
      decision => decision.company_id !== companyId
    )

    // Удаляем чаты
    db.chats = db.chats.filter(
      chat => chat.company_id !== companyId
    )

    // Удаляем сообщения удалённых чатов
    db.chatMessages = db.chatMessages.filter(
      message => !companyChatIds.includes(message.chat_id)
    )

    // Удаляем заявки на вступление
    db.joinRequests = db.joinRequests.filter(
      request => request.company_id !== companyId
    )

    // Удаляем dashboard
    delete db.dashboards[companyId as keyof typeof db.dashboards]

    return HttpResponse.json({
      success: true,
      message: 'Компания и связанные данные удалены',
    })
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

// --- Join Requests ---

// Получение заявок конкретной компании
http.get('*/api/companies/:id/join-requests', async ({ params }) => {
  const requests = db.joinRequests
    .filter(request => request.company_id === String(params.id))
    .map(req => {
      const company = db.companies.find(
        c => c.uuid === req.company_id
      )

      const user = db.users.find(
        u => u.uuid === req.user_id
      )

      return {
        ...req,
        company_name: company?.name || '—',
        user_name: user
          ? `${user.first_name} ${user.last_name}`
          : '—',
        user_email: req.user_id === 'u-4'
          ? 'elena@sever.team'
          : 'unknown@mail.ru',
      }
    })

  return HttpResponse.json(requests)
}),

// Создание заявки
http.post('*/api/companies/:id/join-requests', async ({ params, request }) => {
  const text = await request.text()

  let body: { message?: string } = {}

  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      return HttpResponse.json(
        { message: 'Некорректные данные запроса' },
        { status: 400 }
      )
    }
  }

  const companyId = String(params.id)

  const company = db.companies.find(
    item => item.uuid === companyId
  )

  if (!company) {
    return HttpResponse.json(
      { message: 'Компания не найдена' },
      { status: 404 }
    )
  }

  const now = new Date()

  const newRequest = {
    uuid: uuidv4(),
    company_id: companyId,
    user_id: CURRENT_USER_ID,
    status: 'SENDED',
    created_at: now.toISOString(),
    dateText:
      now.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) +
      ', ' +
      now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    message: body.message?.trim() || '',
  }

  db.joinRequests.push(newRequest as any)

  return HttpResponse.json(newRequest, { status: 201 })
}),

// Отмена заявки
http.delete('*/api/join-requests/:id', async ({ params }) => {
  const requestIndex = db.joinRequests.findIndex(
    request => request.uuid === params.id
  )

  if (requestIndex === -1) {
    return HttpResponse.json(
      { message: 'Заявка не найдена' },
      { status: 404 }
    )
  }

  const joinRequest = db.joinRequests[requestIndex]

  if (joinRequest.user_id !== CURRENT_USER_ID) {
    return HttpResponse.json(
      { message: 'Нет доступа к отмене этой заявки' },
      { status: 403 }
    )
  }

  if (joinRequest.status !== 'SENDED') {
    return HttpResponse.json(
      { message: 'Можно отменить только ожидающую заявку' },
      { status: 409 }
    )
  }

  db.joinRequests.splice(requestIndex, 1)

  return HttpResponse.json({ success: true })
}),

  http.post('*/api/join-requests/:id/approve', async ({ params }) => {
  const req = db.joinRequests.find(r => r.uuid === params.id)
  if (req) req.status = 'ACCEPT'
  return HttpResponse.json({ success: true })
}),

http.post('*/api/join-requests/:id/reject', async ({ params }) => {
  const req = db.joinRequests.find(r => r.uuid === params.id)

  if (!req) {
    return HttpResponse.json(
      { success: false, message: 'Заявка не найдена' },
      { status: 404 },
    )
  }

  req.status = 'REJECT'

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

// Получение участников компании
http.get('*/api/companies/:id/members', async ({ params }) => {
  const companyId = String(params.id)

  const members = db.companyMembers.filter(
    (member) => member.company_id === companyId,
  )

  return HttpResponse.json(members)
}),

// Изменение роли участника
http.patch(
  '*/api/companies/:companyId/members/:memberId/role',
  async ({ params, request }) => {
    const companyId = String(params.companyId)
    const memberId = String(params.memberId)

    const company = db.companies.find(
      (item) => item.uuid === companyId,
    )

    if (!company) {
      return HttpResponse.json(
        { message: 'Компания не найдена' },
        { status: 404 },
      )
    }

    const member = db.companyMembers.find(
      (item) =>
        item.company_id === companyId &&
        item.uuid === memberId,
    )

    if (!member) {
      return HttpResponse.json(
        { message: 'Участник не найден' },
        { status: 404 },
      )
    }

    if (member.uuid === company.owner_id) {
      return HttpResponse.json(
        { message: 'Нельзя изменить роль владельца компании' },
        { status: 403 },
      )
    }

    let body: { role?: string }

    try {
      body = await request.json() as { role?: string }
    } catch {
      return HttpResponse.json(
        { message: 'Некорректный JSON' },
        { status: 400 },
      )
    }

    const allowedRoles = [
      'Администратор',
      'Участник',
      'Наблюдатель',
    ]

    if (!body.role || !allowedRoles.includes(body.role)) {
      return HttpResponse.json(
        { message: 'Недопустимая роль' },
        { status: 400 },
      )
    }

    member.role = body.role as typeof member.role

    return HttpResponse.json({
      success: true,
      member,
    })
  },
),

// Удаление участника
http.delete(
  '*/api/companies/:companyId/members/:memberId',
  async ({ params }) => {
    const companyId = String(params.companyId)
    const memberId = String(params.memberId)

    const company = db.companies.find(
      (item) => item.uuid === companyId,
    )

    if (!company) {
      return HttpResponse.json(
        { message: 'Компания не найдена' },
        { status: 404 },
      )
    }

    const memberIndex = db.companyMembers.findIndex(
      (item) =>
        item.company_id === companyId &&
        item.uuid === memberId,
    )

    if (memberIndex === -1) {
      return HttpResponse.json(
        { message: 'Участник не найден' },
        { status: 404 },
      )
    }

    const member = db.companyMembers[memberIndex]

    if (member.uuid === company.owner_id) {
      return HttpResponse.json(
        { message: 'Нельзя удалить владельца компании' },
        { status: 403 },
      )
    }

    db.companyMembers.splice(memberIndex, 1)

    company.members = db.companyMembers.filter(
  (item) => item.company_id === companyId,
).length

    return HttpResponse.json({
      success: true,
    })
  },
),

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

  // Изменение пароля
  http.put('*/api/profile/security/password', async ({ request }) => {
    let body: { password?: string }

    try {
      body = await request.json() as { password?: string }
    } catch {
      return HttpResponse.json(
        { message: 'Некорректные данные' },
        { status: 400 },
      )
    }

    if (!body.password || body.password.trim().length < 8) {
      return HttpResponse.json(
        { message: 'Пароль должен содержать не менее 8 символов' },
        { status: 400 },
      )
    }

    db.profileSecurity.passwordUpdatedAt =
      new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

    return HttpResponse.json({ success: true })
  }),

  // Завершение остальных сессий
  http.post(
    '*/api/profile/security/sessions/terminate-others',
    async () => {
      db.profileSecurity.sessions =
        db.profileSecurity.sessions.filter(
          session => session.isCurrent,
        )

      return HttpResponse.json({
        success: true,
        sessions: db.profileSecurity.sessions,
      })
    },
  ),

  // Удаление аккаунта
  http.delete('*/api/profile', async () => {
    const ownedCompany = db.companies.find(
      company => company.owner_id === CURRENT_USER_ID,
    )

    if (ownedCompany) {
      return HttpResponse.json(
        {
          message: `Перед удалением аккаунта необходимо передать владение компанией «${ownedCompany.name}».`,
        },
        { status: 409 },
      )
    }

    db.users = db.users.filter(
      user => user.uuid !== CURRENT_USER_ID,
    )

    db.companyMembers = db.companyMembers.filter(
      member => member.uuid !== CURRENT_USER_ID,
    )

    return HttpResponse.json({ success: true })
  }),

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