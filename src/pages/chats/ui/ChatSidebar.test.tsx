
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { ChatSidebar } from './ChatSidebar'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  }
})

const chats = [
  {
    uuid: 'chat-1',
    title: 'Первый диалог',
    created_at: '2026-11-15T10:00:00Z',
  },
  {
    uuid: 'chat-2',
    title: 'Второй диалог',
    created_at: '2026-11-15T11:30:00Z',
  },
]

let queryClient: QueryClient
let fetchMock: ReturnType<typeof vi.fn>

function renderSidebar(activeChatId = 'chat-1') {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          companyId="company-1"
        />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ChatSidebar', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    mocks.navigate.mockClear()

    fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        uuid: 'chat-3',
        title: 'Новый диалог',
      }),
    })

    vi.stubGlobal('fetch', fetchMock)
  })

  it('отображает список чатов', () => {
    renderSidebar()

    expect(screen.getByText('Первый диалог')).toBeInTheDocument()
    expect(screen.getByText('Второй диалог')).toBeInTheDocument()
  })

  it('выделяет активный чат', () => {
    renderSidebar('chat-1')

    const activeLink = screen.getByRole('link', {
      name: /Первый диалог/,
    })

    const inactiveLink = screen.getByRole('link', {
      name: /Второй диалог/,
    })

    expect(activeLink.firstChild).toHaveClass('bg-[var(--brand-light)]')
    expect(inactiveLink.firstChild).toHaveClass('hover:bg-[var(--surface-2)]')
  })

  it('формирует правильные ссылки на чаты', () => {
    renderSidebar()

    expect(
      screen.getByRole('link', { name: /Первый диалог/ }),
    ).toHaveAttribute('href', '/app/chats/company-1/chat-1')

    expect(
      screen.getByRole('link', { name: /Второй диалог/ }),
    ).toHaveAttribute('href', '/app/chats/company-1/chat-2')
  })

  it('отображает поле поиска', () => {
    renderSidebar()

    expect(
      screen.getByPlaceholderText('Найти чат...'),
    ).toBeInTheDocument()
  })

  it('отображает кнопку создания нового чата', () => {
    renderSidebar()

    expect(
      screen.getByRole('button', { name: /Новый чат/ }),
    ).toBeInTheDocument()
  })

  it('создаёт новый чат с правильными данными', async () => {
    renderSidebar()

    fireEvent.click(
      screen.getByRole('button', { name: /Новый чат/ }),
    )

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/chats',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: 'company-1',
            title: 'Новый диалог',
          }),
        }),
      )
    })
  })

  it('переходит в созданный чат после успешного запроса', async () => {
    renderSidebar()

    fireEvent.click(
      screen.getByRole('button', { name: /Новый чат/ }),
    )

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith(
        '/app/chats/company-1/chat-3',
      )
    })
  })
})
