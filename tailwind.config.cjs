module.exports = {
	content: ['./src/routes/**/*.{svelte,js,ts}', './src/lib/elements/**/*.{svelte,js,ts}'],
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				ghb_light: {
					primary: '#fd8549',

					secondary: '#2f3c4c',

					accent: '#c8f1f4',

					neutral: '#312235',

					'base-100': '#f6fdfe',

					info: '#69acd3',

					success: '#7fe1cd',

					warning: '#dbad14',

					error: '#e14c7e'
				},
				ghb_dark: {
					primary: '#fd8549',

					secondary: '#f6fdfe',

					accent: '#22d3ee',

					neutral: '#312235',

					'base-100': '#2f3c4c',

					info: '#0284c7',

					success: '#65a30d',

					warning: '#d97706',

					error: '#be123c'
				}
			}
		]
	}
};
