// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const config = {
    globals: {
        'ts-jest': {
            tsconfigFile: 'tsconfig.json'
        }
    },
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        "node_modules/node\-fetch/.+\\.(j|t)s?$": "ts-jest"
    },
    testMatch: [
        '**/test/**/*.test.(ts|js)'
    ],
    testEnvironment: 'node',

    transformIgnorePatterns: [
        "node_modules/(?!node\-fetch/.*)"
    ]
};

export default config;
