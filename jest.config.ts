import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
	dir: "./",
});

const config: Config = {
	displayName: "phishlens-frontend",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

	// Module name mapper — resolve @/* path alias
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},

	// Test file patterns
	testMatch: [
		"<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
		"<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
	],

	// Coverage settings
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/**/types/**",
		"!src/app/layout.tsx",
		"!src/middleware.ts",
	],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50,
		},
	},
};

export default createJestConfig(config);
