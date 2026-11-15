
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'

import { ProfilePage } from './ProfilePage'
import { server } from '@/test/server'

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('ProfilePage', () => {
  it('отображает состояние загрузки профиля', () => {
    renderPage()

    expect(screen.getByText('Загрузка профиля...')).toBeInTheDocument()
  })

  it('отображает заголовок и описание страницы', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Личный профиль' })
    ).toBeInTheDocument()

    expect(
      screen.getByText('Настройки вашего аккаунта. Они не меняют настройки компании.')
    ).toBeInTheDocument()
  })

  it('отображает личные данные пользователя', async () => {
  renderPage()

  expect(await screen.findByDisplayValue('Алексей Морозов')).toBeInTheDocument()
  expect(screen.getByDisplayValue('a.morozov@nordwind.ru')).toBeInTheDocument()

  expect(screen.getByText('Личные данные')).toBeInTheDocument()
  expect(screen.getByText('АМ')).toBeInTheDocument()
})

  it('отображает карточки уведомлений и безопасности', async () => {
  renderPage()

  expect(await screen.findByText('Уведомления')).toBeInTheDocument()
  expect(screen.getByText('Документ готов')).toBeInTheDocument()
  expect(screen.getByText('Запросы на вступление')).toBeInTheDocument()

  // SecuritySidebar загружает данные отдельным запросом
  expect(await screen.findByText('Безопасность')).toBeInTheDocument()
  expect(screen.getByText('Активные сессии')).toBeInTheDocument()
  expect(screen.getByText('Управление аккаунтом')).toBeInTheDocument()
})

  it('отображает сообщение, если профиль не удалось загрузить', async () => {
    server.use(
      http.get('*/api/profile', () => {
        return HttpResponse.json(
          { message: 'Ошибка сервера' },
          { status: 500 }
        )
      })
    )

    renderPage()

    expect(
      await screen.findByText('Профиль не найден')
    ).toBeInTheDocument()
  })
})
