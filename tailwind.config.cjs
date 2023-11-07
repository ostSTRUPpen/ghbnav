module.exports = {
	// IMPORTANT https://tailwindcss.com/docs/content-configuration
	content: ['./src/routes/**/*.{svelte,js,ts}', './src/lib/elements/**/*.{svelte,js,ts}'],
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			// TODO přidat dark mode
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
				}
			}
		]
	}
};
