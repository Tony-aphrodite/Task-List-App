/**
 * TaskTodo - Task Management Application
 * Built with React Native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import { AuthProvider } from './src/store/AuthContext';
import { TaskProvider } from './src/store/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';
import { NotificationService } from './src/services/notifications';

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

  useEffect(() => {
    NotificationService.init();
    NotificationService.requestPermission();

    return () => {
      NotificationService.cleanup();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor="#2196F3"
        />
        <AuthProvider>
          <TaskProvider>
            <AppNavigator />
          </TaskProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
