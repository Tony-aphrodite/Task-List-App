import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_KEY = 'tasks';
const USER_PREFERENCES_KEY = 'user_preferences';

export class StorageService {
  
  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      const tasksJson = JSON.stringify(tasks);
      await AsyncStorage.setItem(TASKS_KEY, tasksJson);
    } catch (error) {
      throw new Error(`Failed to save tasks: ${error}`);
    }
  }

  static async loadTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
      if (!tasksJson) return [];
      
      const tasks = JSON.parse(tasksJson);
      
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        reminder: task.reminder ? new Date(task.reminder) : undefined,
      }));
    } catch (error) {
      console.error('Failed to load tasks:', error);
      return [];
    }
  }

  static async saveTask(task: Task): Promise<void> {
    try {
      const tasks = await this.loadTasks();
      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex >= 0) {
        tasks[existingIndex] = task;
      } else {
        tasks.push(task);
      }
      
      await this.saveTasks(tasks);
    } catch (error) {
      throw new Error(`Failed to save task: ${error}`);
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      const tasks = await this.loadTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      await this.saveTasks(filteredTasks);
    } catch (error) {
      throw new Error(`Failed to delete task: ${error}`);
    }
  }

  static async getTaskById(taskId: string): Promise<Task | null> {
    try {
      const tasks = await this.loadTasks();
      return tasks.find(task => task.id === taskId) || null;
    } catch (error) {
      console.error('Failed to get task by ID:', error);
      return null;
    }
  }

  static async saveUserPreferences(preferences: any): Promise<void> {
    try {
      const preferencesJson = JSON.stringify(preferences);
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, preferencesJson);
    } catch (error) {
      throw new Error(`Failed to save user preferences: ${error}`);
    }
  }

  static async loadUserPreferences(): Promise<any> {
    try {
      const preferencesJson = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      return preferencesJson ? JSON.parse(preferencesJson) : {};
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      return {};
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TASKS_KEY, USER_PREFERENCES_KEY]);
    } catch (error) {
      throw new Error(`Failed to clear data: ${error}`);
    }
  }
}