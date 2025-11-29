module.exports = {
    testEnvironment: 'node',
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
    },
    transformIgnorePatterns: [
        'node_modules/(?!(uuid)/)',
    ],
};
