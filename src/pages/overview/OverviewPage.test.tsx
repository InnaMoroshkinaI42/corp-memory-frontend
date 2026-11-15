
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { OverviewPage } from './OverviewPage'

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/app/overview/c-1']}>
        <Routes>
          <Route
            path="/app/overview/:id"
            element={<OverviewPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('OverviewPage', () => {
  it('отображает заголовок страницы', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', {
        name: 'Обзор компании',
      }),
    ).toBeInTheDocument()
  })

  it('отображает название компании', async () => {
    renderPage()

    expect(
      await screen.findByText(/Nordwind Analytics/),
    ).toBeInTheDocument()
  })

  it('отображает статистику компании', async () => {
    renderPage()

    expect(await screen.findByText('24')).toBeInTheDocument()
    expect(screen.getByText('18.5')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()

    expect(screen.getByText('Документы')).toBeInTheDocument()
    expect(screen.getByText('Часы встреч')).toBeInTheDocument()
    expect(screen.getByText('Решения')).toBeInTheDocument()
  })

  it('отображает последние документы компании', async () => {
    renderPage()

    expect(
      await screen.findByText('Последние документы'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Стратегическая сессия Q3 2026.mp4'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Совет директоров — 14 сентября.m4a'),
    ).toBeInTheDocument()
  })

  it('отображает статусы обработки документов', async () => {
    renderPage()

    expect(
      await screen.findByText('Готов'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Обрабатывается'),
    ).toBeInTheDocument()
  })

  it('отображает последние решения компании', async () => {
    renderPage()

    expect(
      await screen.findByText('Последние решения'),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Запустить пилот Atlas на 10 клиентах 12 октября',
      ),
    ).toBeInTheDocument()
  })

  it('отображает активность участников команды', async () => {
    renderPage()

    expect(
      await screen.findByText(
        'Мария добавила «Стратегическая сессия Q3 2026»',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Елена Соколова ждёт одобрения'),
    ).toBeInTheDocument()
  })

  it('содержит ссылку на загрузку документа', async () => {
    renderPage()

    expect(
      await screen.findByRole('link', {
        name: /Загрузить документ/,
      }),
    ).toHaveAttribute('href', '/app/documents/upload/c-1')
  })

  it('содержит ссылку на чат с ИИ', async () => {
    renderPage()

    expect(
      await screen.findByRole('link', {
        name: /Спросить MeetMind/,
      }),
    ).toHaveAttribute('href', '/app/chats/c-1')
  })

  it('содержит ссылки на документы, решения и участников', async () => {
    renderPage()

    expect(
      await screen.findByRole('link', {
        name: /Все документы/,
      }),
    ).toHaveAttribute('href', '/app/documents/c-1')

    expect(
      screen.getByRole('link', {
        name: /Все решения/,
      }),
    ).toHaveAttribute('href', '/app/decisions/c-1')

    expect(
      screen.getByRole('link', {
        name: 'Рассмотреть запрос',
      }),
    ).toHaveAttribute('href', '/app/members/c-1')
  })
})
