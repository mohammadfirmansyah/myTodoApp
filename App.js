// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

//Replace this with the API end-point to access the microservices
const API_URL = 'http://localhost:3000/todos';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch todos');
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(API_URL, { title: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete todo');
    }
  };

  const updateTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      await axios.put(`${API_URL}/${id}`, updatedTodo);
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <TextInput
        style={styles.input}
        placeholder="New To-Do"
        value={newTodo}
        onChangeText={setNewTodo}
      />

      <Pressable style={styles.addButton} onPress={addTodo}>
        <Text style={styles.addButtonText}>Add To-Do</Text>
      </Pressable>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoContainer}>
            <Text style={[styles.todoText, item.completed && styles.completed]}>
              {item.title}
            </Text>
            <Pressable onPress={() => updateTodo(item.id)}>
              <Text style={styles.buttonText}>{item.completed ? 'Unmark' : 'Complete'}</Text>
            </Pressable>
            <Pressable onPress={() => deleteTodo(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  todoText: {
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  buttonText: {
    color: 'blue',
    marginLeft: 10,
  },
});

export default App;