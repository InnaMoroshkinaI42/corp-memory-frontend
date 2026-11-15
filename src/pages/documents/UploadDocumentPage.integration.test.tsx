
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import { UploadDocumentPage } from './UploadDocumentPage'

const FILE_NAME = 'integration-document.txt'
const TEXT_TITLE = 'Интеграционная текстовая запись'

interface UploadedDocument {
  uuid: string
  company_id: string
  user_id: string
  original_name: string
  mime_type: string
  status: string
  title: string
  language: string
  content?: string
}

function LocationProbe() {
  const location = useLocation()

  return (
    <div data-testid="current-location">
      {location.pathname}
    </div>
  )
}

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

        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

async function getCompanyDocuments(): Promise<UploadedDocument[]> {
  const response = await fetch(
    'http://localhost/api/companies/c-1/documents',
  )

  expect(response.ok).toBe(true)

  return response.json()
}

afterEach(() => {
  cleanup()
})

describe('UploadDocumentPage — интеграция с API', () => {
  
it('загружает файл, сохраняет его в mock-базе и перенаправляет на документы', async () => {
  const user = userEvent.setup()

  const documentsBeforeUpload = await getCompanyDocuments()

  renderPage()

  await screen.findByText(
    /Новые материалы попадут в память компании/,
  )

  await user.type(
    screen.getByLabelText('Название документа'),
    'Тестовый файл',
  )

  const file = new File(
    ['Содержимое интеграционного файла'],
    FILE_NAME,
    { type: 'text/plain' },
  )

  const fileInput = document.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement

  await user.upload(fileInput, file)

  expect(
    await screen.findByText(FILE_NAME),
  ).toBeInTheDocument()

  await user.click(
    screen.getByRole('button', {
      name: /Загрузить и обработать/i,
    }),
  )

  await screen.findByRole('heading', {
    name: 'Список документов',
  })

  await waitFor(async () => {
    const documentsAfterUpload = await getCompanyDocuments()

    expect(documentsAfterUpload).toHaveLength(
      documentsBeforeUpload.length + 1,
    )

    const uploadedDocument = documentsAfterUpload.find(
      document => document.title === 'Тестовый файл',
    )

    expect(uploadedDocument).toBeDefined()

    expect(uploadedDocument).toMatchObject({
      company_id: 'c-1',
      user_id: 'u-1',
      title: 'Тестовый файл',
      mime_type: 'text/plain',
      status: 'UPLOAD',
      language: 'Русский',
    })

    expect(uploadedDocument?.original_name).toBeTruthy()
  })

  expect(
    screen.getByTestId('current-location'),
  ).toHaveTextContent('/app/documents/c-1')
})


  it('сохраняет текстовую запись с содержимым в mock-базе', async () => {
    const user = userEvent.setup()

    const documentsBeforeUpload = await getCompanyDocuments()

    renderPage()

    await screen.findByText(
      /Новые материалы попадут в память компании/,
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Текстовая запись',
      }),
    )

    await user.type(
      screen.getByLabelText('Текст документа'),
      'Содержимое интеграционной текстовой записи',
    )

    await user.type(
      screen.getByLabelText('Название документа'),
      TEXT_TITLE,
    )

    await user.click(
      screen.getByRole('button', {
        name: /Загрузить и обработать/i,
      }),
    )

    await screen.findByRole('heading', {
      name: 'Список документов',
    })

    await waitFor(async () => {
      const documentsAfterUpload = await getCompanyDocuments()

      expect(documentsAfterUpload).toHaveLength(
        documentsBeforeUpload.length + 1,
      )

      const uploadedDocument = documentsAfterUpload.find(
        document => document.original_name === TEXT_TITLE,
      )

      expect(uploadedDocument).toBeDefined()

      expect(uploadedDocument).toMatchObject({
        company_id: 'c-1',
        user_id: 'u-1',
        original_name: TEXT_TITLE,
        mime_type: 'text/plain',
        status: 'UPLOAD',
        content: 'Содержимое интеграционной текстовой записи',
        language: 'Русский',
      })
    })

    expect(
      screen.getByTestId('current-location'),
    ).toHaveTextContent('/app/documents/c-1')
  })
})
