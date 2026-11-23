import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDirectory, '../..')
const screenshotDirectory = path.join(repositoryRoot, 'docs/screenshots')

const websiteUrl = process.env.SCREENSHOT_URL || 'https://jameshsims.tech/'

const configurations = [
  {
    name: 'desktop',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  {
    name: 'mobile',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  },
]

async function captureScreenshot(browser, configuration) {
  const context = await browser.newContext({
    viewport: configuration.viewport,
    deviceScaleFactor: configuration.deviceScaleFactor,
    isMobile: configuration.isMobile,
    hasTouch: configuration.hasTouch,
    reducedMotion: 'reduce',
  })

  try {
    const page = await context.newPage()

    console.log(`Capturing ${configuration.name} screenshot...`)

    const response = await page.goto(websiteUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    if (!response || !response.ok()) {
      throw new Error(
        `Website failed to load: HTTP ${response?.status() ?? 'unknown'}`
      )
    }

    await page.locator('body').waitFor({ state: 'visible' })

    // Wait for the portfolio's project loading state to finish.
    if (new URL(websiteUrl).hostname === 'jameshsims.tech') {
      await page.locator('#projects .projects-card').first().waitFor({
        state: 'visible',
        timeout: 45000,
      })
    }

    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const filename = `${configuration.name}.png`
    const outputPath = path.join(screenshotDirectory, filename)

    await page.screenshot({
      path: outputPath,
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    })

    console.log(`Saved: docs/screenshots/${filename}`)
  } finally {
    await context.close()
  }
}

async function main() {
  await mkdir(screenshotDirectory, { recursive: true })

  const browser = await chromium.launch({ headless: true })

  try {
    for (const configuration of configurations) {
      await captureScreenshot(browser, configuration)
    }

    console.log('All screenshots captured successfully.')
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error('Screenshot capture failed:', error)
  process.exitCode = 1
})
