/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    verbose: true,
    testEnvironment: 'jest-environment-jsdom', // Explicitly set the environment
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    transform: {
      '^.+\\.tsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
    roots: ['<rootDir>/tests'],
  };
};

/**
 * With this setup we could do something like:
 * module.exports = async () => {
  const isCI = process.env.CI === "true";
  return {
    verbose: true,
    collectCoverage: isCI, // Enable coverage only in CI
    testEnvironment: "jsdom",
  };
};

And modify configurations dynamically based on the environment
 */
