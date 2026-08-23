import type { Cookies } from '@sveltejs/kit';
import type { Sql } from 'postgres';

declare global {
	namespace App {
		interface Locals {
			validateLogin(): Promise<boolean>;
			sql: Sql;
			cookies: Cookies;
		}
		interface GraphTypes {
			graphObject: { [key: string | number]: { [key: string | number]: number | string } };
			rawGraphObject: Array<{ [key: string]: number }>;
			additionObject: Record<string, number>;
		}
		interface PageData {
			loggedIn: boolean;
		}
		// interface Error {}
		// interface Platform {}
	}
}
