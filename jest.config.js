/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>\\src\\singleton.ts'],
};
