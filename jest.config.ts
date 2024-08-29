import type { Config } from '@jest/types';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const config: Config.InitialOptions = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: [
    '**/*.(t|j)s'
  ],
  moduleNameMapper: {
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@dto/(.*)$': '<rootDir>/swaps/dto/$1',
    '^@interfaces/(.*)$': '<rootDir>/swaps/interfaces/$1'
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node'
};

export default config;
