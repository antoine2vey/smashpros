module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', '/src/__tests__/utils/', '/src/__tests__/mocks/'],
  verbose: true
}
