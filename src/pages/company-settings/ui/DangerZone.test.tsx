
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DangerZone } from './DangerZone'

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderComponent(companyId = 'company-123') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
  const removeQueries = vi.spyOn(queryClient, 'removeQueries')

  render(
    <QueryClientProvider client={queryClient}>
      <DangerZone companyId={companyId} />
    </QueryClientProvider>
  )

  return { queryClient, invalidateQueries, removeQueries }
}

describe('DangerZone', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('confirm', vi.fn())
  })

  it('отображает информацию об удалении компании', () => {
    renderComponent()

    expect(screen.getByText('Удаление компании')).toBeInTheDocument()

    expect(
      screen.getByText(
        'Все документы, чаты и решения будут удалены без возможности восстановления.'
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Удалить компанию' })
    ).toBeInTheDocument()
  })

  it('не удаляет компанию, если пользователь отменил подтверждение', () => {
    vi.mocked(window.confirm).mockReturnValue(false)

    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: 'Удалить компанию' }))

    expect(window.confirm).toHaveBeenCalled()
    expect(fetch).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('показывает предупреждение перед удалением', () => {
    vi.mocked(window.confirm).mockReturnValue(false)

    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: 'Удалить компанию' }))

    expect(window.confirm).toHaveBeenCalledWith(
      'Вы действительно хотите удалить компанию? Все её документы, чаты и решения будут удалены без возможности восстановления.'
    )
  })

  it('отправляет DELETE-запрос после подтверждения', async () => {
    vi.mocked(window.confirm).mockReturnValue(true)
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response)

    renderComponent('company-123')

    fireEvent.click(screen.getByRole('button', { name: 'Удалить компанию' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/companies/company-123', {
        method: 'DELETE',
      })
    })
  })

  it('после успешного удаления обновляет кэш и перенаправляет пользователя', async () => {
    vi.mocked(window.confirm).mockReturnValue(true)
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response)

    const { invalidateQueries, removeQueries } = renderComponent()

    fireEvent.click(screen.getByRole('button', { name: 'Удалить компанию' }))

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['companies'],
      })

      expect(removeQueries).toHaveBeenCalledWith({
        queryKey: ['company', 'company-123'],
      })

      expect(mockNavigate).toHaveBeenCalledWith('/companies')
    })
  })

  it('показывает ошибку при отсутствии прав на удаление', async () => {
    vi.mocked(window.confirm).mockReturnValue(true)
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 403,
    } as Response)

    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: 'Удалить компанию' }))

    expect(
      await screen.findByText('У вас нет прав на удаление этой компании.')
    ).toBeInTheDocument()

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('показывает общую ошибку при неудачном удалении', async () => {
    vi.mocked(window.confirm).mockReturnValue(true)
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: 'Удалить компанию' }))

    expect(
      await screen.findByText('Не удалось удалить компанию. Попробуйте ещё раз.')
    ).toBeInTheDocument()

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
