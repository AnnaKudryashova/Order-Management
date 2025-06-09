/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
        }],
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    extensionsToTreatAsEsm: ['.ts'],
};

export default config; 