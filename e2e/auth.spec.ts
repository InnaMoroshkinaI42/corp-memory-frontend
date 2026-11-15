
import { test, expect } from '@playwright/test'

test.describe('Авторизация', () => {
  test('переходит на страницу компаний после нажатия кнопки Войти', async ({ page }) => {
    await page.goto('login')

    await expect(
      page.getByRole('heading', { name: 'С возвращением' })
    ).toBeVisible()

    await page.getByRole('button', { name: 'Войти' }).click()

    await expect(
      page.getByRole('heading', { name: 'Мои компании' })
    ).toBeVisible()
  })
})
