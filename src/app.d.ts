import type { Cookies } from '@sveltejs/kit';
import type { Sql } from 'postgres';

declare global {
	namespace App {
		interface Locals {
			validateLogin(): Promise<boolean>;
			sql: Sql;
			cookies: Cookies
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
	declare type codesArray = { id: number; code: string, creation_date: string }[];
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

	declare type SerializedServerResponse = { message: string; code: string };
	declare type enlargedMarkerObject = {
		id: string;
		display_name: string;
		floor: number;
		building_location: string
		icon: string;
		can_nav: boolean;
		new_display_name: string;
		new_icon: string;
		new_can_nav: boolean;
		new_building_location: string
		genQR: boolean;
	};
}
