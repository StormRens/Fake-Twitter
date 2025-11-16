export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/tests/**/*.{ts,tsx}"],
  coverageDirectory: "<rootDir>/coverage",
  verbose: true,
};