import 'leaflet';

declare module 'leaflet' {
	interface Polyline {
		setText(
			text: string | null,
			options?: {
				repeat?: boolean;
				offset?: number;
				attributes?: Record<string, string | number>;
			}
		): this;
	}
}
