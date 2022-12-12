// @ts-nocheck

/** @type {import('./$types').PageLoad} */
export function load({ url, route, params }) {
	console.log('url', url.href);
	console.log('route', route.id);
	console.log('slug', params.slug);
	return {
		slug: params.slug,
		title: 'Hello world!',
		content: '<h2>Welcome to our blog. Lorem ipsum dolor sit amet...</h2>'
	};
}
