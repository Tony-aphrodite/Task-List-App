import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Chip,
  Button,
  IconButton,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTask } from '../../store/TaskContext';
import { Task, TasksStackParamList } from '../../types';
import { formatDateTime, getCategoryColor, getPriorityColor, isTaskOverdue } from '../../utils';

type TaskDetailsScreenNavigationProp = StackNavigationProp<TasksStackParamList, 'TaskDetails'>;
type TaskDetailsScreenRouteProp = RouteProp<TasksStackParamList, 'TaskDetails'>;

const TaskDetailsScreen: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation<TaskDetailsScreenNavigationProp>();
  const route = useRoute<TaskDetailsScreenRouteProp>();
  const { taskId } = route.params;

  const { state, toggleTaskCompletion, deleteTask } = useTask();

  useEffect(() => {
    const foundTask = state.tasks.find(t => t.id === taskId);
    setTask(foundTask || null);
    setIsLoading(false);
  }, [taskId, state.tasks]);

  const handleToggleCompletion = async () => {
    if (!task) return;
    await toggleTaskCompletion(task.id);
  };

  const handleEdit = () => {
    if (!task) return;
    navigation.navigate('EditTask', { taskId: task.id });
  };

  const handleDelete = () => {
    if (!task) return;
    
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Task not found</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  const isOverdue = isTaskOverdue(task);
  const categoryColor = getCategoryColor(task.category);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Title style={[styles.title, task.completed && styles.completedTitle]}>
                {task.title}
              </Title>
              
              <View style={styles.statusRow}>
                {task.completed && (
                  <Chip icon="check" style={styles.completedChip}>
                    Completed
                  </Chip>
                )}
                
                {isOverdue && !task.completed && (
                  <Chip icon="warning" style={styles.overdueChip}>
                    Overdue
                  </Chip>
                )}
              </View>
            </View>

            <View style={styles.actions}>
              <IconButton
                icon="edit"
                onPress={handleEdit}
                iconColor="#2196F3"
              />
              <IconButton
                icon="delete"
                onPress={handleDelete}
                iconColor="#F44336"
              />
            </View>
          </View>

          {task.description && (
            <>
              <Divider style={styles.divider} />
              <Text style={[styles.description, task.completed && styles.completedText]}>
                {task.description}
              </Text>
            </>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Details</Title>
          
          <View style={styles.detailRow}>
            <Icon name="category" size={20} color="#666" />
            <Text style={styles.detailLabel}>Category:</Text>
            <Chip
              style={[styles.chip, { backgroundColor: categoryColor }]}
              textStyle={styles.chipText}
            >
              {task.category}
            </Chip>
          </View>

          <View style={styles.detailRow}>
            <Icon name="priority-high" size={20} color="#666" />
            <Text style={styles.detailLabel}>Priority:</Text>
            <Chip
              style={[styles.chip, { backgroundColor: priorityColor }]}
              textStyle={styles.chipText}
            >
              {task.priority}
            </Chip>
          </View>

          <View style={styles.detailRow}>
            <Icon name="access-time" size={20} color="#666" />
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>
              {formatDateTime(new Date(task.createdAt))}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="update" size={20} color="#666" />
            <Text style={styles.detailLabel}>Updated:</Text>
            <Text style={styles.detailValue}>
              {formatDateTime(new Date(task.updatedAt))}
            </Text>
          </View>

          {task.dueDate && (
            <View style={styles.detailRow}>
              <Icon name="event" size={20} color={isOverdue && !task.completed ? "#F44336" : "#666"} />
              <Text style={styles.detailLabel}>Due Date:</Text>
              <Text style={[
                styles.detailValue,
                isOverdue && !task.completed && styles.overdueText
              ]}>
                {formatDateTime(new Date(task.dueDate))}
              </Text>
            </View>
          )}

          {task.reminder && !task.completed && (
            <View style={styles.detailRow}>
              <Icon name="notifications" size={20} color="#666" />
              <Text style={styles.detailLabel}>Reminder:</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(new Date(task.reminder))}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode={task.completed ? "outlined" : "contained"}
            onPress={handleToggleCompletion}
            icon={task.completed ? "refresh" : "check"}
            style={styles.toggleButton}
          >
            {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  completedChip: {
    backgroundColor: '#4CAF50',
  },
  overdueChip: {
    backgroundColor: '#F44336',
  },
  actions: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  completedText: {
    color: '#999',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  overdueText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  chip: {
    height: 24,
  },
  chipText: {
    fontSize: 12,
    color: '#fff',
  },
  toggleButton: {
    marginTop: 8,
  },
});

export default TaskDetailsScreen;