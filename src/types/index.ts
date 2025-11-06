export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  reminder?: Date;
}

export enum TaskCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  SHOPPING = 'shopping',
  HEALTH = 'health',
  EDUCATION = 'education',
  OTHER = 'other',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

export interface RootStackParamList {
  AuthStack: undefined;
  MainTabs: undefined;
}

export interface AuthStackParamList {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
}

export interface MainTabParamList {
  Tasks: undefined;
  Categories: undefined;
  Profile: undefined;
}

export interface TasksStackParamList {
  TaskList: undefined;
  TaskDetails: { taskId: string };
  AddTask: undefined;
  EditTask: { taskId: string };
}