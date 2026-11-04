// Unit tests cover the pure TypeScript logic and a few small components rendered to HTML, so they run in Node with no browser.
module.exports = {
	testEnvironment: 'node',
	testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{ tsconfig: { module: 'commonjs', moduleResolution: 'node', target: 'ES2020', strict: true, esModuleInterop: true, skipLibCheck: true, jsx: 'react-jsx' } },
		],
	},
};
