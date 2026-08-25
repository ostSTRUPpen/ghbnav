import { expect, test } from '@playwright/test';
import { waitForHydration } from './testData';

const SESSION_COOKIE_NAME = 'zi67OR1pZpQi3GVNMk96WO';
const securedPages = [
	'/sec',
	'/sec/markers',
	'/sec/markers/print',
	'/sec/paths',
	'/sec/paths/all',
	'/sec/groups'
];

test('anonymous requests cannot read secured pages', async ({ request }) => {
	for (const url of securedPages) {
		const response = await request.get(url, { maxRedirects: 0 });

		expect(response.status(), url).toBe(303);
		expect(response.headers().location, url).toBe('/');
		expect(response.headers()['set-cookie'], url).toContain(`${SESSION_COOKIE_NAME}=;`);
		expect(response.headers()['cdn-cache-control'], url).toBeUndefined();
		expect(response.headers()['vercel-cdn-cache-control'], url).toBeUndefined();
	}
});

test('anonymous requests cannot call mutating administration APIs', async ({ request }) => {
	const protectedRequests = [
		{ method: 'PATCH', url: '/api/change_markers' },
		{ method: 'PATCH', url: '/api/groups' },
		{ method: 'PATCH', url: '/api/preset_paths' },
		{ method: 'PATCH', url: '/api/dynamic_paths' },
		{ method: 'DELETE', url: '/api/dynamic_paths' }
	];

	for (const protectedRequest of protectedRequests) {
		const response = await request.fetch(protectedRequest.url, {
			method: protectedRequest.method,
			data: {}
		});

		expect(response.status(), protectedRequest.url).toBe(401);
		expect(await response.json(), protectedRequest.url).toEqual({
			message: 'Unauthorized',
			code: '401'
		});
	}
});

test('browser access to sec redirects home without exposing secured navigation', async ({
	page
}) => {
	await page.goto('/sec');

	await expect(page).toHaveURL('/');
	await expect(page.getByRole('link', { name: 'Zabezpečená část' })).toHaveCount(0);
});

test('invalid credentials do not create an authenticated session', async ({ page }) => {
	await page.goto('/auth');
	await waitForHydration(page);
	const loginForm = page.locator('form[action="?/login"]');
	await loginForm.locator('input[name="email"]').fill('test@t.t');
	await loginForm.locator('input[name="password"]').fill('incorrect');
	await loginForm.getByRole('button', { name: 'Přihlásit se' }).click();

	await expect(page).toHaveURL(/\/auth/);
	await expect(page.getByText('Špatně zadané přihlašovací údaje')).toBeVisible();
	expect(
		(await page.context().cookies()).some((cookie) => cookie.name === SESSION_COOKIE_NAME)
	).toBe(false);
});

test('local test user can open read-only admin UI and log out', async ({ page }) => {
	try {
		await page.goto('/auth');
		await waitForHydration(page);
		const loginForm = page.locator('form[action="?/login"]');
		await loginForm.locator('input[name="email"]').fill(process.env.E2E_TEST_EMAIL ?? 'test@t.t');
		await loginForm.locator('input[name="password"]').fill(process.env.E2E_TEST_PASSWORD ?? 'test');
		await loginForm.getByRole('button', { name: 'Přihlásit se' }).click();

		await expect(page).toHaveURL('/sec');
		const securedResponse = await page.reload();
		expect(securedResponse?.headers()['cache-control']).toContain('private');
		expect(securedResponse?.headers()['cache-control']).toContain('no-store');
		await expect(page.getByRole('link', { name: 'Značky' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Cesty' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Skupiny' })).toBeVisible();

		const sessionCookie = (await page.context().cookies()).find(
			(cookie) => cookie.name === SESSION_COOKIE_NAME
		);
		expect(sessionCookie?.httpOnly).toBe(true);
		expect(sessionCookie?.sameSite).toBe('Strict');

		await page.goto('/sec/markers');
		await expect(page.getByRole('button', { name: 'Vytisknout všechny QR kódy' })).toBeVisible();
		await expect(page.getByRole('row', { name: /Testovací vstup/ })).toBeVisible();

		await page.locator('input[type="submit"][value="Odhlásit se"]').click();
		await expect(page).toHaveURL('/');
		expect(
			(await page.context().cookies()).some((cookie) => cookie.name === SESSION_COOKIE_NAME)
		).toBe(false);
	} finally {
		await page.context().request.post('/auth?/logout', {
			failOnStatusCode: false,
			form: {},
			maxRedirects: 0
		});
	}
});
