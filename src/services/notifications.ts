import PushNotification from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import { Task } from '../types';

export class NotificationService {
  
  static init(): void {
    if (Platform.OS === 'ios') {
      PushNotification.addEventListener('notification', this.onNotificationReceived);
      PushNotification.addEventListener('localNotification', this.onLocalNotification);
      PushNotification.requestPermissions();
    }
  }

  static onNotificationReceived = (notification: any) => {
    console.log('Notification received:', notification);
  };

  static onLocalNotification = (notification: any) => {
    console.log('Local notification received:', notification);
  };

  static async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const permissions = await PushNotification.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      });
      return permissions.alert === true;
    }
    return true;
  }

  static scheduleTaskReminder(task: Task): void {
    if (!task.reminder) return;

    const notificationId = `task_${task.id}`;
    const reminderDate = new Date(task.reminder);
    
    if (reminderDate <= new Date()) return;

    if (Platform.OS === 'ios') {
      PushNotification.scheduleLocalNotification({
        alertTitle: 'Task Reminder',
        alertBody: `Don't forget: ${task.title}`,
        fireDate: reminderDate.toISOString(),
        userInfo: {
          taskId: task.id,
          type: 'task_reminder',
        },
      });
    }
  }

  static cancelTaskReminder(taskId: string): void {
    
    if (Platform.OS === 'ios') {
      PushNotification.cancelLocalNotifications({
        userInfo: { taskId }
      });
    }
  }

  static scheduleTaskDeadline(task: Task): void {
    if (!task.dueDate) return;

    const notificationId = `deadline_${task.id}`;
    const deadlineDate = new Date(task.dueDate);
    const reminderTime = new Date(deadlineDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    
    if (reminderTime <= new Date()) return;

    if (Platform.OS === 'ios') {
      PushNotification.scheduleLocalNotification({
        alertTitle: 'Task Due Tomorrow',
        alertBody: `Task "${task.title}" is due tomorrow`,
        fireDate: reminderTime.toISOString(),
        userInfo: {
          taskId: task.id,
          type: 'task_deadline',
        },
      });
    }
  }

  static cancelTaskDeadline(taskId: string): void {
    if (Platform.OS === 'ios') {
      PushNotification.cancelLocalNotifications({
        userInfo: { taskId, type: 'task_deadline' }
      });
    }
  }

  static updateTaskNotifications(task: Task): void {
    this.cancelTaskReminder(task.id);
    this.cancelTaskDeadline(task.id);
    
    if (!task.completed) {
      this.scheduleTaskReminder(task);
      this.scheduleTaskDeadline(task);
    }
  }

  static showInstantNotification(title: string, message: string): void {
    if (Platform.OS === 'ios') {
      PushNotification.presentLocalNotification({
        alertTitle: title,
        alertBody: message,
      });
    }
  }

  static setBadgeCount(count: number): void {
    if (Platform.OS === 'ios') {
      PushNotification.setApplicationIconBadgeNumber(count);
    }
  }

  static cleanup(): void {
    if (Platform.OS === 'ios') {
      PushNotification.removeEventListener('notification', this.onNotificationReceived);
      PushNotification.removeEventListener('localNotification', this.onLocalNotification);
    }
  }
}