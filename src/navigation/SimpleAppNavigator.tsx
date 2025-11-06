import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SimpleMainTabs from './SimpleMainTabs';

const Stack = createStackNavigator();

const SimpleAppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={SimpleMainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SimpleAppNavigator;