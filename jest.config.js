const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
	testEnvironment: "node",
	setupFiles: ["dotenv/config"],
	transform: {
		...tsJestTransformCfg,
	},
	testPathIgnorePatterns: ["/node_modules/", "/helpers/", "/load/"],
};
