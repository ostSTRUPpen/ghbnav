export type NavigationState = 'empty' | 'start-selected' | 'ready';

export interface Location {
	id: string;
	display_name: string;
	floor: number;
	can_nav: boolean;
	icon: string;
	building_location: string;
	position?: number | null;
}

export interface LocationMarker extends Location {
	x: number;
	y: number;
}

export interface NavigationMarker {
	id: number | string;
	x: number;
	y: number;
	floor: number;
	connected: Record<string, number>;
	special_type: string | null;
}

export interface MarkerIconDefinition {
	id: string;
	image: string;
}

export type IconDisplayNames = Record<string, string>;

export interface LocationSelectOption {
	value: string;
	label: string;
	group: string;
	selectable: boolean;
}

export interface PublicPath {
	start_node: string;
	end_node: string;
	start_name?: string;
	end_name?: string;
	count?: number;
	hidden: boolean;
}

export interface MapPageData {
	markers: LocationMarker[];
	nav_markers: NavigationMarker[];
	iconImageDisplayNames: IconDisplayNames;
	iconIdImage: MarkerIconDefinition[];
}

export interface PathResult {
	status: 'OK' | 'NO_PATH';
	distance: number;
	path: string[];
	startFloor: number;
}
