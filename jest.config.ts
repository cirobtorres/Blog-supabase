// https://jestjs.io/docs/configuration

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // testEnvironment: "jsdom",
  testEnvironment: "jest-fixed-jsdom",
};

const asyncConfig = createJestConfig(config);

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [];
  return config;
};
