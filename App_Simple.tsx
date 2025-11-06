/**
 * TaskTodo - Simple Version without Firebase
 * Built with React Native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import { TaskProvider } from './src/store/TaskContext';
import SimpleAppNavigator from './src/navigation/SimpleAppNavigator';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    accent: '#4CAF50',
  },
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor="#2196F3"
        />
        <TaskProvider>
          <SimpleAppNavigator />
        </TaskProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;