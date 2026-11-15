
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import { ProfilePage } from './ProfilePage'

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ProfilePage — интеграция с API', () => {
  it('получает данные профиля и отображает их вместе с блоками настроек', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', {
        name: 'Личный профиль',
      }),
    ).toBeInTheDocument()

    // Данные, полученные через GET /api/profile.
    expect(
      screen.getByDisplayValue('Алексей Морозов'),
    ).toBeInTheDocument()

    expect(
      screen.getByDisplayValue('a.morozov@nordwind.ru'),
    ).toBeInTheDocument()

    // Карточка уведомлений.
    expect(
      screen.getByText('Уведомления'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Документ готов'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Запросы на вступление'),
    ).toBeInTheDocument()

    // Данные GET /api/profile/security.
    expect(
      await screen.findByText('Безопасность'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Email подтверждён'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Активные сессии'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Управление аккаунтом'),
    ).toBeInTheDocument()
  })
})
