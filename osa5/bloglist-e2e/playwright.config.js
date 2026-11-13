// @ts-check
const { defineConfig, devices } = require('@playwright/test')

// E2E-testit käynnistävät omat palvelimensa erillisiin portteihin, jotta ne
// eivät sekoitu kehityspalvelimiin (backend 3003, frontend 5173).
const BACKEND_PORT = 3004
const FRONTEND_PORT = 5184

module.exports = defineConfig({
  testDir: './tests',
  timeout: 10000,
  // testit jakavat saman tietokannan, joten ne ajetaan yksi kerrallaan
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${FRONTEND_PORT}`,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: [
    {
      // osan 4 backend testitilassa (testitietokanta + /api/testing/reset)
      command: 'npm run start:test',
      cwd: '../../osa4/bloglist',
      url: `http://localhost:${BACKEND_PORT}/api/blogs`,
      env: { PORT: String(BACKEND_PORT) },
      reuseExistingServer: false,
      timeout: 60000
    },
    {
      command: `npx vite --port ${FRONTEND_PORT} --strictPort`,
      cwd: '../bloglist-frontend',
      url: `http://localhost:${FRONTEND_PORT}`,
      env: { BACKEND_URL: `http://localhost:${BACKEND_PORT}` },
      reuseExistingServer: false,
      timeout: 60000
    }
  ]
})
