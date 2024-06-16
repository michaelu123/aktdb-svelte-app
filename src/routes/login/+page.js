// @ts-nocheck

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	console.log('login load');
	return { fetch: fetch, params: params };
}
