
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { SettingsPage } from './SettingsPage'

vi.mock('./ui/SettingsTabs', () => ({
  SettingsTabs: ({ activeTab, onTabChange }: any) => (
    <div>
      <button onClick={() => onTabChange('Основные')}>Основные</button>
      <button onClick={() => onTabChange('Доступы и безопасность')}>
        Доступы и безопасность
      </button>
      <button onClick={() => onTabChange('Тариф и оплата')}>
        Тариф и оплата
      </button>
      <span>Активная вкладка: {activeTab}</span>
    </div>
  ),
}))

vi.mock('./ui/CompanyProfileCard', () => ({
  CompanyProfileCard: () => <div>Карточка компании</div>,
}))

vi.mock('./ui/InviteLinkCard', () => ({
  InviteLinkCard: ({ companyId }: any) => (
    <div>Приглашение для {companyId}</div>
  ),
}))

vi.mock('./ui/PermissionsTable', () => ({
  PermissionsTable: () => <div>Таблица прав доступа</div>,
}))

vi.mock('./ui/DangerZone', () => ({
  DangerZone: ({ companyId }: any) => (
    <div>Опасная зона {companyId}</div>
  ),
}))

vi.mock('./ui/SecurityTab', () => ({
  SecurityTab: () => <div>Настройки безопасности</div>,
}))

vi.mock('./ui/BillingTab', () => ({
  BillingTab: () => <div>Настройки оплаты</div>,
}))

const company = {
  uuid: 'company-1',
  name: 'Компания Альфа',
  industry: 'IT',
  owner_name: 'Иван',
}

let queryClient: QueryClient
let fetchMock: ReturnType<typeof vi.fn>

function renderPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/companies/company-1/settings']}>
        <Routes>
          <Route
            path="/companies/:id/settings"
            element={<SettingsPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SettingsPage', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    fetchMock = vi.fn().mockResolvedValue({
      json: async () => company,
    })

    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    queryClient.clear()
    vi.unstubAllGlobals()
  })

  it('отображает загрузку до получения компании', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}))

    renderPage()

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  it('загружает компанию по ID из URL', async () => {
    renderPage()

    expect(await screen.findByText(/Компания Альфа/)).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/companies/company-1',
    )
  })

  it('отображает заголовок и название компании', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', {
        name: 'Настройки компании',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(/правила доступа компании «Компания Альфа»/),
    ).toBeInTheDocument()
  })

  it('по умолчанию отображает основные настройки', async () => {
    renderPage()

    expect(await screen.findByText('Карточка компании'))
      .toBeInTheDocument()

    expect(screen.getByText('Приглашение для company-1'))
      .toBeInTheDocument()

    expect(screen.getByText('Таблица прав доступа'))
      .toBeInTheDocument()

    expect(screen.getByText('Опасная зона company-1'))
      .toBeInTheDocument()
  })

  it('переключается на вкладку безопасности', async () => {
    renderPage()

    await screen.findByText('Карточка компании')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Доступы и безопасность',
      }),
    )

    expect(screen.getByText('Настройки безопасности'))
      .toBeInTheDocument()

    expect(screen.queryByText('Карточка компании'))
      .not.toBeInTheDocument()
  })

  it('переключается на вкладку оплаты', async () => {
    renderPage()

    await screen.findByText('Карточка компании')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Тариф и оплата',
      }),
    )

    expect(screen.getByText('Настройки оплаты'))
      .toBeInTheDocument()

    expect(screen.queryByText('Карточка компании'))
      .not.toBeInTheDocument()
  })

  it('возвращается к основным настройкам при выборе вкладки', async () => {
    renderPage()

    await screen.findByText('Карточка компании')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Доступы и безопасность',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Основные',
      }),
    )

    expect(screen.getByText('Карточка компании'))
      .toBeInTheDocument()

    expect(screen.getByText('Таблица прав доступа'))
      .toBeInTheDocument()
  })
})
