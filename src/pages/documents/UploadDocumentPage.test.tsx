
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UploadDocumentPage } from './UploadDocumentPage'

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/app/documents/upload/c-1']}>
        <Routes>
          <Route
            path="/app/documents/upload/:id"
            element={<UploadDocumentPage />}
          />
          <Route
            path="/app/documents/:id"
            element={<h1>Список документов</h1>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('UploadDocumentPage — интеграционные тесты', () => {
  beforeEach(() => {
    renderPage()
  })

  it('загружает выбранный файл и переходит к списку документов', async () => {
    const user = userEvent.setup()

    await screen.findByText(/Новые материалы попадут в память компании/)

    await user.type(
      screen.getByLabelText('Название документа'),
      'Тестовый документ',
    )

    const file = new File(
      ['Содержимое тестового файла'],
      'test.txt',
      { type: 'text/plain' },
    )

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    await user.upload(fileInput, file)

    await user.click(
      screen.getByRole('button', { name: /Загрузить и обработать/i }),
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Список документов',
      }),
    ).toBeInTheDocument()
  }, 10000)

  it('отправляет текстовую запись', async () => {
    const user = userEvent.setup()

    await screen.findByText(/Новые материалы попадут в память компании/)

    await user.click(
      screen.getByRole('button', { name: 'Текстовая запись' }),
    )

    await user.type(
      screen.getByLabelText('Текст документа'),
      'Содержимое тестовой заметки',
    )

    await user.type(
      screen.getByLabelText('Название документа'),
      'Тестовая заметка',
    )

    await user.click(
      screen.getByRole('button', { name: /Загрузить и обработать/i }),
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Список документов',
      }),
    ).toBeInTheDocument()
  })

  it('не отправляет пустую текстовую запись', async () => {
    const user = userEvent.setup()

    await screen.findByText(/Новые материалы попадут в память компании/)

    await user.click(
      screen.getByRole('button', { name: 'Текстовая запись' }),
    )

    await user.type(
      screen.getByLabelText('Название документа'),
      'Пустая заметка',
    )

    await user.click(
      screen.getByRole('button', { name: /Загрузить и обработать/i }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Введите текст документа',
    )

    expect(
      screen.queryByRole('heading', { name: 'Список документов' }),
    ).not.toBeInTheDocument()
  })
})
