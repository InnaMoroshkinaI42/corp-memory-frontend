
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'
import { ChatBubbleIcon } from '@radix-ui/react-icons'

describe('EmptyState', () => {
  it('отображает заголовок', () => {
    render(<EmptyState title="Нет данных" />)

    expect(screen.getByText('Нет данных')).toBeInTheDocument()
  })

  it('отображает описание', () => {
    render(
      <EmptyState
        title="Нет данных"
        description="Здесь пока ничего нет"
      />,
    )

    expect(
      screen.getByText('Здесь пока ничего нет'),
    ).toBeInTheDocument()
  })

  it('не отображает описание, если оно не передано', () => {
    render(<EmptyState title="Нет данных" />)

    expect(
      screen.queryByText('Здесь пока ничего нет'),
    ).not.toBeInTheDocument()
  })

  it('отображает иконку, если она передана', () => {
    const { container } = render(
      <EmptyState title="Нет данных" icon={ChatBubbleIcon} />,
    )

    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
