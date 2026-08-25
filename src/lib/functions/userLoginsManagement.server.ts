import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import type { Sql } from 'postgres';

export const SESSION_COOKIE_NAME = 'zi67OR1pZpQi3GVNMk96WO';
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24;
const SESSION_LIFETIME_MS = SESSION_LIFETIME_SECONDS * 1000;

interface PasswordRow {
	password: string;
}

interface SessionValidationRow {
	valid: boolean;
}

export async function loginUser(
	sql: Sql,
	email: string,
	password: string,
	cookies: Cookies
): Promise<string> {
	const [user] = await sql<PasswordRow[]>`
		SELECT password
		FROM users
		WHERE email = ${Buffer.from(email).toString('base64')}
	`;
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return '400';
	}

	await cleanupExpiredLoginCodes(sql);
	const code = bcrypt.genSaltSync(10);
	await sql`
		INSERT INTO login_codes (code, creation_date)
		VALUES (${code}, ${Date.now()})
	`;
	cookies.set(SESSION_COOKIE_NAME, code, {
		path: '/',
		sameSite: 'strict',
		secure: !dev,
		maxAge: SESSION_LIFETIME_SECONDS,
		httpOnly: true
	});
	return '';
}

export async function logoutUser(sql: Sql, cookies: Cookies): Promise<void> {
	const sessionCode = cookies.get(SESSION_COOKIE_NAME);
	if (sessionCode) {
		await sql`DELETE FROM login_codes WHERE code = ${sessionCode}`;
	}
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export async function cleanupExpiredLoginCodes(sql: Sql): Promise<void> {
	await sql`
		DELETE FROM login_codes
		WHERE creation_date::bigint < ${Date.now() - SESSION_LIFETIME_MS}
	`;
}

export async function validateSession(sql: Sql, sessionCode: string): Promise<boolean> {
	const [session] = await sql<SessionValidationRow[]>`
		SELECT EXISTS (
			SELECT 1
			FROM login_codes
			WHERE code = ${sessionCode}
				AND creation_date::bigint >= ${Date.now() - SESSION_LIFETIME_MS}
		) AS valid
	`;
	return session?.valid === true;
}
