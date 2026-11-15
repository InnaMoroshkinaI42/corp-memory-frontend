
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import { JoinCompanyPage } from './JoinCompanyPage'
import { db } from '@/shared/api/mocks/db'

const testMessage = 'Интеграционная заявка на вступление'

function LocationProbe() {
  const location = useLocation()

  return (
    <div data-testid="current-location">
      {location.pathname + location.search}
    </div>
  )
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/companies/join']}>
        <Routes>
          <Route
            path="/companies/join"
            element={<JoinCompanyPage />}
          />
        </Routes>
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

afterEach(() => {
  cleanup()

  // Удаляем только заявку, созданную этим тестом
  for (let i = db.joinRequests.length - 1; i >= 0; i--) {
    if (db.joinRequests[i].message === testMessage) {
      db.joinRequests.splice(i, 1)
    }
  }
})

describe('JoinCompanyPage — интеграция', () => {
  it('отправляет заявку на вступление и перенаправляет на страницу ожидания', async () => {
    const user = userEvent.setup()

    renderPage()

    // Дожидаемся загрузки профиля
    await screen.findByText('Вступить в компанию')

    // Вводим ID существующей компании
    const companyIdInput = document.querySelector(
      '#companyId'
    ) as HTMLInputElement

    await user.type(companyIdInput, 'c-1')

    // Дожидаемся загрузки компании
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /отправить запрос/i })
      ).toBeEnabled()
    })

    // Вводим сообщение
    const messageInput = document.querySelector(
      '#message'
    ) as HTMLInputElement

    await user.type(messageInput, testMessage)

    // Отправляем заявку
    await user.click(
      screen.getByRole('button', { name: /отправить запрос/i })
    )

    // Проверяем, что заявка действительно появилась в базе
    await waitFor(() => {
      const createdRequest = db.joinRequests.find(
        request => request.message === testMessage
      )

      expect(createdRequest).toBeDefined()
      expect(createdRequest?.company_id).toBe('c-1')
      expect(createdRequest?.user_id).toBe('u-1')
      expect(createdRequest?.status).toBe('SENDED')
    })

    // Проверяем перенаправление
    await waitFor(() => {
      expect(screen.getByTestId('current-location')).toHaveTextContent(
        '/companies/waiting?companyId=c-1'
      )
    })
  })
})
