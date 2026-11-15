
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  cleanup,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { ChatsPage } from './ChatsPage'
import { db } from '@/shared/api/mocks/db'

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

const CHAT_ID = 'ch-1'
const USER_MESSAGE = 'Интеграционный вопрос пользователя'
const AI_MESSAGE = 'Интеграционный ответ искусственного интеллекта'

const initialMessages = [...db.chatMessages]

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[`/app/chats/c-1/${CHAT_ID}`]}
      >
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

afterEach(() => {
  cleanup()

  db.chatMessages = [...initialMessages]

  socket.handlers = {}
  socket.emit.mockClear()
})

describe('ChatsPage — интеграция с API', () => {
  it('загружает историю чата и сохраняет сообщение пользователя через API', async () => {
    const user = userEvent.setup()

    renderPage()

    // Дожидаемся загрузки истории чата.
    expect(
      await screen.findByText(
        'Что решили по запуску Atlas и кто за что отвечает?',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(/На встрече 5 октября команда согласовала сроки/),
    ).toBeInTheDocument()

    // Отправляем сообщение.
    await user.type(
      screen.getByPlaceholderText(
        'Задайте вопрос по материалам компании...',
      ),
      USER_MESSAGE,
    )

    await user.click(
      screen.getByRole('button', { name: /Отправить/i }),
    )

    // Проверяем, что сообщение попало в mock-базу.
    await waitFor(() => {
      const message = db.chatMessages.find(
        item =>
          item.chat_id === CHAT_ID &&
          item.content === USER_MESSAGE,
      )

      expect(message).toBeDefined()

      expect(message).toMatchObject({
        chat_id: CHAT_ID,
        role: 'USER',
        content: USER_MESSAGE,
      })
    })

    // Проверяем вызов механизма WebSocket.
    expect(socket.emit).toHaveBeenCalledWith(
      CHAT_ID,
      USER_MESSAGE,
    )
  })

  it('сохраняет финальный ответ ИИ в mock-базе после завершения WebSocket', async () => {
    renderPage()

    // Ждём, пока страница загрузит компанию и историю чата.
    await screen.findByText(
      'Что решили по запуску Atlas и кто за что отвечает?',
    )

    // Имитируем завершение генерации ответа.
    await act(async () => {
      await socket.handlers.onDone(AI_MESSAGE)
    })

    // Проверяем сохранение ответа через API.
    await waitFor(() => {
      const message = db.chatMessages.find(
        item =>
          item.chat_id === CHAT_ID &&
          item.content === AI_MESSAGE,
      )

      expect(message).toBeDefined()

      expect(message).toMatchObject({
        chat_id: CHAT_ID,
        role: 'AI',
        content: AI_MESSAGE,
      })
    })
  })
})
