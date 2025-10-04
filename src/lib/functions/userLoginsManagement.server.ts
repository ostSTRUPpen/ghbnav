import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import type { Sql } from 'postgres';

export async function loginUser(
	sql: Sql,
	email: string,
	password: string,
	cookies: Cookies
): Promise<string> {
	const hash = (
		await sql`SELECT password FROM users WHERE email = ${Buffer.from(email).toString('base64')};`
	)[0]?.password;
	if (!hash) {
		return '400';
	}
	const match = await bcrypt.compare(password, hash);
	if (!match) {
		return '400';
	} else {
		const code = bcrypt.genSaltSync(10);
		cookies.set('zi67OR1pZpQi3GVNMk96WO', code, {
			path: '/',
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24,
			httpOnly: true
		});
		await sql`INSERT INTO login_codes (code, creation_date) VALUES (${code}, ${Date.now()});`;
		return '';
	}
}

export async function logoutUser(sql: Sql, cookies: Cookies) {
	const cookieCode = cookies.get('zi67OR1pZpQi3GVNMk96WO');
	if (cookieCode) {
		await sql`DELETE FROM login_codes WHERE code = ${cookieCode};`;
	}
	cookies.delete('zi67OR1pZpQi3GVNMk96WO', { path: '/' });
	return;
}

export async function cleanupDBCodes(sql: Sql) {
	const codes = await sql`SELECT * FROM login_codes;`;
	const now = Date.now();
	const codesToDelete = [];
	for (const code of codes) {
		if (code.creation_date - now < -86400000) {
			codesToDelete.push(code.id);
		}
	}
	if (codesToDelete) {
		for (const code of codesToDelete) {
			await sql`DELETE FROM login_codes WHERE id = ${code};`;
		}
	}
}

export function validateCodes(codes: codesArray, cookie = '') {
	for (const code of codes) {
		if (code.code === cookie) {
			return true;
		}
	}
	return false;
}
