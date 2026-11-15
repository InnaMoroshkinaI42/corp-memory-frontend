
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MembersPage } from './MembersPage'

const mocks = vi.hoisted(() => ({
  useParams: vi.fn(),
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
  approveMutate: vi.fn(),
  rejectMutate: vi.fn(),
  invalidateQueries: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useParams: mocks.useParams,
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: mocks.useQuery,
  useMutation: mocks.useMutation,
  useQueryClient: mocks.useQueryClient,
}))

vi.mock('./ui/MemberRequestCard', () => ({
  MemberRequestCard: ({ requests, onApprove, onReject }: any) => (
    <div data-testid="member-requests">
      <span>Заявок: {requests.length}</span>

      {requests.map((request: any) => (
        <div key={request.uuid}>
          <button onClick={() => onApprove(request.uuid)}>
            Принять {request.uuid}
          </button>

          <button onClick={() => onReject(request.uuid)}>
            Отклонить {request.uuid}
          </button>
        </div>
      ))}
    </div>
  ),
}))

vi.mock('./ui/MembersTable', () => ({
  MembersTable: ({ members }: any) => (
    <div data-testid="members-table">
      Участников в таблице: {members.length}
    </div>
  ),
}))

vi.mock('@/shared/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock('@/shared/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))

describe('MembersPage', () => {
  const members = [
    {
      uuid: 'm-1',
      first_name: 'Иван',
      last_name: 'Иванов',
      email: 'ivan@example.com',
    },
    {
      uuid: 'm-2',
      first_name: 'Мария',
      last_name: 'Петрова',
      email: 'maria@example.com',
    },
  ]

  const requests = [
    { uuid: 'r-1', status: 'SENDED' },
    { uuid: 'r-2', status: 'APPROVED' },
    { uuid: 'r-3', status: 'SENDED' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mocks.useParams.mockReturnValue({ id: 'company-1' })

    mocks.useQuery.mockImplementation(({ queryKey }: any) => {
      if (queryKey[0] === 'members') {
        return { data: members }
      }

      if (queryKey[0] === 'join-requests') {
        return { data: requests }
      }

      return { data: undefined }
    })

    mocks.useQueryClient.mockReturnValue({
      invalidateQueries: mocks.invalidateQueries,
    })

    let mutationCall = 0

    mocks.useMutation.mockImplementation(() => {
      const currentCall = mutationCall++ % 2

      return {
        mutate: currentCall === 0
          ? mocks.approveMutate
          : mocks.rejectMutate,
      }
    })
  })

  it('отображает заголовок страницы', () => {
    render(<MembersPage />)

    expect(
      screen.getByRole('heading', { name: 'Участники' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Управляйте командой и доступом к памяти компании.'),
    ).toBeInTheDocument()
  })

  it('отображает количество участников и таблицу', () => {
    render(<MembersPage />)

    expect(screen.getByText('Участники · 2')).toBeInTheDocument()

    expect(screen.getByTestId('members-table')).toHaveTextContent(
      'Участников в таблице: 2',
    )
  })

  it('передаёт карточке только заявки со статусом SENDED', () => {
    render(<MembersPage />)

    expect(screen.getByTestId('member-requests')).toHaveTextContent(
      'Заявок: 2',
    )

    expect(
      screen.getByRole('button', { name: 'Принять r-1' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Принять r-3' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'Принять r-2' }),
    ).not.toBeInTheDocument()
  })

  it('переключает вкладку на приглашения', () => {
    render(<MembersPage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Приглашения · 0' }),
    )

    expect(
      screen.getByText('Приглашений пока нет.'),
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId('members-table'),
    ).not.toBeInTheDocument()
  })

  it('возвращает таблицу участников при переключении обратно', () => {
    render(<MembersPage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Приглашения · 0' }),
    )

    fireEvent.click(
      screen.getByRole('button', { name: /Участники · 2/ }),
    )

    expect(screen.getByTestId('members-table')).toBeInTheDocument()
  })

  it('вызывает принятие заявки с правильным идентификатором', () => {
    render(<MembersPage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Принять r-1' }),
    )

    expect(mocks.approveMutate).toHaveBeenCalledWith('r-1')
  })

  it('создаёт запросы для участников и заявок нужной компании', () => {
    render(<MembersPage />)

    expect(mocks.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['members', 'company-1'],
      }),
    )

    expect(mocks.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['join-requests', 'company-1'],
      }),
    )
  })

  it('после успешного принятия заявки обновляет участников и заявки', () => {
    render(<MembersPage />)

    const mutationOptions = mocks.useMutation.mock.calls[0][0]

    mutationOptions.onSuccess()

    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['join-requests', 'company-1'],
    })

    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['members', 'company-1'],
    })

    expect(mocks.invalidateQueries).toHaveBeenCalledTimes(2)
  })

  it('вызывает отклонение заявки с правильным идентификатором', () => {
    render(<MembersPage />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Отклонить r-1' }),
    )

    expect(mocks.rejectMutate).toHaveBeenCalledTimes(1)
    expect(mocks.rejectMutate).toHaveBeenCalledWith('r-1')
  })

  it('отправляет POST-запрос для отклонения заявки', async () => {
    render(<MembersPage />)

    const mutationOptions = mocks.useMutation.mock.calls[1][0]

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
    })

    const originalFetch = globalThis.fetch
    globalThis.fetch = fetchMock

    try {
      await mutationOptions.mutationFn('r-1')

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/join-requests/r-1/reject',
        { method: 'POST' },
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('после успешного отклонения обновляет список заявок', () => {
    render(<MembersPage />)

    const mutationOptions = mocks.useMutation.mock.calls[1][0]

    mutationOptions.onSuccess()

    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['join-requests', 'company-1'],
    })

    expect(mocks.invalidateQueries).toHaveBeenCalledTimes(1)
  })

  // Тесты поиска участников

  it('отображает всех участников при пустом поиске', () => {
    render(<MembersPage />)

    expect(screen.getByTestId('members-table')).toHaveTextContent(
      'Участников в таблице: 2',
    )
  })

  it('фильтрует участников по имени', () => {
    render(<MembersPage />)

    fireEvent.change(
      screen.getByPlaceholderText('Поиск по имени или email'),
      { target: { value: 'Иван' } },
    )

    expect(screen.getByTestId('members-table')).toHaveTextContent(
      'Участников в таблице: 1',
    )
  })

  it('фильтрует участников по фамилии', () => {
    render(<MembersPage />)

    fireEvent.change(
      screen.getByPlaceholderText('Поиск по имени или email'),
      { target: { value: 'Петрова' } },
    )

    expect(screen.getByTestId('members-table')).toHaveTextContent(
      'Участников в таблице: 1',
    )
  })

  it('фильтрует участников по email', () => {
    render(<MembersPage />)

    fireEvent.change(
      screen.getByPlaceholderText('Поиск по имени или email'),
      { target: { value: 'maria@example.com' } },
    )

    expect(screen.getByTestId('members-table')).toHaveTextContent(
      'Участников в таблице: 1',
    )
  })

  it('выполняет поиск без учёта регистра', () => {
    render(<MembersPage />)

    fireEvent.change(
      screen.getByPlaceholderText('Поиск по имени или email'),
      { target: { value: 'ИВАН' } },
    )

    expect(screen.getByTestId('members-table')).toHaveTextContent(
      'Участников в таблице: 1',
    )
  })

  it('показывает сообщение, если участники не найдены', () => {
    render(<MembersPage />)

    fireEvent.change(
      screen.getByPlaceholderText('Поиск по имени или email'),
      { target: { value: 'Несуществующий пользователь' } },
    )

    expect(screen.getByText('Участники не найдены.')).toBeInTheDocument()

    expect(
      screen.queryByTestId('members-table'),
    ).not.toBeInTheDocument()
  })

  it('сбрасывает фильтр после очистки поисковой строки', () => {
    render(<MembersPage />)

    const searchInput = screen.getByPlaceholderText(
      'Поиск по имени или email',
    )

    fireEvent.change(searchInput, {
      target: { value: 'Иван' },
    })

    expect(screen.getByTestId('members-table')).toHaveTextContent(
      'Участников в таблице: 1',
    )

    fireEvent.change(searchInput, {
      target: { value: '' },
    })

    expect(screen.getByTestId('members-table')).toHaveTextContent(
      'Участников в таблице: 2',
    )
  })
})
