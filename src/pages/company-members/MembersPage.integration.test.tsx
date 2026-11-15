
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { MembersPage } from './MembersPage'
import { db } from '@/shared/api/mocks/db'

const requestId = 'jr-2'

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/companies/c-2/members']}>
        <Routes>
          <Route
            path="/companies/:id/members"
            element={<MembersPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

afterEach(() => {
  cleanup()

  // Восстанавливаем исходный статус заявки
  const request = db.joinRequests.find(
    item => item.uuid === requestId
  )

  if (request) {
    request.status = 'SENDED'
  }
})

describe('MembersPage — интеграция заявок', () => {
  it('одобряет заявку и убирает её из списка ожидающих', async () => {
    const user = userEvent.setup()

    renderPage()

    // Загружаем заявку
    await screen.findByText(/Запросы на вступление/)

    expect(db.joinRequests.find(
      item => item.uuid === requestId
    )?.status).toBe('SENDED')

    // Одобряем
    await user.click(
      screen.getByRole('button', { name: /одобрить/i })
    )

    // Проверяем изменение в базе
    await waitFor(() => {
      expect(
        db.joinRequests.find(item => item.uuid === requestId)?.status
      ).toBe('ACCEPT')
    })

    // Проверяем обновление интерфейса
    await waitFor(() => {
      expect(
        screen.queryByText(/Запросы на вступление/)
      ).not.toBeInTheDocument()
    })
  })

  it('отклоняет заявку и убирает её из списка ожидающих', async () => {
    const user = userEvent.setup()

    renderPage()

    // Загружаем заявку
    await screen.findByText(/Запросы на вступление/)

    // Отклоняем
    await user.click(
      screen.getByRole('button', { name: /отклонить/i })
    )

    // Проверяем изменение в базе
    await waitFor(() => {
      expect(
        db.joinRequests.find(item => item.uuid === requestId)?.status
      ).toBe('REJECT')
    })

    // Проверяем обновление интерфейса
    await waitFor(() => {
      expect(
        screen.queryByText(/Запросы на вступление/)
      ).not.toBeInTheDocument()
    })
  })
})
