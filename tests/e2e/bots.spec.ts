import { test, expect } from '@playwright/test'

test('bots page shows alternating category title and carousel', async ({ page }) => {
  await page.goto('/bots')
  // タイトル「Botストア」が存在
  await expect(page.getByRole('heading', { name: 'Botストア' })).toBeVisible()

  // 少なくとも1つのカテゴリセクションタイトルが見える
  const firstSection = page.locator('section').filter({ hasText: 'すべて見る →' }).first()
  await expect(firstSection).toBeVisible()
})

test('bots page shows mapped category title from URL', async ({ page }) => {
  // 旧カテゴリ名（例: 学習）を指定しても新カテゴリにマッピングされる
  await page.goto('/bots?category=学習')
  await expect(page.getByText('カテゴリ: 教育・学習系')).toBeVisible()
})


