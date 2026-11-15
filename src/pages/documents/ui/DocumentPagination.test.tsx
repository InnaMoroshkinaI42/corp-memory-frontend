
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocumentPagination } from './DocumentPagination'

describe('DocumentPagination', () => {
  it('отображает количество документов на текущей странице', () => {
    render(
      <DocumentPagination
        total={45}
        currentPage={2}
        pageSize={10}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    )

    expect(
      screen.getByText('Показано 11–20 из 45 документов'),
    ).toBeInTheDocument()
  })

  it('отображает номера всех страниц', () => {
    render(
      <DocumentPagination
        total={45}
        currentPage={1}
        pageSize={10}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    )

    for (let page = 1; page <= 5; page++) {
      expect(
        screen.getByRole('button', { name: String(page) }),
      ).toBeInTheDocument()
    }
  })

  it('блокирует кнопку Назад на первой странице', () => {
    render(
      <DocumentPagination
        total={45}
        currentPage={1}
        pageSize={10}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Назад' })).toBeDisabled()
  })

  it('блокирует кнопку Далее на последней странице', () => {
    render(
      <DocumentPagination
        total={45}
        currentPage={5}
        pageSize={10}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Далее' })).toBeDisabled()
  })

  it('переключает на следующую страницу', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <DocumentPagination
        total={45}
        currentPage={2}
        pageSize={10}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('переключает на предыдущую страницу', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <DocumentPagination
        total={45}
        currentPage={3}
        pageSize={10}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('переключает на выбранную страницу', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <DocumentPagination
        total={45}
        currentPage={1}
        pageSize={10}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: '4' }))

    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('не отображается, если доступна только одна страница', () => {
    const { container } = render(
      <DocumentPagination
        total={5}
        currentPage={1}
        pageSize={10}
        totalPages={1}
        onPageChange={vi.fn()}
      />,
    )

    expect(container.firstChild).toBeNull()
  })
})
