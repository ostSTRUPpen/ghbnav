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
		interface others {
			enlargedMarkerObject: {
				id: string;
				display_name: string;
				floor: number;
				icon: string;
				can_nav: boolean;
				new_display_name: string;
				new_icon: string;
				new_can_nav: boolean;
				genQR: boolean;
			};
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
	declare type Item = import('svelte-dnd-action').Item;
	declare type DndEvent<ItemType = Item> = import('svelte-dnd-action').DndEvent<ItemType>;
	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:consider'?: (
				event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }
			) => void;
			'on:finalize'?: (
				event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }
			) => void;
		}
	}
}
