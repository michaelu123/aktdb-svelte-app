const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@brainandbones/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		debugScreens: {
			position: ['top', 'left'],
			ignore: []
		},
		extend: {
		}
	},

	plugins: [
		require('tailwindcss-debug-screens'),
		require('@tailwindcss/forms'),
		require('@brainandbones/skeleton/tailwind/theme.cjs')
	]
};

module.exports = config;
