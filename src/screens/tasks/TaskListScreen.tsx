import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  FAB,
  Searchbar,
  Menu,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTask } from '../../store/SimpleTaskContext';
import { Task, TasksStackParamList, TaskCategory, TaskPriority } from '../../types';
import TaskItem from '../../components/TaskItem';
import { sortTasksByDueDate, sortTasksByPriority } from '../../utils';

type TaskListScreenNavigationProp = StackNavigationProp<TasksStackParamList, 'TaskList'>;

const TaskListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | null>(null);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<TaskListScreenNavigationProp>();
  const { state, loadTasks, toggleTaskCompletion } = useTask();

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, [loadTasks]);

  const filteredTasks = state.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || task.category === filterCategory;
    const matchesPriority = !filterPriority || task.priority === filterPriority;
    const matchesCompletion = showCompleted || !task.completed;

    return matchesSearch && matchesCategory && matchesPriority && matchesCompletion;
  });

  const sortedTasks = sortBy === 'dueDate' 
    ? sortTasksByDueDate(filteredTasks)
    : sortTasksByPriority(filteredTasks);

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
      onToggleCompletion={() => toggleTaskCompletion(item.id)}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No tasks found</Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? 'Try adjusting your search or filters' : 'Add your first task to get started'}
      </Text>
    </View>
  );

  if (state.isLoading && state.tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <View style={styles.filterRow}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.filterButton}
              >
                Filters
              </Button>
            }
          >
            <Menu.Item onPress={() => {}} title="Category" />
            <Menu.Item onPress={() => {}} title="Priority" />
            <Menu.Item onPress={() => {}} title="Sort by" />
          </Menu>
          
          <Chip
            selected={showCompleted}
            onPress={() => setShowCompleted(!showCompleted)}
            style={styles.chip}
          >
            Show Completed
          </Chip>
        </View>
      </View>

      <FlatList
        data={sortedTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchbar: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    marginRight: 8,
  },
  chip: {
    marginHorizontal: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});

export default TaskListScreen;