import { expect, test } from '@playwright/test';
import {
	dismissCookieBanner,
	END_ID,
	END_NAME,
	selectLocation,
	START_ID,
	START_NAME,
	waitForHydration
} from './testData';

test('homepage renders navigation data and opens a selected route', async ({ page }) => {
	const response = await page.goto('/');

	expect(response?.status()).toBe(200);
	await waitForHydration(page);
	await expect(page.getByRole('link', { name: 'GHB nav' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Mapa', exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Navigace' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Přednastavené cesty' })).toBeVisible();
	await dismissCookieBanner(page);

	const navigation = page.locator('.styled_select');
	const navigateButton = navigation.getByRole('button', { name: 'Navigovat', exact: true });
	await expect(navigateButton).toBeDisabled();

	await page.locator('#from').click();
	await expect(
		page.locator('.svelte-select-list .list-item').filter({ hasText: START_NAME })
	).toBeVisible();
	await page.keyboard.press('Escape');

	await selectLocation(page, '#from', START_NAME);
	await selectLocation(page, '#to', END_NAME);
	await expect(navigateButton).toBeEnabled();

	await navigateButton.click();
	await expect(page).toHaveURL(`/map/${START_ID}/${END_ID}`);
	await expect(page.locator('#map')).toBeVisible();
});

test('navigation selects use readable theme colors in dark mode', async ({ page }) => {
	await page.addInitScript(() => window.localStorage.setItem('theme', 'ghb_dark'));
	await page.goto('/');
	await waitForHydration(page);
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'ghb_dark');

	const input = page.locator('#from');
	await input.click();
	const option = page.locator('.svelte-select-list .item').filter({ hasText: START_NAME });
	await expect(option).toBeVisible();

	const themeTextColor = await page
		.locator('body')
		.evaluate((element) => getComputedStyle(element).color);
	await expect(input).toHaveCSS('color', themeTextColor);
	await expect(option).toHaveCSS('color', themeTextColor);
});

test('all supported direct map URL shapes survive a full page load', async ({ page }) => {
	for (const url of ['/map', `/map/${START_ID}`, `/map/${START_ID}/${END_ID}`]) {
		const response = await page.goto(url);
		const map = page.locator('#map');

		expect(response?.status(), url).toBe(200);
		await expect(map).toBeVisible();
		await expect(map).toHaveClass(/leaflet-container/);
		await expect(map.locator('.leaflet-map-pane')).toHaveCount(1);
		await expect(map.locator('.leaflet-image-layer')).not.toHaveCount(0);
	}

	const notFound = await page.goto(`/map/${START_ID}/${END_ID}/extra`);
	expect(notFound?.status()).toBe(404);
});

test('changing a map route preserves the map and avoids document/loading requests', async ({
	page
}) => {
	await page.goto(`/map/${START_ID}`);
	await waitForHydration(page);
	await expect(page.locator('#map')).toHaveClass(/leaflet-container/);
	await expect(page.locator('#map .leaflet-map-pane')).toHaveCount(1);
	const navigateButton = page.getByRole('button', { name: 'Navigovat', exact: true });
	const clearButton = page.getByRole('button', { name: 'Vymazat navigaci', exact: true });
	const [navigateBox, clearBox] = await Promise.all([
		navigateButton.boundingBox(),
		clearButton.boundingBox()
	]);
	expect(navigateBox).not.toBeNull();
	expect(clearBox).not.toBeNull();
	expect(Math.abs(navigateBox!.y - clearBox!.y)).toBeLessThanOrEqual(1);
	await page
		.locator('#map')
		.evaluate((element) => element.setAttribute('data-e2e-map', 'original'));

	const documentRequests: string[] = [];
	const loadingRequests: string[] = [];
	page.on('request', (request) => {
		if (request.isNavigationRequest()) documentRequests.push(request.url());
		if (new URL(request.url()).pathname === '/loading') loadingRequests.push(request.url());
	});

	await selectLocation(page, '#to', END_NAME);
	await page.locator('.styled_select').getByRole('button', { name: 'Navigovat' }).click();

	await expect(page).toHaveURL(`/map/${START_ID}/${END_ID}`);
	await expect(page.locator('#map')).toHaveAttribute('data-e2e-map', 'original');
	await expect(page.locator('#map .leaflet-overlay-pane path').first()).toHaveAttribute('d', /.+/);
	expect(documentRequests).toEqual([]);
	expect(loadingRequests).toEqual([]);
});

test('invalid map endpoints remain on the compatible route and show an error', async ({ page }) => {
	const response = await page.goto(`/map/not-a-marker/${END_ID}`);

	expect(response?.status()).toBe(200);
	await expect(page.getByRole('alert')).toContainText('Počáteční bod zadaný v adrese neexistuje');
});
