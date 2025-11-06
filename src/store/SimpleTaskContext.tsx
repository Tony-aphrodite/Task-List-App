import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Task, TaskState, TaskCategory, TaskPriority } from '../types';
import { StorageService } from '../services/storage';
import { generateId } from '../utils';

interface TaskAction {
  type: 'SET_LOADING' | 'SET_TASKS' | 'ADD_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 'SET_ERROR';
  payload?: any;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, isLoading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

interface TaskContextType {
  state: TaskState;
  loadTasks: () => Promise<void>;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  getTasksByCategory: (category: TaskCategory) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const SimpleTaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const hasAddedDemoTasks = useRef(false);

  const loadTasks = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tasks = await StorageService.loadTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
      
      // Add demo tasks if none exist and we haven't added them yet
      if (tasks.length === 0 && !hasAddedDemoTasks.current) {
        setTimeout(async () => {
          hasAddedDemoTasks.current = true;
          await addDemoTasks();
        }, 500);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tasks' });
    }
  }, []);

  const addDemoTasks = async () => {
    const demoTasks = [
      {
        title: "Welcome to TaskTodo!",
        description: "This is a demo task to show you how the app works.",
        category: TaskCategory.PERSONAL,
        priority: TaskPriority.HIGH,
        completed: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        title: "Buy groceries",
        description: "Milk, bread, eggs, fruits",
        category: TaskCategory.SHOPPING,
        priority: TaskPriority.MEDIUM,
        completed: false,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        title: "Finish project report",
        description: "Complete the Q4 analysis report for the team meeting",
        category: TaskCategory.WORK,
        priority: TaskPriority.URGENT,
        completed: false,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      }
    ];

    for (const taskData of demoTasks) {
      await addTask(taskData);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      const now = new Date();
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };

      await StorageService.saveTask(newTask);
      dispatch({ type: 'ADD_TASK', payload: newTask });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add task' });
    }
  };

  const updateTask = async (task: Task): Promise<void> => {
    try {
      const updatedTask = {
        ...task,
        updatedAt: new Date(),
      };

      await StorageService.saveTask(updatedTask);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      await StorageService.deleteTask(taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
    }
  };

  const toggleTaskCompletion = async (taskId: string): Promise<void> => {
    try {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = {
        ...task,
        completed: !task.completed,
        updatedAt: new Date(),
      };

      await updateTask(updatedTask);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to toggle task completion' });
    }
  };

  const getTasksByCategory = (category: TaskCategory): Task[] => {
    return state.tasks.filter(task => task.category === category);
  };

  const getTasksByPriority = (priority: TaskPriority): Task[] => {
    return state.tasks.filter(task => task.priority === priority);
  };

  const getOverdueTasks = (): Task[] => {
    const now = new Date();
    return state.tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      !task.completed
    );
  };

  const getUpcomingTasks = (): Task[] => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return state.tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) >= now && 
      new Date(task.dueDate) <= nextWeek &&
      !task.completed
    );
  };

  const value: TaskContextType = {
    state,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTasksByCategory,
    getTasksByPriority,
    getOverdueTasks,
    getUpcomingTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};