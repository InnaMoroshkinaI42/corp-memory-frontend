
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PersonalDataCard } from './PersonalDataCard'

// Заглушка для метода прокрутки, отсутствующего в jsdom
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: vi.fn(),
})
const user = {
  first_name: 'Алексей',
  last_name: 'Морозов',
  email: 'a.morozov@nordwind.ru',
}
const userData = {
  first_name: 'Алексей',
  last_name: 'Морозов',
  email: 'a.morozov@nordwind.ru',
}

describe('PersonalDataCard', () => {
  it('отображает заголовок карточки', () => {
    render(<PersonalDataCard user={user} />)

    expect(screen.getByText('Личные данные')).toBeInTheDocument()
  })

  it('отображает имя и фамилию пользователя', () => {
    render(<PersonalDataCard user={user} />)

    expect(
      screen.getByDisplayValue('Алексей Морозов')
    ).toBeInTheDocument()
  })

  it('отображает email пользователя', () => {
    render(<PersonalDataCard user={user} />)

    expect(
      screen.getByDisplayValue('a.morozov@nordwind.ru')
    ).toBeInTheDocument()
  })

  it('формирует инициалы пользователя', () => {
    render(<PersonalDataCard user={user} />)

    expect(screen.getByText('АМ')).toBeInTheDocument()
  })

  it('отображает кнопку изменения фотографии', () => {
    render(<PersonalDataCard user={user} />)

    expect(
      screen.getByRole('button', { name: 'Изменить фото' })
    ).toBeInTheDocument()
  })

  it('отображает кнопку сохранения изменений', () => {
    render(<PersonalDataCard user={user} />)

    expect(
      screen.getByRole('button', { name: 'Сохранить изменения' })
    ).toBeInTheDocument()
  })

 it('отображает доступные языки интерфейса', async () => {
  const user = userEvent.setup()
  render(<PersonalDataCard user={userData} />)

  const selects = screen.getAllByRole('combobox')

  selects[0].focus()
  await user.keyboard('{ArrowDown}')

  expect(
    await screen.findByRole('option', { name: 'English' })
  ).toBeInTheDocument()
})

it('отображает доступные часовые пояса', async () => {
  const user = userEvent.setup()
  render(<PersonalDataCard user={userData} />)

  const selects = screen.getAllByRole('combobox')

  selects[1].focus()
  await user.keyboard('{ArrowDown}')

  expect(
    await screen.findByRole('option', { name: 'Берлин · UTC+2' })
  ).toBeInTheDocument()
})

})
