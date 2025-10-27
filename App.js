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
  Alert 
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

// Configure the base API URL for our backend microservice
// Replace this with your deployed API endpoint for production use
const API_URL = 'http://localhost:3000/todos';
const SOCKET_URL = 'http://localhost:3000';

const App = () => {
  // State management for our todo list and new todo input
  // Using useState hook provides reactive updates to our UI
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO connection and fetch initial data
  // This enables real-time synchronization across all clients
  useEffect(() => {
    // Fetch initial todos from backend
    fetchTodos();

    // Establish WebSocket connection for real-time updates
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from real-time server');
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
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      // Display user-friendly error message if network request fails
      Alert.alert('Error', 'Failed to fetch todos');
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
    marginBottom: 20,
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