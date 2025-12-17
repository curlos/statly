import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import vike from 'vike/plugin';
import checker from 'vite-plugin-checker';

export default defineConfig({
	plugins: [
		react(),
		checker({
			typescript: {
				tsconfigPath: './tsconfig.json',
			},
			eslint: {
				lintCommand: 'eslint "./src/**/*.{ts,tsx}" --max-warnings 0',
				dev: {
					logLevel: ['error', 'warning'],
				},
			},
		}),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['robots.txt'],
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
				'/medals': '/medals/focus/daily',
				'/challenges': '/challenges/focus',
			},
		}),
	],
	server: {
		port: 5173,
	},
});
