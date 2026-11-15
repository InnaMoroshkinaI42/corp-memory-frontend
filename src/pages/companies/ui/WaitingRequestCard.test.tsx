
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { WaitingRequestCard } from './WaitingRequestCard'

const mockFetch = vi.fn()

vi.stubGlobal('fetch', mockFetch)

function renderCard() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

  render(
    <QueryClientProvider client={queryClient}>
      <WaitingRequestCard
        company={{
          uuid: 'c-2',
          name: 'Skyline Retail',
          industry: 'Розничная торговля',
        }}
        request={{
          uuid: 'jr-1',
          company_id: 'c-2',
          user_id: 'u-1',
          status: 'SENDED',
          dateText: '6 октября, 09:40',
          message: 'Присоединяюсь к команде как дизайнер.',
        }}
        ownerName="Марина Соколова"
      />
    </QueryClientProvider>
  )

  return { queryClient, invalidateSpy }
}

describe('WaitingRequestCard', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('отображает информацию о компании и заявке', () => {
    renderCard()

    expect(screen.getByText('Skyline Retail')).toBeInTheDocument()
    expect(screen.getByText('Ожидает подтверждения')).toBeInTheDocument()
    expect(
      screen.getByText(/Запрос отправлен 6 октября, 09:40/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Присоединяюсь к команде как дизайнер/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Подтверждает Марина Соколова/)
    ).toBeInTheDocument()
  })

  
it('отменяет заявку через DELETE и обновляет список заявок', async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ message: 'Заявка отменена' }),
  })

  const { invalidateSpy } = renderCard()

  fireEvent.click(
    screen.getByRole('button', { name: 'Отменить запрос' })
  )

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalled()

    const [request] = mockFetch.mock.calls[0]

    if (request instanceof Request) {
      expect(new URL(request.url).pathname).toBe(
        '/api/join-requests/jr-1'
      )
      expect(request.method).toBe('DELETE')
    } else {
      expect(request).toBe('/api/join-requests/jr-1')
      expect(mockFetch.mock.calls[0][1]).toEqual({
        method: 'DELETE',
      })
    }
  })

  await waitFor(() => {
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['company-join-requests', 'c-2'],
    })
  })
})


  it('показывает ошибку, если отменить заявку не удалось', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Ошибка удаления' }),
    })

    renderCard()

    fireEvent.click(
      screen.getByRole('button', { name: 'Отменить запрос' })
    )

    expect(
      await screen.findByText(
        'Не удалось отменить заявку. Попробуйте ещё раз.'
      )
    ).toBeInTheDocument()
  })
})
