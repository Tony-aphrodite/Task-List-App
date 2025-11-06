import React, { useState } from 'react';
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
  Divider,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTask } from '../../store/TaskContext';
import { TasksStackParamList, TaskCategory, TaskPriority } from '../../types';
import { formatDateTime } from '../../utils';

type AddTaskScreenNavigationProp = StackNavigationProp<TasksStackParamList, 'AddTask'>;

const AddTaskScreen: React.FC = () => {
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
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<AddTaskScreenNavigationProp>();
  const { addTask } = useTask();

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

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a task title.');
      return;
    }

    if (hasReminder && hasDueDate && reminder >= dueDate) {
      Alert.alert('Validation Error', 'Reminder time must be before the due date.');
      return;
    }

    setIsLoading(true);
    try {
      await addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        completed: false,
        dueDate: hasDueDate ? dueDate : undefined,
        reminder: hasReminder ? reminder : undefined,
      });

      Alert.alert('Success', 'Task created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          onPress={handleAddTask}
          loading={isLoading}
          disabled={isLoading}
          style={styles.addButton}
        >
          Create Task
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={isLoading}
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
  addButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    borderColor: '#666',
  },
});

export default AddTaskScreen;