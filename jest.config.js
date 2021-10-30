module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest'
  },
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/src/__tests__/utils/"
  ],
  verbose: true
};