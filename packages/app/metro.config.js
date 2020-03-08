/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');

const packages = [];

module.exports = {
  watchFolders: [
    path.resolve(__dirname, '../../node_modules'),
    ...packages.map(pkg => path.resolve(__dirname, `../${pkg}`)),
  ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
