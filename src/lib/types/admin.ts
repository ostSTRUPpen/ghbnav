export interface ServerResponse {
	message: string;
	code: string;
}

export interface MarkerChange {
	id: string;
	display_name: string;
	icon: string;
	can_nav: boolean;
	building_location: string;
}

export interface EditableMarker extends MarkerChange {
	floor: number;
	new_display_name: string;
	new_icon: string;
	new_can_nav: boolean;
	new_building_location: string;
	genQR: boolean;
}

export interface IconGroup {
	id: string;
	display_name: string;
	image: string;
	position: number;
}

export interface IconChoice {
	id: string;
	image: string;
	display_name: string;
}

export interface MarkerIconChoice {
	name: string;
	image: string;
	displayname: string;
}

export interface PreparedLocation {
	id: string | number;
	name: string;
	can_nav: boolean;
	disabled: boolean;
	nav_group?: string;
}

export interface NavigationGroupOption {
	id: string;
	name: string;
}

export interface StoredPath {
	id: string;
	start_node: string;
	end_node: string;
	count: number;
	hidden: boolean;
	start_name?: string;
	end_name?: string;
}

export interface PresetPath {
	id: string;
	start_node: string;
	end_node: string;
	position: string | number;
	hidden: boolean;
	start_name?: string;
	end_name?: string;
}
