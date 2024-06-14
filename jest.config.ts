import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	collectCoverageFrom: [
		"client/**/*.ts",
		"server/**/*.ts",
		"!**/*.config.*",
		"!client/**/config/*",
		"!**/*.d.ts",
		"!**/types.ts",
	],
};

export default config;
