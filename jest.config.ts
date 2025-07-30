module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@configs/(.*)$": "<rootDir>/src/lib/configs/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/shared/middlewares/$1",
    "^@auth/(.*)$": "<rootDir>/src/modules/auth/$1",
    "^@integrations/(.*)$": "<rootDir>/src/modules/integrations/$1",
    "^@announcements/(.*)$": "<rootDir>/src/modules/announcements/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testTimeout: 15000,
};
