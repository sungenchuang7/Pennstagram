module.exports = {
  testEnvironment: 'node', // Specify the test environment
  testPathIgnorePatterns: ['/node_modules/'], // Ignore node_modules
  collectCoverageFrom: ['./DbOperations/DbOperations.js', 'server.js'], // Collect coverage from specified files
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transform JavaScript and JSX files with babel-jest
  },
};
