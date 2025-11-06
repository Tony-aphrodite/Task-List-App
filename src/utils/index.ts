import uuid from 'react-native-uuid';
import { Task, TaskCategory, TaskPriority } from '../types';

export const generateId = (): string => {
  return uuid.v4() as string;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false;
  return new Date() > new Date(task.dueDate);
};

export const getTasksByCategory = (tasks: Task[], category: TaskCategory): Task[] => {
  return tasks.filter(task => task.category === category);
};

export const getTasksByPriority = (tasks: Task[], priority: TaskPriority): Task[] => {
  return tasks.filter(task => task.priority === priority);
};

export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder = {
    [TaskPriority.URGENT]: 4,
    [TaskPriority.HIGH]: 3,
    [TaskPriority.MEDIUM]: 2,
    [TaskPriority.LOW]: 1,
  };

  return [...tasks].sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

export const getCategoryColor = (category: TaskCategory): string => {
  const colors = {
    [TaskCategory.WORK]: '#2196F3',
    [TaskCategory.PERSONAL]: '#4CAF50',
    [TaskCategory.SHOPPING]: '#FF9800',
    [TaskCategory.HEALTH]: '#E91E63',
    [TaskCategory.EDUCATION]: '#9C27B0',
    [TaskCategory.OTHER]: '#607D8B',
  };
  return colors[category];
};

export const getPriorityColor = (priority: TaskPriority): string => {
  const colors = {
    [TaskPriority.LOW]: '#4CAF50',
    [TaskPriority.MEDIUM]: '#FF9800',
    [TaskPriority.HIGH]: '#F44336',
    [TaskPriority.URGENT]: '#D32F2F',
  };
  return colors[priority];
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};