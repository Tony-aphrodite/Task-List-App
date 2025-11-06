import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TasksStackParamList } from '../types';

import TaskListScreen from '../screens/tasks/TaskListScreen';
import TaskDetailsScreen from '../screens/tasks/TaskDetailsScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';

const Stack = createStackNavigator<TasksStackParamList>();

const TasksStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="TaskList" 
        component={TaskListScreen}
        options={{ title: 'My Tasks' }}
      />
      <Stack.Screen 
        name="TaskDetails" 
        component={TaskDetailsScreen}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen 
        name="AddTask" 
        component={AddTaskScreen}
        options={{ title: 'Add New Task' }}
      />
      <Stack.Screen 
        name="EditTask" 
        component={EditTaskScreen}
        options={{ title: 'Edit Task' }}
      />
    </Stack.Navigator>
  );
};

export default TasksStack;