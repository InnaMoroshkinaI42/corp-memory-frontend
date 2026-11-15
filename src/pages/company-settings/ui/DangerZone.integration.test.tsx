
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  cleanup,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { DangerZone } from './DangerZone'
import { db } from '@/shared/api/mocks/db'

const TEST_COMPANY_ID = 'integration-delete-company'
const TEST_CHAT_ID = 'integration-delete-chat'

const originalCompanies = [...db.companies]
const originalDocuments = [...db.documents]
const originalDecisions = [...db.decisions]
const originalChats = [...db.chats]
const originalMessages = [...db.chatMessages]
const originalJoinRequests = [...db.joinRequests]
const originalDashboard = { ...db.dashboards }

function LocationProbe() {
  const location = useLocation()

  return (
    <div data-testid="current-location">
      {location.pathname}
    </div>
  )
}

function renderComponent() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/company-settings']}>
        <DangerZone companyId={TEST_COMPANY_ID} />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function prepareTestData() {
  // Создаём отдельную тестовую компанию.
  db.companies.push({
    uuid: TEST_COMPANY_ID,
    name: 'Компания для интеграционного удаления',
    owner_id: 'u-1',
    created_at: new Date().toISOString(),
    role: 'Владелец',
    members: 1,
    documents: 1,
    chats: 1,
  } as any)

  // Добавляем документ компании.
  db.documents.push({
    uuid: 'integration-document',
    company_id: TEST_COMPANY_ID,
    user_id: 'u-1',
    original_name: 'integration-delete.pdf',
    mime_type: 'application/pdf',
    status: 'UPLOAD',
    s3_key: 'mock/integration-delete.pdf',
    s3_bucket: 'mock',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as any)

  // Добавляем решение компании.
  db.decisions.push({
    uuid: 'integration-decision',
    company_id: TEST_COMPANY_ID,
    text: 'Тестовое решение',
    source_doc_id: 'integration-document',
    source_doc_name: 'integration-delete.pdf',
    created_at: new Date().toISOString(),
  } as any)

  // Добавляем чат компании.
  db.chats.push({
    uuid: TEST_CHAT_ID,
    company_id: TEST_COMPANY_ID,
    user_id: 'u-1',
    title: 'Тестовый чат',
    created_at: new Date().toISOString(),
  } as any)

  // Добавляем сообщение в тестовый чат.
  db.chatMessages.push({
    uuid: 'integration-message',
    chat_id: TEST_CHAT_ID,
    role: 'USER',
    content: 'Тестовое сообщение',
    created_at: new Date().toISOString(),
  } as any)

  // Добавляем заявку на вступление.
  db.joinRequests.push({
    uuid: 'integration-request',
    company_id: TEST_COMPANY_ID,
    user_id: 'u-2',
    status: 'SENDED',
    created_at: new Date().toISOString(),
    dateText: '16 ноября',
    message: 'Тестовая заявка',
  } as any)

  // Добавляем dashboard тестовой компании.
  ;(db.dashboards as any)[TEST_COMPANY_ID] = {
    stats: {
      documents: 1,
      chats: 1,
      decisions: 1,
    },
    recentDocuments: [],
    recentDecisions: [],
    teamActivity: [],
  }
}

afterEach(() => {
  cleanup()

  // Полностью восстанавливаем исходную mock-базу.
  db.companies = [...originalCompanies]
  db.documents = [...originalDocuments]
  db.decisions = [...originalDecisions]
  db.chats = [...originalChats]
  db.chatMessages = [...originalMessages]
  db.joinRequests = [...originalJoinRequests]

  Object.keys(db.dashboards).forEach(key => {
    delete (db.dashboards as any)[key]
  })

  Object.assign(db.dashboards, originalDashboard)

  vi.restoreAllMocks()
})

describe('DangerZone — интеграция с API', () => {
  it('удаляет компанию и все связанные с ней данные через API', async () => {
    const user = userEvent.setup()

    prepareTestData()

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: 'Удалить компанию',
      }),
    )

    // Проверяем удаление компании.
    await waitFor(() => {
      expect(
        db.companies.some(
          company => company.uuid === TEST_COMPANY_ID,
        ),
      ).toBe(false)
    })

    // Проверяем удаление документов.
    expect(
      db.documents.some(
        document => document.company_id === TEST_COMPANY_ID,
      ),
    ).toBe(false)

    // Проверяем удаление решений.
    expect(
      db.decisions.some(
        decision => decision.company_id === TEST_COMPANY_ID,
      ),
    ).toBe(false)

    // Проверяем удаление чатов.
    expect(
      db.chats.some(
        chat => chat.company_id === TEST_COMPANY_ID,
      ),
    ).toBe(false)

    // Проверяем удаление сообщений чатов.
    expect(
      db.chatMessages.some(
        message => message.chat_id === TEST_CHAT_ID,
      ),
    ).toBe(false)

    // Проверяем удаление заявок.
    expect(
      db.joinRequests.some(
        request => request.company_id === TEST_COMPANY_ID,
      ),
    ).toBe(false)

    // Проверяем удаление dashboard.
    expect(
      (db.dashboards as any)[TEST_COMPANY_ID],
    ).toBeUndefined()

    // Проверяем перенаправление пользователя.
    await waitFor(() => {
      expect(
        screen.getByTestId('current-location'),
      ).toHaveTextContent('/companies')
    })
  })
})
