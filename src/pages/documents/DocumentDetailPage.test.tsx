
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { DocumentDetailPage } from './DocumentDetailPage'

const mockUseQuery = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}))

type TranscriptItem = {
  time: string
  name: string
  text: string
}

type DocumentFixture = {
  uuid: string
  original_name: string
  mime_type: string
  status: string
  pages?: number
  size?: string
  duration?: string
  summary?: string
  transcript?: TranscriptItem[]
  participants?: string[]
}

const company = {
  id: 'company-1',
  name: 'Тестовая компания',
}

const document: DocumentFixture = {
  uuid: 'doc-1',
  original_name: 'Протокол встречи.pdf',
  mime_type: 'application/pdf',
  status: 'ACTIVE',
  pages: 15,
  size: '25 МБ',
  summary: 'Команда обсудила запуск нового продукта.',
  transcript: [
    {
      time: '12:40',
      name: 'Иван Иванов',
      text: 'Начинаем подготовку проекта.',
    },
    {
      time: '18:15',
      name: 'Мария Петрова',
      text: 'Согласуем сроки запуска.',
    },
  ],
  participants: ['Иван Иванов', 'Мария Петрова'],
}

function renderPage() {
  return render(
    <MemoryRouter
      initialEntries={['/app/documents/company-1/doc-1']}
    >
      <Routes>
        <Route
          path="/app/documents/:id/:docId"
          element={<DocumentDetailPage />}
        />
        <Route
          path="/app/documents/:id"
          element={<div>Список документов</div>}
        />
        <Route
          path="/app/chats/:id"
          element={<div>Страница чата</div>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

function mockQueries({
  companyData = company,
  documentData = document,
  loading = false,
}: {
  companyData?: typeof company | null
  documentData?: DocumentFixture | null
  loading?: boolean
} = {}) {
  mockUseQuery.mockImplementation(
    ({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === 'company') {
        return {
          data: companyData,
          isLoading: false,
        }
      }

      if (queryKey[0] === 'document') {
        return {
          data: documentData,
          isLoading: loading,
        }
      }

      return {
        data: undefined,
        isLoading: false,
      }
    },
  )
}

describe('DocumentDetailPage — интеграционные тесты', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockQueries()
  })

  it('отображает название документа без расширения', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Протокол встречи' }),
    ).toBeInTheDocument()
  })

  it('отображает название компании и тип документа', () => {
    renderPage()

    expect(
      screen.getByText(/Компания «Тестовая компания»/),
    ).toBeInTheDocument()

    expect(
      screen.getAllByText(/PDF/).length,
    ).toBeGreaterThan(0)
  })

  it('отображает краткое содержание документа', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Краткое содержание' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Команда обсудила запуск нового продукта.'),
    ).toBeInTheDocument()
  })

  it('отображает транскрипт и его фрагменты', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Транскрипт' }),
    ).toBeInTheDocument()

    expect(screen.getByText('12:40')).toBeInTheDocument()
    expect(screen.getByText('18:15')).toBeInTheDocument()

    expect(
      screen.getByText('Начинаем подготовку проекта.'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Согласуем сроки запуска.'),
    ).toBeInTheDocument()
  })

  it('отображает участников встречи', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Участники встречи' }),
    ).toBeInTheDocument()

    expect(screen.getAllByText('Иван Иванов').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Мария Петрова').length).toBeGreaterThan(0)
  })

  it('отображает информацию о доступе к документу', () => {
    renderPage()

    expect(
      screen.getByText(/Доступ: участники «Тестовая компания»/),
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Документ не виден другим компаниям/),
    ).toBeInTheDocument()
  })

  it('отображает метаданные PDF-документа', () => {
    renderPage()

    expect(screen.getByText('15 страниц')).toBeInTheDocument()
    expect(screen.getByText(/25 МБ/)).toBeInTheDocument()
    expect(screen.getByText('Готов')).toBeInTheDocument()
  })

  it('показывает состояние загрузки, пока загружается документ', () => {
    mockQueries({ loading: true })

    renderPage()

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Протокол встречи' }),
    ).not.toBeInTheDocument()
  })

  it('показывает состояние загрузки, если документ отсутствует', () => {
    mockQueries({ documentData: null })

    renderPage()

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Протокол встречи' }),
    ).not.toBeInTheDocument()
  })

  it('показывает состояние загрузки, если компания отсутствует', () => {
    mockQueries({ companyData: null })

    renderPage()

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Протокол встречи' }),
    ).not.toBeInTheDocument()
  })

  it('содержит ссылку для возврата к списку документов', () => {
    renderPage()

    expect(
      screen.getByRole('link', { name: /К документам/ }),
    ).toHaveAttribute('href', '/app/documents/company-1')
  })

  it('содержит ссылку на чат компании по кнопке «Спросить ИИ»', () => {
    renderPage()

    expect(
      screen.getByRole('link', { name: /Спросить ИИ/ }),
    ).toHaveAttribute('href', '/app/chats/company-1')
  })

  it('отображает видеоплеер для видео', () => {
    mockQueries({
      documentData: {
        ...document,
        mime_type: 'video/mp4',
        duration: '25 мин',
      },
    })

    renderPage()

    expect(screen.getByText(/Видео/)).toBeInTheDocument()
    expect(screen.getByText('00:00 / 25 мин')).toBeInTheDocument()
  })

  it('отображает аудиоплеер для аудио', () => {
    mockQueries({
      documentData: {
        ...document,
        mime_type: 'audio/mpeg',
        duration: '18 мин',
      },
    })

    renderPage()

    expect(screen.getByText(/Аудио/)).toBeInTheDocument()
    expect(screen.getByText('00:00 / 18 мин')).toBeInTheDocument()
  })

  it('не отображает медиаплеер для PDF', () => {
    renderPage()

    expect(screen.queryByText(/00:00/)).not.toBeInTheDocument()
  })

  it('использует стандартное содержание, если summary отсутствует', () => {
    mockQueries({
      documentData: {
        ...document,
        summary: '',
      },
    })

    renderPage()

    expect(
      screen.getByText(/Команда согласовала сроки запуска Atlas/),
    ).toBeInTheDocument()
  })

  it('использует стандартный транскрипт, если он отсутствует', () => {
    mockQueries({
      documentData: {
        ...document,
        transcript: undefined,
      },
    })

    renderPage()

    expect(
      screen.getAllByText('Алексей Смирнов').length,
    ).toBeGreaterThan(0)

    expect(
      screen.getAllByText('Мария Крылова').length,
    ).toBeGreaterThan(0)
  })

  it('использует стандартный список участников, если он отсутствует', () => {
    mockQueries({
      documentData: {
        ...document,
        participants: undefined,
      },
    })

    renderPage()

    expect(screen.getAllByText('Алексей Смирнов').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Илья Волков').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Анна Лебедева').length).toBeGreaterThan(0)
  })
})
