import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../src/services/storage';
import { Task, TaskCategory, TaskPriority } from '../src/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('StorageService', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    category: TaskCategory.PERSONAL,
    priority: TaskPriority.MEDIUM,
    completed: false,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
    dueDate: new Date('2023-12-31T23:59:59Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveTasks', () => {
    it('should save tasks to AsyncStorage', async () => {
      const tasks = [mockTask];
      mockAsyncStorage.setItem.mockResolvedValueOnce();

      await StorageService.saveTasks(tasks);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        JSON.stringify(tasks)
      );
    });

    it('should handle save errors', async () => {
      const tasks = [mockTask];
      mockAsyncStorage.setItem.mockRejectedValueOnce(new Error('Save failed'));

      await expect(StorageService.saveTasks(tasks)).rejects.toThrow('Failed to save tasks');
    });
  });

  describe('loadTasks', () => {
    it('should load and parse tasks from AsyncStorage', async () => {
      const tasks = [mockTask];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(tasks));

      const result = await StorageService.loadTasks();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('tasks');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Task');
      expect(result[0].createdAt).toBeInstanceOf(Date);
    });

    it('should return empty array when no tasks exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await StorageService.loadTasks();

      expect(result).toEqual([]);
    });

    it('should handle load errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Load failed'));

      const result = await StorageService.loadTasks();

      expect(result).toEqual([]);
    });
  });

  describe('saveTask', () => {
    it('should save a new task', async () => {
      const existingTasks = [];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingTasks));
      mockAsyncStorage.setItem.mockResolvedValueOnce();

      await StorageService.saveTask(mockTask);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        JSON.stringify([mockTask])
      );
    });

    it('should update an existing task', async () => {
      const existingTasks = [mockTask];
      const updatedTask = { ...mockTask, title: 'Updated Task' };
      
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingTasks));
      mockAsyncStorage.setItem.mockResolvedValueOnce();

      await StorageService.saveTask(updatedTask);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        JSON.stringify([updatedTask])
      );
    });
  });

  describe('deleteTask', () => {
    it('should remove task from storage', async () => {
      const tasks = [mockTask, { ...mockTask, id: '2', title: 'Another Task' }];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(tasks));
      mockAsyncStorage.setItem.mockResolvedValueOnce();

      await StorageService.deleteTask('1');

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        JSON.stringify([{ ...mockTask, id: '2', title: 'Another Task' }])
      );
    });
  });

  describe('getTaskById', () => {
    it('should return task by ID', async () => {
      const tasks = [mockTask];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(tasks));

      const result = await StorageService.getTaskById('1');

      expect(result?.id).toBe('1');
      expect(result?.title).toBe('Test Task');
    });

    it('should return null for non-existent task', async () => {
      const tasks = [mockTask];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(tasks));

      const result = await StorageService.getTaskById('999');

      expect(result).toBeNull();
    });
  });

  describe('clearAllData', () => {
    it('should remove all app data', async () => {
      mockAsyncStorage.multiRemove.mockResolvedValueOnce();

      await StorageService.clearAllData();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        'tasks',
        'user_preferences'
      ]);
    });
  });
});