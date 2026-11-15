
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CompanyProfileCard } from './CompanyProfileCard'

const company = {
  uuid: 'company-abc-123',
  name: 'Компания Альфа',
  description: 'Описание компании',
  domain: 'alpha.ru',
  owner_name: 'Иван Иванов',
}

let queryClient: QueryClient
let fetchMock: ReturnType<typeof vi.fn>
const writeTextMock = vi.fn()

function renderCard(companyData = company) {
  return render(
    <QueryClientProvider client={queryClient}>
      <CompanyProfileCard company={companyData} />
    </QueryClientProvider>,
  )
}

describe('CompanyProfileCard', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => company,
    })

    vi.stubGlobal('fetch', fetchMock)

    writeTextMock.mockReset()

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    })
  })

  afterEach(() => {
    queryClient.clear()
    vi.unstubAllGlobals()
  })

  it('отображает данные компании в полях формы', () => {
    renderCard()

    expect(screen.getByLabelText('Название компании'))
      .toHaveValue('Компания Альфа')

    expect(screen.getByLabelText('Описание'))
      .toHaveValue('Описание компании')

    expect(screen.getByLabelText('Рабочий домен'))
      .toHaveValue('alpha.ru')
  })

  it('отображает имя владельца компании', () => {
    renderCard()

    expect(screen.getByText('Владелец: Иван Иванов'))
      .toBeInTheDocument()
  })

  it('отображает ID компании в верхнем регистре', () => {
    renderCard()

    expect(screen.getByText('COMPANY-ABC-123'))
      .toBeInTheDocument()
  })

  it('отправляет PUT-запрос с изменёнными данными', async () => {
    renderCard()

    fireEvent.change(screen.getByLabelText('Название компании'), {
      target: { value: 'Новая компания' },
    })

    fireEvent.change(screen.getByLabelText('Описание'), {
      target: { value: 'Новое описание' },
    })

    fireEvent.change(screen.getByLabelText('Рабочий домен'), {
      target: { value: 'new.ru' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Сохранить изменения' }),
    )

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/companies/company-abc-123',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Новая компания',
            description: 'Новое описание',
            domain: 'new.ru',
          }),
        }),
      )
    })
  })

  it('удаляет пробелы по краям значений перед отправкой', async () => {
    renderCard()

    fireEvent.change(screen.getByLabelText('Название компании'), {
      target: { value: '  Новая компания  ' },
    })

    fireEvent.change(screen.getByLabelText('Описание'), {
      target: { value: '  Описание  ' },
    })

    fireEvent.change(screen.getByLabelText('Рабочий домен'), {
      target: { value: '  new.ru  ' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Сохранить изменения' }),
    )

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/companies/company-abc-123',
        expect.objectContaining({
          body: JSON.stringify({
            name: 'Новая компания',
            description: 'Описание',
            domain: 'new.ru',
          }),
        }),
      )
    })
  })

  it('не отправляет данные, если название компании пустое после trim', async () => {
    renderCard()

    fireEvent.change(screen.getByLabelText('Название компании'), {
      target: { value: '   ' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Сохранить изменения' }),
    )

    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  it('показывает сообщение об успешном сохранении', async () => {
    renderCard()

    fireEvent.click(
      screen.getByRole('button', { name: 'Сохранить изменения' }),
    )

    expect(
      await screen.findByText('Изменения успешно сохранены'),
    ).toBeInTheDocument()
  })

  it('показывает ошибку, если сервер не сохранил изменения', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })

    renderCard()

    fireEvent.click(
      screen.getByRole('button', { name: 'Сохранить изменения' }),
    )

    expect(
      await screen.findByText('Не удалось сохранить изменения компании'),
    ).toBeInTheDocument()
  })

  it('копирует ID компании в буфер обмена', async () => {
    renderCard()

    fireEvent.click(
      screen.getByRole('button', { name: 'Скопировать ID' }),
    )

    expect(writeTextMock).toHaveBeenCalledWith('company-abc-123')
  })
})
