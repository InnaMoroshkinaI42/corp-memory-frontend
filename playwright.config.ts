
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',

  fullyParallel: false,

  // Отчёты
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],
  ],

  // Папка с результатами тестов
  outputDir: 'test-results',

  use: {
    baseURL: 'http://127.0.0.1:5294/corp-memory-frontend/',

    // Материалы сохраняются при ошибках
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  // Запуск Vite перед тестированием
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5294/corp-memory-frontend/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
