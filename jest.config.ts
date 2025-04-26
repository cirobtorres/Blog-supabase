// https://jestjs.io/docs/configuration

import type { Config } from "jest";
import nextJest from "next/jest.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

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
  testEnvironment: "jsdom",
};

const asyncConfig = createJestConfig(config);

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [];
  return config;
};
