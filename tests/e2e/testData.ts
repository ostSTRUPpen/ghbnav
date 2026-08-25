import type { Page } from '@playwright/test';

export const START_ID = '11111111-1111-4111-8111-111111111111';
export const END_ID = '22222222-2222-4222-8222-222222222222';
export const START_NAME = 'Testovací vstup';
export const END_NAME = 'Testovací cíl';

export async function waitForHydration(page: Page) {
	await page.waitForLoadState('networkidle');
}

export async function selectLocation(page: Page, input: '#from' | '#to', name: string) {
	const selectInput = page.locator(input);
	await selectInput.fill(name);
	await page.locator('.svelte-select-list .list-item').filter({ hasText: name }).click();
}

export async function dismissCookieBanner(page: Page) {
	const acceptButton = page.getByRole('button', { name: 'Rozumím' });
	if (await acceptButton.isVisible()) await acceptButton.click();
}
