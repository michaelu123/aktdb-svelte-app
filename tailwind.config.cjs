const config = {
	darkmode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('@tailwindcss/forms'),
		require('path').join(require.resolve('@brainandbones/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		debugScreens: {
			position: ['top', 'left'],
			ignore: []
		},
		extend: {
			fontFamily: {
				ueberschrift: ['Oswald']
			},
			colors: {
				hauptfarbe: '#212f49'
			}
		}
	},

	plugins: [
		require('tailwindcss-debug-screens'),
		require('@brainandbones/skeleton/tailwind/theme.cjs')
	]
};

module.exports = config;