import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Text,
  Title,
  Badge,
} from 'react-native-paper';

import { useTask } from '../../store/SimpleTaskContext';
import { TaskCategory } from '../../types';
import { getCategoryColor } from '../../utils';

interface CategoryData {
  category: TaskCategory;
  title: string;
  color: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

const CategoriesScreen: React.FC = () => {
  const { state } = useTask();

  const categoryData: CategoryData[] = Object.values(TaskCategory).map(category => {
    const categoryTasks = state.tasks.filter(task => task.category === category);
    const completedTasks = categoryTasks.filter(task => task.completed);
    const pendingTasks = categoryTasks.filter(task => !task.completed);

    return {
      category,
      title: category.charAt(0).toUpperCase() + category.slice(1),
      color: getCategoryColor(category),
      totalTasks: categoryTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
    };
  });

  const renderCategoryCard = ({ item }: { item: CategoryData }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
            <Title style={styles.categoryTitle}>{item.title}</Title>
          </View>
          
          <Badge style={[styles.badge, { backgroundColor: item.color }]}>
            {item.totalTasks}
          </Badge>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.pendingTasks}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.completedTasks}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {item.totalTasks > 0 ? Math.round((item.completedTasks / item.totalTasks) * 100) : 0}%
            </Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        {item.totalTasks > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: item.color,
                  width: `${(item.completedTasks / item.totalTasks) * 100}%`,
                },
              ]}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No tasks yet</Text>
      <Text style={styles.emptySubtext}>
        Create your first task to see category statistics
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryData}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.category}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    minWidth: 24,
    height: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
});

export default CategoriesScreen;