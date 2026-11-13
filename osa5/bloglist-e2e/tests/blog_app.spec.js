const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

// Testikäyttäjän salasana on vain testitietokantaa varten
const mluukkai = {
  name: 'Matti Luukkainen',
  username: 'mluukkai',
  password: 'salainen'
}

// 5.28: reitittävän sovelluksen E2E-testit
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', { data: mluukkai })

    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, mluukkai.username, mluukkai.password)

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      // kirjautumisen jälkeen näytetään kaikkien blogien lista
      await expect(page).toHaveURL(/\/$/)
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, mluukkai.username, 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      // virheilmoitus näytetään MUI:n error-tyyppisenä Alertina
      await expect(errorDiv).toHaveClass(/MuiAlert-.*Error/)

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, mluukkai.username, mluukkai.password)
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'Playwright testing',
        author: 'Test Author',
        url: 'https://playwright.dev/'
      })

      await expect(page).toHaveURL(/\/$/)
      await expect(page.locator('.success')).toContainText(
        'a new blog Playwright testing by Test Author added'
      )
      await expect(
        page.getByRole('link', { name: 'Playwright testing' })
      ).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'Existing blog',
          author: 'Some Author',
          url: 'https://example.com/'
        })
      })

      test('it can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'Existing blog' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 2')).toBeVisible()
      })

      test('it can be deleted', async ({ page }) => {
        await page.getByRole('link', { name: 'Existing blog' }).click()

        page.on('dialog', (dialog) => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        // poiston jälkeen palataan blogilistaan, josta blogi on poistunut
        await expect(page).toHaveURL(/\/$/)
        await expect(
          page.getByRole('link', { name: 'Existing blog' })
        ).toHaveCount(0)
      })
    })
  })
})
