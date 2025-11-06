import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TaskListScreen from '../screens/tasks/TaskListScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import SimpleProfileScreen from '../screens/main/SimpleProfileScreen';

const Tab = createBottomTabNavigator();

const SimpleMainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Tasks':
              iconName = 'assignment';
              break;
            case 'Categories':
              iconName = 'category';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'assignment';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Tasks" 
        component={TaskListScreen} 
        options={{ title: 'My Tasks' }} 
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen} 
        options={{ title: 'Categories' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={SimpleProfileScreen} 
        options={{ title: 'Profile' }} 
      />
    </Tab.Navigator>
  );
};

export default SimpleMainTabs;