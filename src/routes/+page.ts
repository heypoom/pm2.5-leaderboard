import { getAirQuality } from '$lib/api';

import type { PageLoad } from './$types';

export const load = (({ fetch }) => ({
	aqi: Promise.all([0, 30, 60].map((nextPage) => getAirQuality(fetch, nextPage)))
})) satisfies PageLoad;
