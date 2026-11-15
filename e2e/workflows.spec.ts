
import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('login')

  await expect(
    page.getByRole('heading', { name: 'С возвращением' })
  ).toBeVisible()

  await page.getByRole('button', { name: 'Войти' }).click()

  await expect(
    page.getByRole('heading', { name: 'Мои компании' })
  ).toBeVisible()
}

test.describe('Основные пользовательские сценарии', () => {
  test('создаёт компанию и открывает её обзор', async ({ page }) => {
    await login(page)

    await page.getByRole('button', { name: 'Создать компанию' }).click()

    await expect(
      page.getByRole('heading', { name: 'Создать компанию' })
    ).toBeVisible()

    const companyName = 'Компания E2E Проверка'

    await page.getByLabel('Название компании *').fill(companyName)
    await page.getByLabel('Описание').fill(
      'Компания для автоматического E2E-тестирования'
    )
    await page.getByLabel('Рабочий домен').fill('e2e-test.example')

    await page.getByRole('button', { name: 'Создать компанию' }).click()

    await expect(page).toHaveURL(/\/app\/overview\//)
    await expect(page.getByText(companyName).first()).toBeVisible()
  })

  test('отправляет заявку на вступление в компанию', async ({ page }) => {
    await login(page)

    await page.getByRole('button', { name: 'Вступить в компанию' }).click()

    await expect(
      page.getByRole('heading', { name: 'Вступить в компанию' })
    ).toBeVisible()

    await page.getByLabel('ID компании').fill('c-2')

    await expect(
      page.getByText('Skyline Retail').first()
    ).toBeVisible()

    await page.getByLabel('Сообщение владельцу').fill(
      'Хочу присоединиться к команде.'
    )

    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/api/companies/c-2/join-requests') &&
      response.request().method() === 'POST'
    )

    await page.getByRole('button', { name: 'Отправить запрос' }).click()

    const response = await responsePromise

    expect(response.status()).toBe(201)

    await expect(
      page.getByText(/Запрос на вступление в «Skyline Retail» отправлен/)
    ).toBeVisible()
  })

  test('загружает файл и открывает список документов', async ({ page }) => {
    await login(page)

    await page.goto('app/documents/upload/c-1')

    await expect(
      page.getByRole('heading', { name: 'Загрузить документ' })
    ).toBeVisible()

    const fileName = 'e2e-meeting-notes.txt'

    await page.locator('#file-input').setInputFiles(
      'e2e/fixtures/e2e-meeting-notes.txt'
    )

    await expect(page.getByText(fileName)).toBeVisible()

    await page.getByLabel('Название документа').fill(
      'Материалы встречи E2E'
    )

    await page.getByRole('button', {
      name: 'Загрузить и обработать'
    }).click()

    await expect(page).toHaveURL(/\/app\/documents\/c-1$/)

    await expect(
      page.getByRole('heading', { name: 'Документы' })
    ).toBeVisible()
  })

  test('отправляет сообщение в существующий чат', async ({ page }) => {
    await login(page)

    await page.goto('app/chats/c-1/ch-1')

    const question = 'Что решили по запуску проекта E2E?'

    const input = page.getByPlaceholder(
      'Задайте вопрос по материалам компании...'
    )

    await expect(input).toBeVisible()

    await input.fill(question)

    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/api/chats/ch-1/messages') &&
      response.request().method() === 'POST'
    )

    await page.getByRole('button', { name: /Отправить/i }).click()

    const response = await responsePromise

    expect(response.ok()).toBeTruthy()
  })
})
