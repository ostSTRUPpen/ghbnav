import { invalidateByTag } from '@vercel/functions';

export const PUBLIC_NAVIGATION_CACHE_TAG = 'ghbnav-public-navigation';

const SHARED_CACHE_TTL_SECONDS = 60 * 60 * 24;
const VERCEL_CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;
const VARY_HEADERS = 'Cookie, Authorization';

interface PublicCacheContext {
	request: Request;
	setHeaders(headers: Record<string, string>): void;
}

export function setPublicNavigationCacheHeaders({ request, setHeaders }: PublicCacheContext): void {
	const hasPersonalization = request.headers.has('cookie') || request.headers.has('authorization');

	if (hasPersonalization) {
		setHeaders({
			'Cache-Control': 'private, no-store',
			'CDN-Cache-Control': 'private, no-store',
			'Vercel-CDN-Cache-Control': 'private, no-store',
			Vary: VARY_HEADERS
		});
		return;
	}

	setHeaders({
		'Cache-Control': 'public, max-age=0, must-revalidate',
		'CDN-Cache-Control': `public, s-maxage=${SHARED_CACHE_TTL_SECONDS}`,
		'Vercel-CDN-Cache-Control': `public, s-maxage=${VERCEL_CACHE_TTL_SECONDS}`,
		'Vercel-Cache-Tag': PUBLIC_NAVIGATION_CACHE_TAG,
		Vary: VARY_HEADERS
	});
}

export async function invalidatePublicNavigationCache(): Promise<void> {
	try {
		await invalidateByTag(PUBLIC_NAVIGATION_CACHE_TAG);
	} catch (error) {
		console.error('Nepodařilo se invalidovat veřejnou navigační cache.', error);
	}
}
