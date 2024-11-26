import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ManifestOptions, VitePWA } from 'vite-plugin-pwa';
import vike from 'vike/plugin';

// const pwaOptions = {
// 	registerType: 'autoUpdate',
// 	includeAssets: ['favicon.svg', 'robots.txt'], // Add additional assets here
// 	manifest: {
// 		name: 'My React PWA',
// 		short_name: 'ReactPWA',
// 		theme_color: '#ffffff',
// 		icons: [
// 			{
// 				src: 'pwa-192x192.png', // Place this image in the public folder
// 				sizes: '192x192',
// 				type: 'image/png',
// 			},
// 			{
// 				src: 'pwa-512x512.png', // Place this image in the public folder
// 				sizes: '512x512',
// 				type: 'image/png',
// 			},
// 		],
// 	},
// };

// const replaceOptions = { __DATE__: new Date().toISOString() };
// const claims = process.env.CLAIMS === 'true';
// const reload = process.env.RELOAD_SW === 'true';
// const selfDestroying = process.env.SW_DESTROY === 'true';

// if (process.env.SW === 'true') {
// 	pwaOptions.srcDir = 'src';
// 	pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts';
// 	pwaOptions.strategies = 'injectManifest';
// 	(pwaOptions.manifest as Partial<ManifestOptions>).name = 'PWA Inject Manifest';
// 	(pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject';
// 	pwaOptions.injectManifest = {
// 		minify: false,
// 		enableWorkboxModulesLogs: true,
// 	};
// }

// if (claims) pwaOptions.registerType = 'autoUpdate';

// if (reload) {
// 	// @ts-expect-error just ignore
// 	replaceOptions.__RELOAD_SW__ = 'true';
// }

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'robots.txt'],
			manifest: {
				name: 'Your App Name',
				short_name: 'App',
				theme_color: '#ffffff',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
			strategies: 'generateSW',
			workbox: {
				// Only precache these files - html should be excluded
				globPatterns: ['**/*.{js,css}'],

				// Don't fallback on document based (e.g. `/some-page`) requests
				// Even though this says `null` by default, I had to set this specifically to `null` to make it work
				navigateFallback: null,
			},
		}),
		vike({
			redirects: {
				'/ticktick-1.00/medals': '/ticktick-1.00/medals/focus/daily',
			},
		}),
	],
	server: {
		port: 5173,
	},
	build: {
		typescript: {
			check: false,
		},
	},
});
