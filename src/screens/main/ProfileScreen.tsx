import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Title,
  Button,
  Avatar,
  Divider,
  List,
  Switch,
  Dialog,
  Portal,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../../store/AuthContext';
import { useTask } from '../../store/TaskContext';
import { StorageService } from '../../services/storage';

const ProfileScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state: authState, signOut } = useAuth();
  const { state: taskState } = useTask();

  const totalTasks = taskState.tasks.length;
  const completedTasks = taskState.tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAllData = async () => {
    setIsLoading(true);
    try {
      await StorageService.clearAllData();
      setShowDeleteDialog(false);
      Alert.alert('Success', 'All local data has been deleted.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (email: string): string => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={getInitials(authState.user?.email || '')}
            style={styles.avatar}
          />
          
          <View style={styles.userInfo}>
            <Title style={styles.userName}>
              {authState.user?.displayName || 'User'}
            </Title>
            <Text style={styles.userEmail}>{authState.user?.email}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Task Statistics</Title>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedTasks}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pendingTasks}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Settings</Title>
          
          <List.Item
            title="Notifications"
            description="Receive push notifications for reminders"
            left={(props) => <List.Icon {...props} icon="notifications" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="About"
            description="App version and information"
            left={(props) => <List.Icon {...props} icon="info" />}
            onPress={() => Alert.alert('TaskTodo', 'Version 1.0.0\nBuilt with React Native')}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={(props) => <List.Icon {...props} icon="privacy-tip" />}
            onPress={() => Alert.alert('Privacy Policy', 'Your privacy is important to us. All data is stored locally on your device.')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Actions</Title>
          
          <Button
            mode="outlined"
            onPress={() => setShowDeleteDialog(true)}
            style={styles.actionButton}
            textColor="#F44336"
          >
            Delete All Local Data
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSignOut}
            style={[styles.actionButton, styles.signOutButton]}
          >
            Sign Out
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Delete All Data</Dialog.Title>
          <Dialog.Content>
            <Text>
              This will permanently delete all your tasks and app data from this device. 
              This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button
              onPress={handleDeleteAllData}
              loading={isLoading}
              disabled={isLoading}
              textColor="#F44336"
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#2196F3',
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  settingsCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  divider: {
    marginVertical: 8,
  },
  actionsCard: {
    margin: 16,
    marginBottom: 32,
    elevation: 2,
  },
  actionButton: {
    marginBottom: 12,
  },
  signOutButton: {
    backgroundColor: '#F44336',
  },
});

export default ProfileScreen;