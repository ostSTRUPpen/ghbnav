import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { database } from '$lib/server/database';
import { SESSION_COOKIE_NAME, validateSession } from '$lib/functions/userLoginsManagement.server';

const protectedApiRoutes = new Set(['/api/change_markers', '/api/groups', '/api/preset_paths']);

function requiresAuthentication(event: RequestEvent): boolean {
	const routeId = event.route.id;
	if (routeId?.startsWith('/sec')) return true;
	if (routeId && protectedApiRoutes.has(routeId)) return true;
	return routeId === '/api/dynamic_paths' && event.request.method !== 'POST';
}

function containsPrivateData(event: RequestEvent): boolean {
	const routeId = event.route.id;
	if (!routeId) return false;
	return routeId === '/auth' || routeId.startsWith('/sec') || routeId.startsWith('/api/');
}

const privateResponseCache: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (containsPrivateData(event)) {
		response.headers.set('Cache-Control', 'private, no-store');
		response.headers.delete('CDN-Cache-Control');
		response.headers.delete('Vercel-CDN-Cache-Control');
		response.headers.delete('Vercel-Cache-Tag');
	}
	return response;
};

const databaseConnection: Handle = async ({ event, resolve }) => {
	event.locals.sql = database;
	return resolve(event);
};

const sessionCheck: Handle = async ({ event, resolve }) => {
	event.locals.cookies = event.cookies;
	const sessionCode = event.cookies.get(SESSION_COOKIE_NAME);
	let validation: Promise<boolean> | undefined;

	event.locals.validateLogin = () => {
		if (!sessionCode) return Promise.resolve(false);
		validation ??= validateSession(event.locals.sql, sessionCode);
		return validation;
	};

	if (requiresAuthentication(event) && !(await event.locals.validateLogin())) {
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		if (event.url.pathname.startsWith('/api/')) {
			return new Response(JSON.stringify({ message: 'Unauthorized', code: '401' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		throw redirect(303, '/');
	}

	return resolve(event);
};

const colorCheck: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme');
	const themes = ['ghb_light', 'ghb_dark'];

	if (!theme || !themes.includes(theme)) {
		return resolve(event);
	}
	return resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('data-theme=""', `data-theme="${theme}"`);
		}
	});
};

export const handle = sequence(colorCheck, privateResponseCache, databaseConnection, sessionCheck);
