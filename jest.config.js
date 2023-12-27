/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/singleton.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/utils/*',
    'src/schemas/*',
    'src/middlewares/uploadMiddleware.ts',
    'src/controllers/errorController.ts',
  ],
};
