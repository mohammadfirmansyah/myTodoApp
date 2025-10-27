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
  ActivityIndicator,
  Switch,
  ScrollView
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const App = () => {
  // API Configuration State - User can switch between local and custom server
  const [useLocalServer, setUseLocalServer] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState('https://todolist.220fii1j0spm.us-south.codeengine.appdomain.cloud');
  const [localServerUrl] = useState('http://localhost:3000');
  const [showSettings, setShowSettings] = useState(false);
  
  // Derived API URLs based on current configuration
  const API_URL = useLocalServer 
    ? `${localServerUrl}/todos` 
    : `${customServerUrl}/todos`;
  const SOCKET_URL = useLocalServer 
    ? localServerUrl 
    : customServerUrl;
  const ENVIRONMENT_NAME = useLocalServer 
    ? 'Local Server' 
    : 'Remote Server';

  // State management for our todo list and new todo input
  // Using useState hook provides reactive updates to our UI
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);
  const [showDebug, setShowDebug] = useState(false);

  // Add debug log entry with timestamp
  const addDebugLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    setDebugLogs(prev => [...prev.slice(-49), logEntry]); // Keep last 50 logs
  };

  // Initialize Socket.IO connection and fetch initial data
  // This enables real-time synchronization across all clients
  // Reconnects when server URL changes
  useEffect(() => {
    addDebugLog(`Configuration changed - Server: ${useLocalServer ? 'Local' : 'Remote'}`, 'config');
    addDebugLog(`API URL: ${API_URL}`, 'config');
    addDebugLog(`Socket URL: ${SOCKET_URL}`, 'config');

    // Disconnect existing socket if any
    if (socket) {
      addDebugLog('Disconnecting previous socket connection', 'socket');
      socket.removeAllListeners(); // Clean up all listeners
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }

    // Reset state when switching servers
    setConnectionError(null);
    setTodos([]);
    
    // Fetch initial todos from backend
    fetchTodos();

    // Establish WebSocket connection for real-time updates
    // For HTTPS endpoints, Socket.IO automatically uses WSS (secure WebSocket)
    // Production environments may require long-polling as primary transport
    const socketInstance = io(SOCKET_URL, {
      transports: !useLocalServer ? ['polling'] : ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 30000,
      forceNew: true,
      upgrade: true, // Allow transport upgrade when possible
      rememberUpgrade: true,
    });

    addDebugLog(`Creating socket connection to ${SOCKET_URL}`, 'socket');
    setSocket(socketInstance);

    // Listen for real-time todo updates from server
    // This fires whenever any client performs CRUD operations
    socketInstance.on('todos-updated', (updatedTodos) => {
      addDebugLog(`Real-time update received: ${updatedTodos?.length || 0} todos`, 'socket');
      setTodos(updatedTodos);
    });

    socketInstance.on('connect', () => {
      const transport = socketInstance.io.engine.transport.name;
      addDebugLog(`Connected! Socket ID: ${socketInstance.id}`, 'socket');
      addDebugLog(`Transport: ${transport}`, 'socket');
      setIsConnected(true);
      setConnectionError(null);
      // Refetch todos when reconnected to ensure sync
      fetchTodos();
    });

    socketInstance.on('disconnect', (reason) => {
      addDebugLog(`Disconnected - Reason: ${reason}`, 'socket');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      addDebugLog(`Connection error: ${error.message}`, 'error');
      addDebugLog('Using fallback: manual polling via HTTP', 'warn');
      setIsConnected(false);
      setConnectionError(error.message);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      addDebugLog(`Reconnection attempt #${attemptNumber}`, 'socket');
    });

    socketInstance.io.engine.on('upgrade', (transport) => {
      addDebugLog(`Transport upgraded to: ${transport.name}`, 'socket');
    });

    // Cleanup: disconnect socket when component unmounts or URL changes
    return () => {
      if (socketInstance) {
        addDebugLog('Cleaning up socket connection', 'socket');
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
      }
    };
  }, [useLocalServer, customServerUrl]); // Reconnect when server configuration changes

  // Retrieve all todos from the backend API
  // This function uses async/await for cleaner asynchronous code
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      addDebugLog(`Fetching todos from: ${API_URL}`, 'api');

      const response = await axios.get(API_URL, {
        timeout: 10000, // 10 second timeout
      });

      addDebugLog(`Fetch successful! Status: ${response.status}`, 'api');
      addDebugLog(`Received ${response.data?.length || 0} todos`, 'api');
      
      // Log each todo for debugging
      if (response.data && response.data.length > 0) {
        response.data.forEach((todo, index) => {
          addDebugLog(`Todo ${index + 1}: ${todo.title} (ID: ${todo.id}, Completed: ${todo.completed})`, 'data');
        });
      }

      setTodos(response.data);
      setConnectionError(null);
    } catch (error) {
      // Display user-friendly error message if network request fails
      const errorMessage = error.response?.data?.error ||
                          error.message ||
                          'Failed to fetch todos';
      setConnectionError(errorMessage);
      addDebugLog(`Fetch error: ${errorMessage}`, 'error');
      addDebugLog(`Error details: ${error.code || 'Unknown'}`, 'error');
      Alert.alert('Connection Error', `Unable to connect to API: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new todo item via POST request
  // After successful creation, state will be updated via Socket.IO or manual refetch
  const addTodo = async () => {
    if (!newTodo.trim()) {
      addDebugLog('Add todo skipped: empty input', 'warn');
      return;
    }
    
    try {
      addDebugLog(`Adding new todo: "${newTodo}"`, 'api');
      const response = await axios.post(API_URL, { title: newTodo });
      addDebugLog(`Todo added successfully! ID: ${response.data.id}`, 'api');

      // Clear input field after successful creation
      setNewTodo('');

      // If Socket.IO doesn't update, manually refetch as fallback
      setTimeout(() => {
        addDebugLog('Fallback: Refetching todos after add', 'fallback');
        fetchTodos();
      }, 300);
    } catch (error) {
      addDebugLog(`Failed to add todo: ${error.message}`, 'error');
      Alert.alert('Error', 'Failed to add todo');
    }
  };

  // Remove a todo item using DELETE request
  // After successful deletion, state will be updated via Socket.IO or manual refetch
  const deleteTodo = async (id) => {
    try {
      addDebugLog(`Deleting todo ID: ${id}`, 'api');
      await axios.delete(`${API_URL}/${id}`);
      addDebugLog(`Todo deleted successfully! ID: ${id}`, 'api');

      // If Socket.IO doesn't update, manually refetch as fallback
      setTimeout(() => {
        addDebugLog('Fallback: Refetching todos after delete', 'fallback');
        fetchTodos();
      }, 300);
    } catch (error) {
      addDebugLog(`Failed to delete todo: ${error.message}`, 'error');
      Alert.alert('Error', 'Failed to delete todo');
    }
  };

  // Toggle todo completion status via PUT request
  // After successful update, state will be updated via Socket.IO or manual refetch
  const updateTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      addDebugLog(`Update failed: Todo ID ${id} not found`, 'error');
      return;
    }

    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      addDebugLog(`Updating todo ID: ${id} to ${updatedTodo.completed ? 'completed' : 'active'}`, 'api');
      await axios.put(`${API_URL}/${id}`, updatedTodo);
      addDebugLog(`Todo updated successfully! ID: ${id}`, 'api');

      // If Socket.IO doesn't update, manually refetch as fallback
      setTimeout(() => {
        addDebugLog('Fallback: Refetching todos after update', 'fallback');
        fetchTodos();
      }, 300);
    } catch (error) {
      addDebugLog(`Failed to update todo: ${error.message}`, 'error');
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  // Main UI component structure
  // Using View as the container with flex layout for responsive design
  return (
    <View style={styles.container}>
      {/* Header title for the application */}
      <Text style={styles.title}>To-Do List</Text>

      {/* Settings toggle button */}
      <Pressable 
        style={styles.settingsButton} 
        onPress={() => setShowSettings(!showSettings)}
      >
        <Text style={styles.settingsButtonText}>
          {showSettings ? '▼ Hide Settings' : '▶ Show Settings'}
        </Text>
      </Pressable>

      {/* Server Configuration Settings */}
      {showSettings && (
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Server Configuration</Text>
          
          {/* Toggle between Local and Remote Server */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {useLocalServer ? '🏠 Local Server' : '☁️ Remote Server'}
            </Text>
            <Switch
              value={useLocalServer}
              onValueChange={(value) => {
                setUseLocalServer(value);
                console.log('🔄 Switching to:', value ? 'Local' : 'Remote');
              }}
              trackColor={{ false: '#2196F3', true: '#4caf50' }}
              thumbColor={useLocalServer ? '#fff' : '#fff'}
            />
          </View>

          {/* Custom Server URL Input (only for remote) */}
          {!useLocalServer && (
            <View style={styles.urlInputContainer}>
              <Text style={styles.urlLabel}>Remote Server URL:</Text>
              <TextInput
                style={styles.urlInput}
                placeholder="https://your-server.com"
                placeholderTextColor="#999"
                value={customServerUrl}
                onChangeText={setCustomServerUrl}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          {/* Local Server URL Display (read-only) */}
          {useLocalServer && (
            <View style={styles.urlDisplayContainer}>
              <Text style={styles.urlLabel}>Local Server URL:</Text>
              <Text style={styles.urlDisplay}>{localServerUrl}</Text>
            </View>
          )}

          {/* Current Active URL */}
          <View style={styles.activeUrlContainer}>
            <Text style={styles.activeUrlLabel}>Active API:</Text>
            <Text style={styles.activeUrl}>{API_URL}</Text>
          </View>
        </View>
      )}

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

      {/* Debug Panel Toggle Button */}
      <Pressable 
        style={styles.debugButton} 
        onPress={() => setShowDebug(!showDebug)}
      >
        <Text style={styles.debugButtonText}>
          {showDebug ? '▼ Hide Debug Logs' : '▶ Show Debug Logs'} ({debugLogs.length})
        </Text>
      </Pressable>

      {/* Debug Logs Panel */}
      {showDebug && (
        <View style={styles.debugContainer}>
          <View style={styles.debugHeader}>
            <Text style={styles.debugTitle}>🔍 Debug Logs (Last 50)</Text>
            <Pressable 
              style={styles.clearLogsButton}
              onPress={() => {
                setDebugLogs([]);
                addDebugLog('Debug logs cleared', 'system');
              }}
            >
              <Text style={styles.clearLogsText}>Clear</Text>
            </Pressable>
          </View>
          <FlatList
            data={[...debugLogs].reverse()} // Show newest first
            style={styles.debugList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              let logColor = '#333';
              if (item.includes('ERROR:')) logColor = '#f44336';
              else if (item.includes('WARN:')) logColor = '#ff9800';
              else if (item.includes('API:')) logColor = '#2196F3';
              else if (item.includes('SOCKET:')) logColor = '#4caf50';
              else if (item.includes('CONFIG:')) logColor = '#9c27b0';
              else if (item.includes('DATA:')) logColor = '#00bcd4';
              else if (item.includes('FALLBACK:')) logColor = '#ff5722';
              
              return (
                <Text style={[styles.debugLog, { color: logColor }]}>{item}</Text>
              );
            }}
          />
        </View>
      )}

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
      {/* Key prop forces re-render when switching servers to ensure consistency */}
      <TextInput
        key={`todo-input-${useLocalServer ? 'local' : 'remote'}`}
        style={styles.input}
        placeholder="Enter new todo..."
        placeholderTextColor="#999"
        value={newTodo}
        onChangeText={setNewTodo}
        autoCapitalize="sentences"
        returnKeyType="done"
        onSubmitEditing={addTodo}
      />

      {/* Add button triggers todo creation */}
      <Pressable style={styles.addButton} onPress={addTodo}>
        <Text style={styles.addButtonText}>Add To-Do</Text>
      </Pressable>

      {/* Show todo count for debugging */}
      <Text style={styles.debugText}>
        Total Todos: {todos.length}
      </Text>

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
  // Debug text to show todo count
  debugText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
    fontStyle: 'italic',
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
  // Settings toggle button
  settingsButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Settings container with card-like appearance
  settingsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  // Switch container for server toggle
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // URL input container
  urlInputContainer: {
    marginBottom: 15,
  },
  urlLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  urlInput: {
    height: 45,
    borderColor: '#2196F3',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#333',
  },
  // URL display for local server (read-only)
  urlDisplayContainer: {
    marginBottom: 15,
  },
  urlDisplay: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '600',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  // Active URL display
  activeUrlContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  activeUrlLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 3,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  activeUrl: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  // Debug panel styles
  debugButton: {
    backgroundColor: '#ff9800',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  debugButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  debugContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 250,
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  clearLogsButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
  },
  clearLogsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  debugList: {
    padding: 10,
  },
  debugLog: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 4,
    lineHeight: 16,
  },
});

export default App;
