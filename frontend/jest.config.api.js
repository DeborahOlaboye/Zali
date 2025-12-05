const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',  
});

const customJestConfig = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/api/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/api/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
