// Unit tests cover the pure TypeScript logic (no React or DOM), so they run in Node.
module.exports = {
	testEnvironment: 'node',
	testMatch: ['<rootDir>/src/**/*.test.ts'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{ tsconfig: { module: 'commonjs', moduleResolution: 'node', target: 'ES2020', strict: true, esModuleInterop: true, skipLibCheck: true } },
		],
	},
};
