import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  SegmentedButtons,
  Switch,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTask } from '../../store/TaskContext';
import { Task, TasksStackParamList, TaskCategory, TaskPriority } from '../../types';
import { formatDateTime } from '../../utils';

type EditTaskScreenNavigationProp = StackNavigationProp<TasksStackParamList, 'EditTask'>;
type EditTaskScreenRouteProp = RouteProp<TasksStackParamList, 'EditTask'>;

const EditTaskScreen: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.PERSONAL);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [hasReminder, setHasReminder] = useState(false);
  const [reminder, setReminder] = useState(new Date());
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const navigation = useNavigation<EditTaskScreenNavigationProp>();
  const route = useRoute<EditTaskScreenRouteProp>();
  const { taskId } = route.params;

  const { state, updateTask } = useTask();

  useEffect(() => {
    const foundTask = state.tasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setTitle(foundTask.title);
      setDescription(foundTask.description || '');
      setCategory(foundTask.category);
      setPriority(foundTask.priority);
      setHasDueDate(!!foundTask.dueDate);
      setDueDate(foundTask.dueDate ? new Date(foundTask.dueDate) : new Date());
      setHasReminder(!!foundTask.reminder);
      setReminder(foundTask.reminder ? new Date(foundTask.reminder) : new Date());
    }
    setIsLoading(false);
  }, [taskId, state.tasks]);

  const categoryOptions = [
    { value: TaskCategory.WORK, label: 'Work' },
    { value: TaskCategory.PERSONAL, label: 'Personal' },
    { value: TaskCategory.SHOPPING, label: 'Shopping' },
    { value: TaskCategory.HEALTH, label: 'Health' },
    { value: TaskCategory.EDUCATION, label: 'Education' },
    { value: TaskCategory.OTHER, label: 'Other' },
  ];

  const priorityOptions = [
    { value: TaskPriority.LOW, label: 'Low' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.HIGH, label: 'High' },
    { value: TaskPriority.URGENT, label: 'Urgent' },
  ];

  const handleUpdateTask = async () => {
    if (!task) return;
    
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a task title.');
      return;
    }

    if (hasReminder && hasDueDate && reminder >= dueDate) {
      Alert.alert('Validation Error', 'Reminder time must be before the due date.');
      return;
    }

    setIsSaving(true);
    try {
      const updatedTask: Task = {
        ...task,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        dueDate: hasDueDate ? dueDate : undefined,
        reminder: hasReminder ? reminder : undefined,
      };

      await updateTask(updatedTask);

      Alert.alert('Success', 'Task updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task. Please try again.');
    } finally {
      setIsSaving(false);
    }
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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Task Details</Title>
          
          <TextInput
            label="Title *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            maxLength={100}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            maxLength={500}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Category</Title>
          <SegmentedButtons
            value={category}
            onValueChange={(value) => setCategory(value as TaskCategory)}
            buttons={categoryOptions}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Priority</Title>
          <SegmentedButtons
            value={priority}
            onValueChange={(value) => setPriority(value as TaskPriority)}
            buttons={priorityOptions}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Due Date</Title>
          <View style={styles.switchRow}>
            <Text>Set due date</Text>
            <Switch
              value={hasDueDate}
              onValueChange={setHasDueDate}
            />
          </View>
          
          {hasDueDate && (
            <>
              <Button
                mode="outlined"
                onPress={() => setShowDueDatePicker(true)}
                style={styles.dateButton}
              >
                {formatDateTime(dueDate)}
              </Button>
              
              <DatePicker
                modal
                open={showDueDatePicker}
                date={dueDate}
                onConfirm={(date) => {
                  setShowDueDatePicker(false);
                  setDueDate(date);
                }}
                onCancel={() => {
                  setShowDueDatePicker(false);
                }}
                minimumDate={new Date()}
              />
            </>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Reminder</Title>
          <View style={styles.switchRow}>
            <Text>Set reminder</Text>
            <Switch
              value={hasReminder}
              onValueChange={setHasReminder}
            />
          </View>
          
          {hasReminder && (
            <>
              <Button
                mode="outlined"
                onPress={() => setShowReminderPicker(true)}
                style={styles.dateButton}
              >
                {formatDateTime(reminder)}
              </Button>
              
              <DatePicker
                modal
                open={showReminderPicker}
                date={reminder}
                onConfirm={(date) => {
                  setShowReminderPicker(false);
                  setReminder(date);
                }}
                onCancel={() => {
                  setShowReminderPicker(false);
                }}
                minimumDate={new Date()}
                maximumDate={hasDueDate ? dueDate : undefined}
              />
            </>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleUpdateTask}
          loading={isSaving}
          disabled={isSaving}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={isSaving}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>
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
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 8,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    borderColor: '#666',
  },
});

export default EditTaskScreen;