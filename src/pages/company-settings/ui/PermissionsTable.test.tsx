
import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import { PermissionsTable } from './PermissionsTable'

describe('PermissionsTable', () => {
  it('отображает заголовок и описание таблицы', () => {
    render(<PermissionsTable />)

    expect(screen.getByText('Роли и доступы'))
      .toBeInTheDocument()

    expect(
      screen.getByText(
        'Общие правила для всех документов и чатов компании',
      ),
    ).toBeInTheDocument()
  })

  it('отображает все роли', () => {
    render(<PermissionsTable />)

    expect(screen.getByText('Владелец')).toBeInTheDocument()
    expect(screen.getByText('Администратор')).toBeInTheDocument()
    expect(screen.getByText('Участник')).toBeInTheDocument()
    expect(screen.getByText('Наблюдатель')).toBeInTheDocument()
  })

  it('отображает все четыре разрешения', () => {
    render(<PermissionsTable />)

    expect(screen.getByText('Просматривать и спрашивать ИИ'))
      .toBeInTheDocument()

    expect(screen.getByText('Загружать и редактировать документы'))
      .toBeInTheDocument()

    expect(screen.getByText('Приглашать и управлять участниками'))
      .toBeInTheDocument()

    expect(screen.getByText('Одобрять запросы, менять настройки'))
      .toBeInTheDocument()
  })

  it('отображает все права владельца включенными и недоступными для изменения', () => {
    render(<PermissionsTable />)

    const rows = screen.getAllByRole('row')
    const permissionRows = rows.slice(1)

    permissionRows.forEach((row) => {
      const checkboxes = within(row).getAllByRole('checkbox')

      expect(checkboxes[0]).toBeChecked()
      expect(checkboxes[0]).toBeDisabled()
    })
  })

  it('отображает начальные права администратора', () => {
    render(<PermissionsTable />)

    const rows = screen.getAllByRole('row')

    const expectedValues = [true, true, true, false]

    rows.slice(1).forEach((row, index) => {
      const checkboxes = within(row).getAllByRole('checkbox')

      expect(checkboxes[1]).toHaveProperty(
        'checked',
        expectedValues[index],
      )
    })
  })

  it('позволяет изменить право администратора', () => {
    render(<PermissionsTable />)

    const row = screen.getByText(
      'Одобрять запросы, менять настройки',
    ).closest('tr')

    const checkboxes = within(row!).getAllByRole('checkbox')
    const adminCheckbox = checkboxes[1]

    expect(adminCheckbox).not.toBeChecked()

    fireEvent.click(adminCheckbox)

    expect(adminCheckbox).toBeChecked()
  })

  it('позволяет изменить право участника и наблюдателя', () => {
    render(<PermissionsTable />)

    const row = screen.getByText(
      'Приглашать и управлять участниками',
    ).closest('tr')

    const checkboxes = within(row!).getAllByRole('checkbox')

    const memberCheckbox = checkboxes[2]
    const viewerCheckbox = checkboxes[3]

    expect(memberCheckbox).not.toBeChecked()
    expect(viewerCheckbox).not.toBeChecked()

    fireEvent.click(memberCheckbox)
    fireEvent.click(viewerCheckbox)

    expect(memberCheckbox).toBeChecked()
    expect(viewerCheckbox).toBeChecked()
  })

  it('изменение одного разрешения не затрагивает остальные', () => {
    render(<PermissionsTable />)

    const editRow = screen.getByText(
      'Загружать и редактировать документы',
    ).closest('tr')

    const inviteRow = screen.getByText(
      'Приглашать и управлять участниками',
    ).closest('tr')

    const editCheckboxes = within(editRow!).getAllByRole('checkbox')
    const inviteCheckboxes = within(inviteRow!).getAllByRole('checkbox')

    fireEvent.click(editCheckboxes[2])

    expect(editCheckboxes[2]).not.toBeChecked()

    expect(inviteCheckboxes[2]).not.toBeChecked()
    expect(inviteCheckboxes[3]).not.toBeChecked()
  })

  it('отображает информацию о конфиденциальности данных', () => {
    render(<PermissionsTable />)

    expect(
      screen.getByText(
        'Материалы не доступны другим компаниям. ИИ не использует данные компании для обучения.',
      ),
    ).toBeInTheDocument()
  })
})
