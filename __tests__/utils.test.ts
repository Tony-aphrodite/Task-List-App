import {
  generateId,
  formatDate,
  formatDateTime,
  isTaskOverdue,
  validateEmail,
  validatePassword,
  getCategoryColor,
  getPriorityColor,
} from '../src/utils';
import { Task, TaskCategory, TaskPriority } from '../src/types';

describe('Utility Functions', () => {
  describe('generateId', () => {
    it('should generate a unique string ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1).not.toBe(id2);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Dec 25, 2023/);
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2023-12-25T15:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/Dec 25, 2023/);
      expect(formatted).toMatch(/3:30 PM/);
    });
  });

  describe('isTaskOverdue', () => {
    it('should return false for completed tasks', () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        category: TaskCategory.PERSONAL,
        priority: TaskPriority.MEDIUM,
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      };
      
      expect(isTaskOverdue(task)).toBe(false);
    });

    it('should return false for tasks without due date', () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        category: TaskCategory.PERSONAL,
        priority: TaskPriority.MEDIUM,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      expect(isTaskOverdue(task)).toBe(false);
    });

    it('should return true for overdue incomplete tasks', () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        category: TaskCategory.PERSONAL,
        priority: TaskPriority.MEDIUM,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      };
      
      expect(isTaskOverdue(task)).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate passwords with 6+ characters', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('password123')).toBe(true);
    });

    it('should reject passwords with less than 6 characters', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('getCategoryColor', () => {
    it('should return consistent colors for categories', () => {
      expect(getCategoryColor(TaskCategory.WORK)).toBe('#2196F3');
      expect(getCategoryColor(TaskCategory.PERSONAL)).toBe('#4CAF50');
      expect(getCategoryColor(TaskCategory.SHOPPING)).toBe('#FF9800');
    });
  });

  describe('getPriorityColor', () => {
    it('should return consistent colors for priorities', () => {
      expect(getPriorityColor(TaskPriority.LOW)).toBe('#4CAF50');
      expect(getPriorityColor(TaskPriority.MEDIUM)).toBe('#FF9800');
      expect(getPriorityColor(TaskPriority.HIGH)).toBe('#F44336');
      expect(getPriorityColor(TaskPriority.URGENT)).toBe('#D32F2F');
    });
  });
});