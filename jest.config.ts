import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage', // Directory where coverage reports will be saved
  coverageReporters: ['lcov', 'text'], // Reporters you want to use
  collectCoverageFrom: [
    'src/**/*.ts', // Adjust the path to include your TypeScript files
    '!src/**/*.d.ts', // Exclude TypeScript declaration files
    // ...exclude any other files not relevant for coverage
  ],
  // Make sure Jest looks at your TypeScript files:
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
};

export default config;
