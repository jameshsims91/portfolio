
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',

  // Run only tests intended for the deployed website.
  testMatch: '**/production.spec.js',

  // Keep production smoke tests predictable.
  fullyParallel: false,
  workers: 1,
  retries: 0,

  reporter: 'list',

  use: {
    baseURL: 'https://jameshsims.tech',
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

  // No webServer: production tests use the live deployment.
})
