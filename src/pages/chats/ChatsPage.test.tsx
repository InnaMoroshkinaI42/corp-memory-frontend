
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ChatsPage } from './ChatsPage'

const socket = vi.hoisted(() => ({
  handlers: {} as any,
  emit: vi.fn(),
}))

vi.mock('@/shared/api/websocket/useChatSocket', () => ({
  useChatSocket: (_chatId: string, handlers: any) => {
    socket.handlers = handlers
  },
  emitChatMessage: socket.emit,
}))

vi.mock('./ui/ChatSidebar', () => ({
  ChatSidebar: ({ chats, activeChatId, companyId }: any) => (
    <div>
      <span>Список чатов</span>
      <span>{companyId}</span>
      <span>{activeChatId}</span>
      {chats.map((chat: any) => (
        <span key={chat.uuid}>{chat.title}</span>
      ))}
    </div>
  ),
}))

vi.mock('./ui/ChatWindow', () => ({
  ChatWindow: ({ chat, companyName, documentCount, onSend }: any) => (
    <div>
      <span>{companyName}</span>
      <span>{documentCount}</span>
      {chat?.messages?.map((message: any) => (
        <span key={message.uuid}>{message.content}</span>
      ))}
      <button onClick={() => onSend('Новое сообщение')}>
        Отправить тестовое сообщение
      </button>
    </div>
  ),
}))

const company = {
  uuid: 'company-1',
  name: 'Компания Альфа',
  documents: 12,
}

const chats = [
  {
    uuid: 'chat-1',
    title: 'Первый диалог',
    created_at: '2026-11-15T10:00:00Z',
  },
]

const messages = [
  {
    uuid: 'message-1',
    role: 'USER',
    content: 'Привет!',
  },
]

let queryClient: QueryClient
let fetchMock: ReturnType<typeof vi.fn>

function renderPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/app/chats/company-1/chat-1']}>
        <Routes>
          <Route
            path="/app/chats/:id/:chatId"
            element={<ChatsPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ChatsPage', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    socket.handlers = {}
    socket.emit.mockClear()

    fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url === '/api/companies/company-1') {
        return Promise.resolve({ json: async () => company })
      }

      if (url === '/api/chats?companyId=company-1') {
        return Promise.resolve({ json: async () => chats })
      }

      if (url === '/api/chats/chat-1/messages') {
        return Promise.resolve({ json: async () => messages })
      }

      return Promise.resolve({ json: async () => ({}) })
    })

    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    queryClient.clear()
    vi.unstubAllGlobals()
  })

  it('отображает загрузку до получения данных компании и чатов', () => {
    fetchMock.mockImplementation(
      () => new Promise(() => {}),
    )

    renderPage()

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  it('загружает компанию и список чатов по ID из URL', async () => {
    renderPage()

    await screen.findByText('Компания Альфа')

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/companies/company-1',
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/chats?companyId=company-1',
    )
  })

  it('передаёт список чатов и активный чат в ChatSidebar', async () => {
    renderPage()

    expect(await screen.findByText('Первый диалог'))
      .toBeInTheDocument()

    expect(screen.getByText('company-1')).toBeInTheDocument()
    expect(screen.getByText('chat-1')).toBeInTheDocument()
  })

  it('передаёт название компании, количество документов и сообщения в ChatWindow', async () => {
    renderPage()

    expect(await screen.findByText('Компания Альфа'))
      .toBeInTheDocument()

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Привет!')).toBeInTheDocument()
  })

  it('отправляет сообщение пользователя и вызывает emitChatMessage', async () => {
    renderPage()

    fireEvent.click(
      await screen.findByText('Отправить тестовое сообщение'),
    )

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/chats/chat-1/messages',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            content: 'Новое сообщение',
          }),
        }),
      )
    })

    expect(socket.emit).toHaveBeenCalledWith(
      'chat-1',
      'Новое сообщение',
    )
  })

  it('отображает потоковый ответ WebSocket', async () => {
    renderPage()

    await screen.findByText('Компания Альфа')

    act(() => {
      socket.handlers.onChunk('Промежуточный ответ')
    })

    expect(
      await screen.findByText('Промежуточный ответ'),
    ).toBeInTheDocument()
  })

  it('сохраняет финальный ответ WebSocket', async () => {
    renderPage()

    await screen.findByText('Компания Альфа')

    await act(async () => {
      await socket.handlers.onDone('Финальный ответ')
    })

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/chats/chat-1/ai-messages',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            content: 'Финальный ответ',
          }),
        }),
      )
    })
  })
})
