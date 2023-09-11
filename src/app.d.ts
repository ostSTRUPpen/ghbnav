import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from './DatabaseDefinitions';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface GraphTypes {
			graphObject: { [key: string | number]: { [key: string | number]: number | string } };
			rawGraphObject: Array<{ [key: string]: number }>;
			additionObject: Record<string, number>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}
