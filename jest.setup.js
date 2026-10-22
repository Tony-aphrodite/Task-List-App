/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

// AsyncStorage has no native module under Jest, so use the mock the library ships.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
