
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CompaniesPage } from './CompaniesPage'

const mockUseQuery = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}))

const companies = [
  {
    uuid: 'c-1',
    name: 'Nordwind Analytics',
    owner_id: 'u-1',
    created_at: '2026-10-01',
    members: 6,
    documents: 24,
    chats: 8,
    lastActive: 'сегодня, 10:24',
  },
  {
    uuid: 'c-2',
    name: 'Skyline Retail',
    owner_id: 'u-2',
    created_at: '2026-10-02',
    members: 12,
    documents: 34,
    chats: 15,
    lastActive: 'вчера, 18:30',
  },
]

const joinRequests = [
  {
    uuid: 'jr-1',
    company_id: 'c-1',
    user_id: 'u-4',
    status: 'SENDED',
    created_at: '2026-10-06',
    user_name: 'Елена Соколова',
    user_email: 'elena@example.com',
    company_name: 'Nordwind Analytics',
    dateText: '6 октября, 09:40',
  },
]

function mockQueries({
  companiesData = companies,
  requestsData = joinRequests,
  loading = false,
}: {
  companiesData?: typeof companies | null
  requestsData?: typeof joinRequests | null
  loading?: boolean
} = {}) {
  mockUseQuery.mockImplementation(
    ({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === 'companies') {
        return {
          data: companiesData,
          isLoading: loading,
        }
      }

      if (queryKey[0] === 'join-requests') {
        return {
          data: requestsData,
          isLoading: false,
        }
      }

      return {
        data: undefined,
        isLoading: false,
      }
    },
  )
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/companies']}>
      <CompaniesPage />
    </MemoryRouter>,
  )
}

describe('CompaniesPage — интеграционные тесты', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockQueries()
  })

  it('отображает заголовок страницы', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Мои компании' }),
    ).toBeInTheDocument()
  })

  it('отображает список компаний', () => {
    renderPage()

    expect(screen.getByText('Nordwind Analytics')).toBeInTheDocument()
    expect(screen.getByText('Skyline Retail')).toBeInTheDocument()
  })

  it('отображает роль пользователя в каждой компании', () => {
    renderPage()

    expect(screen.getByText('Владелец')).toBeInTheDocument()
    expect(screen.getByText('Участник')).toBeInTheDocument()
  })

  it('отображает статистику компаний', () => {
    renderPage()

    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('34')).toBeInTheDocument()

    expect(screen.getAllByText('участников')).toHaveLength(2)
    expect(screen.getAllByText('документа')).toHaveLength(2)
    expect(screen.getAllByText('чатов')).toHaveLength(2)
  })

  it('отображает время последней активности компании', () => {
    renderPage()

    expect(screen.getByText('Открыта сегодня, 10:24')).toBeInTheDocument()
    expect(screen.getByText('Открыта вчера, 18:30')).toBeInTheDocument()
  })

  it('показывает состояние загрузки компаний', () => {
    mockQueries({ loading: true })

    renderPage()

    expect(screen.getByText('Загрузка компаний...')).toBeInTheDocument()
    expect(
      screen.queryByText('Nordwind Analytics'),
    ).not.toBeInTheDocument()
  })

  it('отображает сообщение о вступлении в компанию', () => {
    renderPage()

    expect(
      screen.getByText(/Для вступления нужен ID или ссылка-приглашение/),
    ).toBeInTheDocument()
  })

  it('содержит ссылку на создание компании', () => {
    renderPage()

    expect(
      screen.getByRole('link', { name: /Создать компанию/ }),
    ).toHaveAttribute('href', '/companies/create')
  })

  it('содержит ссылку на вступление в компанию', () => {
    renderPage()

    expect(
      screen.getByRole('link', { name: /Вступить в компанию/ }),
    ).toHaveAttribute('href', '/companies/join')
  })

  it('содержит ссылку для открытия каждой компании', () => {
    renderPage()

    const companyLinks = screen.getAllByRole('link', {
  name: /Открыть компанию/,
})

expect(companyLinks).toHaveLength(2)
expect(companyLinks[0]).toHaveAttribute('href', '/app/overview/c-1')
expect(companyLinks[1]).toHaveAttribute('href', '/app/overview/c-2')
  })

  it('отображает ожидающие запросы на вступление', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Ожидающие запросы' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Елена Соколова хочет вступить в «Nordwind Analytics»/),
    ).toBeInTheDocument()

    expect(
      screen.getByText('elena@example.com'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Ожидает подтверждения'),
    ).toBeInTheDocument()
  })

  it('содержит ссылку для рассмотрения заявки', () => {
    renderPage()

    expect(
      screen.getByRole('link', { name: 'Рассмотреть запрос' }),
    ).toHaveAttribute('href', '/app/members/c-1')
  })

  it('не отображает блок заявок, если заявок нет', () => {
    mockQueries({ requestsData: [] })

    renderPage()

    expect(
      screen.queryByRole('heading', { name: 'Ожидающие запросы' }),
    ).not.toBeInTheDocument()
  })

  it('не отображает карточки, если список компаний пуст', () => {
    mockQueries({ companiesData: [] })

    renderPage()

    expect(screen.queryByText('Nordwind Analytics')).not.toBeInTheDocument()
    expect(screen.queryByText('Skyline Retail')).not.toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Мои компании' }),
    ).toBeInTheDocument()
  })
})
