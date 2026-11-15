
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { CompanyProfileCard } from './CompanyProfileCard'
import { db } from '@/shared/api/mocks/db'

const company = db.companies.find((item) => item.uuid === 'c-1')!

const originalData = {
  name: company.name,
  description: company.description,
  domain: company.domain,
}

function renderComponent() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <CompanyProfileCard company={company} />
    </QueryClientProvider>,
  )
}

afterEach(() => {
  // Возвращаем исходные данные компании,
  // чтобы тест не изменял общую mock-базу.
  Object.assign(company, originalData)
})

describe('CompanyProfileCard — интеграционный тест', () => {
  it('сохраняет изменения компании через API', async () => {
    const user = userEvent.setup()

    renderComponent()

    // Изменяем название.
    const nameInput = screen.getByLabelText('Название компании')
    await user.clear(nameInput)
    await user.type(nameInput, 'Обновлённая компания')

    // Изменяем описание.
    const descriptionInput = screen.getByLabelText('Описание')
    await user.clear(descriptionInput)
    await user.type(descriptionInput, 'Новое описание компании')

    // Изменяем домен.
    const domainInput = screen.getByLabelText('Рабочий домен')
    await user.clear(domainInput)
    await user.type(domainInput, 'updated-company.team')

    // Сохраняем изменения.
    await user.click(
      screen.getByRole('button', {
        name: 'Сохранить изменения',
      }),
    )

    // Проверяем, что MSW обработал PUT и изменил mock-базу.
    await waitFor(() => {
      expect(company).toMatchObject({
        name: 'Обновлённая компания',
        description: 'Новое описание компании',
        domain: 'updated-company.team',
      })
    })

    // Проверяем сообщение об успешном сохранении.
    expect(
      await screen.findByText('Изменения успешно сохранены'),
    ).toBeInTheDocument()
  })
})
