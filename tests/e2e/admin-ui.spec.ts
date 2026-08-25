import { expect, type Locator, type Page, test } from '@playwright/test';
import {
	END_ID,
	END_NAME,
	selectLocation,
	START_ID,
	START_NAME,
	waitForHydration
} from './testData';

const qrBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';

async function login(page: Page) {
	await page.goto('/auth');
	await waitForHydration(page);
	const form = page.locator('form[action="?/login"]');
	await form.locator('input[name="email"]').fill(process.env.E2E_TEST_EMAIL ?? 'test@t.t');
	await form.locator('input[name="password"]').fill(process.env.E2E_TEST_PASSWORD ?? 'test');
	await form.getByRole('button', { name: 'Přihlásit se' }).click();
	await expect(page).toHaveURL('/sec');
}

async function logout(page: Page) {
	await page.context().request.post('/auth?/logout', {
		failOnStatusCode: false,
		form: {},
		maxRedirects: 0
	});
}

async function expectGeneratedQr(image: Locator, expectedUrl: string) {
	await expect(image).toBeVisible();
	await expect(image).toHaveAttribute('data-qr-url', expectedUrl);

	const qr = await image.evaluate(async (element) => {
		const imageElement = element as HTMLImageElement;
		const svg = await (await fetch(imageElement.src)).text();
		return {
			complete: imageElement.complete,
			naturalWidth: imageElement.naturalWidth,
			source: imageElement.src,
			svg
		};
	});

	expect(qr.complete).toBe(true);
	expect(qr.naturalWidth).toBeGreaterThan(0);
	expect(qr.source).toMatch(/^data:image\/svg\+xml/);
	expect(qr.svg).toContain('<svg');
	expect(qr.svg).toContain('data:image/png');
}

test('secured group rows can be reordered with drag and drop and persisted', async ({ page }) => {
	try {
		await login(page);
		await page.goto('/sec/groups');
		await waitForHydration(page);

		const rows = page.locator('tbody tr');
		await expect(rows).toHaveCount(2);
		await expect(rows.nth(0).locator('input[type="text"]')).toHaveValue('Ostatní');
		await expect(rows.nth(1).locator('input[type="text"]')).toHaveValue('Testovací skupina');

		const sourceBox = await rows.nth(0).locator('td').last().boundingBox();
		const targetBox = await rows.nth(1).locator('td').last().boundingBox();
		expect(sourceBox).not.toBeNull();
		expect(targetBox).not.toBeNull();
		const sourceX = (sourceBox?.x ?? 0) + (sourceBox?.width ?? 0) / 2;
		const sourceY = (sourceBox?.y ?? 0) + (sourceBox?.height ?? 0) / 2;
		const targetX = (targetBox?.x ?? 0) + (targetBox?.width ?? 0) / 2;
		const targetY = (targetBox?.y ?? 0) + (targetBox?.height ?? 0) - 5;
		await page.mouse.move(sourceX, sourceY);
		await page.mouse.down();
		await page.waitForTimeout(100);
		await page.mouse.move(sourceX, sourceY + 10, { steps: 4 });
		await page.mouse.move(targetX, targetY, { steps: 16 });
		await page.waitForTimeout(250);
		await page.mouse.up();

		await expect(rows.nth(0).locator('input[type="text"]')).toHaveValue('Testovací skupina');
		await expect(rows.nth(0).locator('td').last()).toHaveText('1');
		await expect(rows.nth(1).locator('td').last()).toHaveText('2');

		const patchResponses: number[] = [];
		page.on('response', (response) => {
			if (
				response.request().method() === 'PATCH' &&
				new URL(response.url()).pathname === '/api/groups'
			) {
				patchResponses.push(response.status());
			}
		});
		await page.getByRole('button', { name: 'Uložit změny' }).click();
		await expect(page.locator('#success-dialog')).toBeVisible();
		await expect.poll(() => patchResponses).toEqual([200, 200]);

		await page.getByRole('button', { name: 'Ok' }).click();
		await expect(page).toHaveURL('/sec');
		await page.goto('/sec/groups');
		await expect(page.locator('tbody tr').nth(0).locator('input[type="text"]')).toHaveValue(
			'Testovací skupina'
		);
	} finally {
		await logout(page);
	}
});

test('marker QR print page generates decodable SVG images with the embedded logo', async ({
	page
}) => {
	try {
		await login(page);
		await page.goto('/sec/markers');
		await waitForHydration(page);
		await page.getByRole('button', { name: 'Vytisknout všechny QR kódy' }).click();

		await expect(page).toHaveURL('/sec/markers/print');
		const qrImages = page.locator('img[data-qr-url]');
		await expect(qrImages).toHaveCount(3);
		await expectGeneratedQr(
			page.getByRole('img', { name: `QR kód pro ${START_NAME}` }),
			`${qrBaseUrl}/map/${START_ID}`
		);
	} finally {
		await logout(page);
	}
});

test('route QR generation preserves the complete two-endpoint map URL', async ({ page }) => {
	try {
		await login(page);
		await page.goto('/sec/paths');
		await waitForHydration(page);
		await selectLocation(page, '#from', START_NAME);
		await selectLocation(page, '#to', END_NAME);
		await page.getByRole('button', { name: 'Vytisknout QR kód', exact: true }).click();

		await expect(page).toHaveURL('/sec/markers/print');
		const routeQr = page.getByRole('img', { name: `QR kód pro ${START_NAME} → ${END_NAME}` });
		await expect(page.locator('img[data-qr-url]')).toHaveCount(1);
		await expectGeneratedQr(routeQr, `${qrBaseUrl}/map/${START_ID}/${END_ID}`);
	} finally {
		await logout(page);
	}
});
