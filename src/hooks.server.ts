import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import postgres from 'postgres';
import { PSQL_USERNAME, PSQL_PASSWORD, PSQL_HOST, PSQL_PORT, PSQL_DATABASE, POSTGRES_JS_SETTINGS_IDLE_TIMEOUT, POSTGRES_JS_SETTINGS_MAX_LIFETIME } from '$env/static/private';

import { cleanupDBCodes, validateCodes } from '$lib/functions/userLoginsManagement.server';

const sessionCheck: Handle = async ({ event, resolve }) => {
	const { sql } = event.locals;

	event.locals.cookies = event.cookies;
	event.locals.validateLogin = async () => {
		const codes = await sql`SELECT * FROM login_codes;` as codesArray;
		const cookies = event.locals.cookies.get('zi67OR1pZpQi3GVNMk96WO');
		return validateCodes(codes, cookies);
	}
	if (event.url.pathname.startsWith('/sec')) {
		cleanupDBCodes(sql)
		const loggedIn = await event.locals.validateLogin();
		if (!loggedIn) {
			// the user is not logged in
			throw redirect(303, '/');
		}
	}
	return resolve(event);
};


export const connectToPostgresSQL: Handle = async ({ event, resolve }) => {
	const sql = postgres(`postgresql://${PSQL_USERNAME}:${PSQL_PASSWORD}@${PSQL_HOST}${PSQL_PORT}/${PSQL_DATABASE}?sslmode=require`, {
		idle_timeout: Number(POSTGRES_JS_SETTINGS_IDLE_TIMEOUT),
		max_lifetime: Number(POSTGRES_JS_SETTINGS_MAX_LIFETIME),
	});
	event.locals.sql = sql
	return resolve(event);
};

const colorCheck: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme');
	const themes = ['ghb_light', 'ghb_dark'];

	if (!theme || !themes.includes(theme)) {
		return await resolve(event);
	}
	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('data-theme=""', `data-theme="${theme}"`);
		}
	});
};

export const handle = sequence(colorCheck, connectToPostgresSQL, sessionCheck);
