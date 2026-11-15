
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { SecuritySidebar } from './SecuritySidebar'

const securityData = {
  passwordUpdatedAt: '1 октября 2026',
  sessions: [
    {
      id: 's1',
      device: 'Chrome · macOS',
      location: 'Москва',
      lastActive: '6 октября, 10:24',
      isCurrent: true,
    },
  ],
  companyToTransfer: 'Nordwind Analytics company',
}

let queryClient: QueryClient
let fetchMock: ReturnType<typeof vi.fn>

function renderSidebar() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<SecuritySidebar />} />
          <Route path="/login" element={<div>Страница входа</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SecuritySidebar', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => securityData,
    })

    vi.stubGlobal('fetch', fetchMock)
    localStorage.setItem('token', 'test-token')
  })

  afterEach(() => {
    queryClient.clear()
    localStorage.clear()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('отображает состояние загрузки', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}))

    renderSidebar()

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  it('запрашивает данные безопасности профиля', async () => {
    renderSidebar()

    expect(
      await screen.findByText('Безопасность'),
    ).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith('/api/profile/security')
  })

  it('отображает подтверждение email', async () => {
    renderSidebar()

    expect(
      await screen.findByText('Email подтверждён'),
    ).toBeInTheDocument()
  })

  it('отображает дату обновления пароля', async () => {
    renderSidebar()

    expect(
      await screen.findByText(/Пароль обновлён 1 октября 2026/),
    ).toBeInTheDocument()
  })

  it('отображает информацию об активной сессии', async () => {
    renderSidebar()

    expect(
      await screen.findByText('Chrome · macOS'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Москва · 6 октября, 10:24'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Текущая сессия'),
    ).toBeInTheDocument()
  })

  it('отображает информацию об управлении аккаунтом', async () => {
    renderSidebar()

    expect(
      await screen.findByText('Управление аккаунтом'),
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Nordwind Analytics company/),
    ).toBeInTheDocument()
  })

  it('отображает кнопку выхода из аккаунта', async () => {
    renderSidebar()

    expect(
      await screen.findByRole('button', {
        name: 'Выйти из аккаунта',
      }),
    ).toBeInTheDocument()
  })

  it('удаляет токен и переходит на страницу входа при выходе', async () => {
    const user = userEvent.setup()

    renderSidebar()

    await user.click(
      await screen.findByRole('button', {
        name: 'Выйти из аккаунта',
      }),
    )

    expect(localStorage.getItem('token')).toBeNull()

    expect(
      screen.getByText('Страница входа'),
    ).toBeInTheDocument()
  })

  it('отправляет запрос на изменение пароля', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'prompt').mockReturnValue('newPassword123')

    renderSidebar()

    await user.click(
      await screen.findByRole('button', {
        name: 'Изменить пароль',
      }),
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/profile/security/password',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ password: 'newPassword123' }),
      }),
    )

    expect(
      await screen.findByText('Пароль успешно изменён'),
    ).toBeInTheDocument()
  })

  it('не отправляет запрос, если пароль слишком короткий', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'prompt').mockReturnValue('123')

    renderSidebar()

    await user.click(
      await screen.findByRole('button', {
        name: 'Изменить пароль',
      }),
    )

    expect(
      await screen.findByText(
        'Пароль должен содержать не менее 8 символов',
      ),
    ).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('отправляет запрос на завершение остальных сессий', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderSidebar()

    await user.click(
      await screen.findByText('Завершить остальные сессии'),
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/profile/security/sessions/terminate-others',
      { method: 'POST' },
    )

    expect(
      await screen.findByText('Остальные сессии завершены'),
    ).toBeInTheDocument()
  })

  it('не удаляет аккаунт, пока пользователь владеет компанией', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    fetchMock.mockImplementation(async (url: string, options?: RequestInit) => {
      if (url === '/api/profile') {
        return {
          ok: false,
          json: async () => ({
            message:
              'Перед удалением аккаунта необходимо передать владение компанией «Nordwind Analytics».',
          }),
        }
      }

      return {
        ok: true,
        json: async () => securityData,
      }
    })

    renderSidebar()

    await user.click(
      await screen.findByText('Удаление аккаунта'),
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/profile',
      { method: 'DELETE' },
    )

    expect(
      await screen.findByText(
        /Перед удалением аккаунта необходимо передать владение компанией/,
      ),
    ).toBeInTheDocument()

    expect(localStorage.getItem('token')).toBe('test-token')
  })
})
