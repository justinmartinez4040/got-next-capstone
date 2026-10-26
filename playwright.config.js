import { defineConfig } from '@playwright/test'

// Lets test helpers talk to Supabase with the same values as the app.
process.loadEnvFile('.env')

export default defineConfig({
  testDir: './tests',
  // Tests share one real Supabase project, so run them one at a time.
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    // Fixed so expected time text is the same on every machine.
    timezoneId: 'America/New_York',
    locale: 'en-US',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
