import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Card,
  Text,
  Chip,
  IconButton,
  Badge,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Task } from '../types';
import { formatDate, isTaskOverdue, getCategoryColor, getPriorityColor } from '../utils';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onToggleCompletion: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, onToggleCompletion }) => {
  const isOverdue = isTaskOverdue(task);
  const categoryColor = getCategoryColor(task.category);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <Card style={[styles.card, task.completed && styles.completedCard]} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <TouchableOpacity onPress={onToggleCompletion} style={styles.checkbox}>
              <Icon
                name={task.completed ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={task.completed ? '#4CAF50' : '#666'}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.title,
                task.completed && styles.completedTitle,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
          </View>
          
          {isOverdue && !task.completed && (
            <Badge style={[styles.badge, { backgroundColor: '#F44336' }]}>
              Overdue
            </Badge>
          )}
        </View>

        {task.description && (
          <Text
            style={[styles.description, task.completed && styles.completedText]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.chips}>
            <View style={[styles.customChip, { backgroundColor: categoryColor }]}>
              <Text style={styles.customChipText}>{task.category}</Text>
            </View>
            
            <View style={[styles.customChip, styles.priorityChip, { backgroundColor: priorityColor }]}>
              <Text style={[styles.customChipText, styles.priorityText]}>{task.priority}</Text>
            </View>
          </View>

          <View style={styles.dates}>
            {task.dueDate && (
              <View style={styles.dateRow}>
                <Icon name="event" size={16} color="#666" />
                <Text style={[styles.dateText, isOverdue && !task.completed && styles.overdueText]}>
                  {formatDate(new Date(task.dueDate))}
                </Text>
              </View>
            )}
            
            {task.reminder && !task.completed && (
              <View style={styles.dateRow}>
                <Icon name="notifications" size={16} color="#666" />
                <Text style={styles.dateText}>
                  {formatDate(new Date(task.reminder))}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
  },
  completedCard: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  badge: {
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    marginLeft: 36,
  },
  completedText: {
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    height: 24,
  },
  chipText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  customChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 4,
  },
  priorityChip: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  customChipText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dates: {
    alignItems: 'flex-end',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  overdueText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
});

export default TaskItem;