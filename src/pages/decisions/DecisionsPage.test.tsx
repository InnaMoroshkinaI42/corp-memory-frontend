
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { http, HttpResponse } from 'msw'

import { DecisionsPage } from './DecisionsPage'
import { server } from '@/test/server'

function renderPage(companyId = 'c-1') {
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
      <MemoryRouter initialEntries={[`/app/decisions/${companyId}`]}>
        <Routes>
          <Route
            path="/app/decisions/:id"
            element={<DecisionsPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DecisionsPage', () => {
  it('отображает заголовок и описание страницы', async () => {
  renderPage()

  expect(
    await screen.findByRole('heading', { name: 'Реестр решений' }),
  ).toBeInTheDocument()

  expect(
    screen.getByText(
      'Все зафиксированные решения компании с источниками.',
    ),
  ).toBeInTheDocument()
})

  it('отображает решения выбранной компании', async () => {
    renderPage('c-1')

    expect(
      await screen.findByText(
        'Запустить пилот Atlas на 10 клиентах 12 октября',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Публичный запуск Atlas — 20 октября 2026'),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Онбординг корпоративного клиента сократить до 6 дней',
      ),
    ).toBeInTheDocument()
  })

  it('не отображает решения других компаний', async () => {
    renderPage('c-1')

    expect(
      await screen.findByText(
        'Запустить пилот Atlas на 10 клиентах 12 октября',
      ),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Открыть новый филиал в Казани в ноябре 2026'),
    ).not.toBeInTheDocument()
  })

  it('отображает ссылки на исходные документы', async () => {
    renderPage('c-1')

    const sourceLinks = await screen.findAllByRole('link', {
      name: 'Стратегическая сессия Q3 2026.mp4',
    })

    expect(sourceLinks).toHaveLength(2)

    sourceLinks.forEach(link => {
      expect(link).toHaveAttribute(
        'href',
        '/app/documents/c-1/d-1',
      )
    })

    expect(
      screen.getByRole('link', {
        name: 'Совет директоров — 14 сентября.m4a',
      }),
    ).toHaveAttribute('href', '/app/documents/c-1/d-2')
  })

  it('отображает решения другой компании отдельно', async () => {
    renderPage('c-2')

    expect(
      await screen.findByText(
        'Открыть новый филиал в Казани в ноябре 2026',
      ),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(
        'Запустить пилот Atlas на 10 клиентах 12 октября',
      ),
    ).not.toBeInTheDocument()
  })

  it('отображает пустое состояние, если решений нет', async () => {
    server.use(
      http.get('*/api/companies/:id/decisions', () => {
        return HttpResponse.json([])
      }),
    )

    renderPage()

    expect(
      await screen.findByText('Решений пока нет'),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Решения появятся здесь после обработки материалов встреч.',
      ),
    ).toBeInTheDocument()
  })
})
