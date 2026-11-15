
import { describe, it, expect, afterEach } from 'vitest'
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { CreateCompanyPage } from './CreateCompanyPage'
import { db } from '@/shared/api/mocks/db'

const TEST_COMPANY_NAME = 'Тестовая интеграционная компания'

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
      <MemoryRouter initialEntries={['/companies/create']}>
        <CreateCompanyPage />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

afterEach(() => {
  cleanup()

  db.companies = db.companies.filter(
    company => company.name !== TEST_COMPANY_NAME,
  )
})

describe('CreateCompanyPage — интеграционный тест', () => {
  it(
    'создаёт компанию через API и перенаправляет на её страницу',
    async () => {
      renderPage()

      await screen.findByRole('heading', {
        name: 'Создать компанию',
      })

      fireEvent.change(
        screen.getByLabelText(/название компании/i),
        {
          target: {
            value: `  ${TEST_COMPANY_NAME}  `,
          },
        },
      )

      fireEvent.change(
        screen.getByLabelText(/описание/i),
        {
          target: {
            value: 'Описание тестовой компании',
          },
        },
      )

      fireEvent.change(
        screen.getByLabelText(/рабочий домен/i),
        {
          target: {
            value: 'integration-test.team',
          },
        },
      )

      fireEvent.click(
        screen.getByRole('button', {
          name: /создать компанию/i,
        }),
      )

      await waitFor(() => {
        expect(
          db.companies.some(
            company => company.name === TEST_COMPANY_NAME,
          ),
        ).toBe(true)
      })

      const createdCompany = db.companies.find(
        company => company.name === TEST_COMPANY_NAME,
      )

      expect(createdCompany).toBeDefined()

      expect(createdCompany).toMatchObject({
        name: TEST_COMPANY_NAME,
        description: 'Описание тестовой компании',
        domain: 'integration-test.team',
        owner_id: 'u-1',
      })

      await waitFor(() => {
        expect(
          screen.getByTestId('current-location'),
        ).toHaveTextContent(
          `/app/overview/${createdCompany?.uuid}`,
        )
      })
    },
    10000,
  )
})
