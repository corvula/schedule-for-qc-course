/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  testRunner: "jest",
  jest: {
    configFile: "jest.config.js",
    config: {
      testMatch: ["**/src/helper/**/*.test.js"],
      coverageThreshold: undefined,
    }
  },
  mutate: [
    "src/helper/disableComponent.js",
    "src/helper/handleFormSubmit.js",
    "src/helper/cardObjectHandler.js",
  ],
  mutator: {
    plugins: [],
    excludedMutations: []
  },
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation/mutation.html"
  },
  coverageAnalysis: "perTest"
};
export default config;