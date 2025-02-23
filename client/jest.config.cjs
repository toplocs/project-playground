module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src/tests'],
  transform: {'^.+\\.tsx?$': 'ts-jest'},
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleNameMapper: {'^@/(.*)$': '<rootDir>/src/$1'},
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
