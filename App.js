// App.js - Main Todo Application Component
// This is a complete CRUD application with real-time synchronization
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import { API_URL, SOCKET_URL, ENVIRONMENT_NAME } from './config';

// API configuration is now managed in config.js
// Switch between development and production by changing CURRENT_ENV in config.js

const App = () => {
  // State management for our todo list and new todo input
  // Using useState hook provides reactive updates to our UI
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Initialize Socket.IO connection and fetch initial data
  // This enables real-time synchronization across all clients
  useEffect(() => {
    // Fetch initial todos from backend
    fetchTodos();

    // Establish WebSocket connection for real-time updates
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    setSocket(socketInstance);

    // Listen for real-time todo updates from server
    // This fires whenever any client performs CRUD operations
    socketInstance.on('todos-updated', (updatedTodos) => {
      console.log('📡 Real-time update received');
      setTodos(updatedTodos);
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to real-time server');
      setIsConnected(true);
      setConnectionError(null);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from real-time server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.log('⚠️ Connection error:', error.message);
      setIsConnected(false);
      setConnectionError(error.message);
    });

    // Cleanup: disconnect socket when component unmounts
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  // Retrieve all todos from the backend API
  // This function uses async/await for cleaner asynchronous code
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      const response = await axios.get(API_URL, {
        timeout: 10000, // 10 second timeout
      });
      setTodos(response.data);
      setConnectionError(null);
    } catch (error) {
      // Display user-friendly error message if network request fails
      const errorMessage = error.response?.data?.error ||
                          error.message ||
                          'Failed to fetch todos';
      setConnectionError(errorMessage);
      console.error('Fetch error:', errorMessage);
      Alert.alert('Connection Error', `Unable to connect to API: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new todo item via POST request
  // No longer updates local state - real-time sync via Socket.IO
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await axios.post(API_URL, { title: newTodo });
      // Clear input field after successful creation
      setNewTodo('');
      // State update handled automatically by Socket.IO listener
    } catch (error) {
      Alert.alert('Error', 'Failed to add todo');
    }
  };

  // Remove a todo item using DELETE request
  // No longer updates local state - real-time sync via Socket.IO
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // State update handled automatically by Socket.IO listener
    } catch (error) {
      Alert.alert('Error', 'Failed to delete todo');
    }
  };

  // Toggle todo completion status via PUT request
  // No longer updates local state - real-time sync via Socket.IO
  const updateTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      await axios.put(`${API_URL}/${id}`, updatedTodo);
      // State update handled automatically by Socket.IO listener
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  // Main UI component structure
  // Using View as the container with flex layout for responsive design
  return (
    <View style={styles.container}>
      {/* Header title for the application */}
      <Text style={styles.title}>To-Do List</Text>

      {/* Connection status indicator */}
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusDot,
          { backgroundColor: isConnected ? '#4caf50' : '#f44336' }
        ]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Connected' : 'Disconnected'} - {ENVIRONMENT_NAME}
        </Text>
      </View>

      {/* Show error message and retry button if connection fails */}
      {connectionError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error: {connectionError}
          </Text>
          <Pressable style={styles.retryButton} onPress={fetchTodos}>
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </Pressable>
        </View>
      )}

      {/* Loading indicator while fetching data */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading todos...</Text>
        </View>
      )}

      {/* Input field for new todo entries */}
      {/* Controlled component pattern: value and onChange handler */}
      <TextInput
        style={styles.input}
        placeholder="New To-Do"
        value={newTodo}
        onChangeText={setNewTodo}
      />

      {/* Add button triggers todo creation */}
      <Pressable style={styles.addButton} onPress={addTodo}>
        <Text style={styles.addButtonText}>Add To-Do</Text>
      </Pressable>

      {/* FlatList renders our todo items efficiently */}
      {/* It only renders items visible on screen for better performance */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoContainer}>
            {/* Conditional styling: strike-through text for completed todos */}
            <Text 
              style={[
                styles.todoText, 
                item.completed && styles.completed
              ]}
            >
              {item.title}
            </Text>
            {/* Toggle button changes label based on completion status */}
            <Pressable onPress={() => updateTodo(item.id)}>
              <Text style={styles.buttonText}>
                {item.completed ? 'Unmark' : 'Complete'}
              </Text>
            </Pressable>
            {/* Delete button removes the todo from list */}
            <Pressable onPress={() => deleteTodo(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

// StyleSheet provides optimized styling for React Native components
// All styles are defined in a centralized location for maintainability
const styles = StyleSheet.create({
  // Main container uses flex layout to fill available space
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  // Header styling with bold font for visual hierarchy
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Connection status indicator container
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  // Status indicator dot (green for connected, red for disconnected)
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  // Status text styling
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  // Error message container with warning colors
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  // Error text styling for better readability
  errorText: {
    color: '#c62828',
    marginBottom: 10,
    fontSize: 13,
  },
  // Retry button styling
  retryButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  // Retry button text
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Loading indicator container
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
  },
  // Loading text below spinner
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  // Input field with border for clear visual boundaries
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  // Primary action button with blue background for emphasis
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  // White text on blue button for optimal contrast and readability
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Todo item container with horizontal layout for text and buttons
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  // Todo text takes available space using flex: 1
  todoText: {
    flex: 1,
  },
  // Completed state styling with strike-through and muted color
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  // Action button text styled consistently across the app
  buttonText: {
    color: 'blue',
    marginLeft: 10,
  },
});

export default App;