const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  testMatch: [
    '<rootDir>/src/**/_test_/**/*.test.ts',
    '<rootDir>/src/_test_/**/*.test.ts',
  ],
  transform: {
    ...tsJestTransformCfg,
  },
};