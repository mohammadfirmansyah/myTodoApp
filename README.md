# 📝 My Todo App

[![GitHub](https://img.shields.io/badge/GitHub-myTodoApp-blue?logo=github)](https://github.com/mohammadfirmansyah/myTodoApp)
[![React Native](https://img.shields.io/badge/React_Native-0.76.3-blue?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52.0.11-black?logo=expo)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A complete React Native Todo List application with full CRUD operations, built with Expo and integrated with a RESTful API backend. This project demonstrates modern mobile app development practices with clean architecture and responsive UI design.

## ✨ Key Features

- **Create Tasks**: Add new todo items through an intuitive input interface
- **Read Tasks**: Display all todos fetched from REST API with real-time updates
- **Update Tasks**: Mark tasks as completed or uncompleted with a single tap
- **Delete Tasks**: Remove tasks with confirmation to prevent accidental deletions
- **RESTful API Integration**: Seamless communication with backend microservices using Axios
- **Error Handling**: Comprehensive error alerts for network failures and API errors
- **Clean UI**: Modern, minimalist design with clear visual feedback
- **Cross-Platform**: Runs on iOS, Android, and Web platforms via Expo

## 📱 Screenshots / Demo

```
┌─────────────────────────────────┐
│     📝 To-Do List              │
├─────────────────────────────────┤
│  [New To-Do____________] [Add]  │
├─────────────────────────────────┤
│  ☐ Take clothes for laundry     │
│     [Complete] [Delete]         │
├─────────────────────────────────┤
│  ☑ Buy groceries                │
│     [Unmark] [Delete]           │
├─────────────────────────────────┤
│  ☐ Finish homework              │
│     [Complete] [Delete]         │
└─────────────────────────────────┘
```

## 🛠️ Technologies Used

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and toolchain
- **JavaScript** - Programming language
- **Axios** - HTTP client for API requests
- **REST API** - Backend integration (Node.js/Express/SQLite)
- **React Hooks** - useState, useEffect for state management

## 📂 Project Structure

```
myTodoApp/
├── App.js              # Main application component with CRUD logic
├── package.json        # Dependencies and project configuration
├── app.json            # Expo configuration
├── babel.config.js     # Babel configuration for React Native
├── assets/             # Images, fonts, and static resources
└── node_modules/       # Installed dependencies
```

## 🚀 Setup & Installation

Before you begin, make sure you have the following installed:
- **Node.js** >= 18.0
- **npm** or **yarn**
- **Expo CLI** (installed globally or via npx)
- **Backend Server** running on `http://localhost:3000`

Follow these steps to get your development environment running:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mohammadfirmansyah/myTodoApp.git
    cd myTodoApp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the backend server:**
    
    Make sure your Todo API backend is running on port 3000. If you're using the `ltsqj-crud_todo_sqlite` backend:
    ```bash
    cd ../ltsqj-crud_todo_sqlite
    npm install
    node index.js
    ```

## 💻 Usage / How to Run

1.  **Start the Expo development server:**
    ```bash
    npx expo start
    ```

2.  **Run on your preferred platform:**
    - Press `a` for Android emulator
    - Press `i` for iOS simulator (macOS only)
    - Press `w` for web browser
    - Scan QR code with Expo Go app on your physical device

3.  **Test the app:**
    - Add new tasks using the input field
    - Mark tasks as completed by tapping "Complete"
    - Delete tasks by tapping "Delete"
    - All changes sync with the backend API

## 📝 Code Highlights

### CRUD Operations with Axios

Here's how the app handles API communication:

```javascript
// Fetch all todos from the backend
const fetchTodos = async () => {
  try {
    const response = await axios.get(API_URL);
    setTodos(response.data);
  } catch (error) {
    Alert.alert('Error', 'Failed to fetch todos');
  }
};

// Add a new todo item
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
```

*This pattern demonstrates proper async/await usage with comprehensive error handling, ensuring a robust user experience even when network issues occur.*

### State Management

```javascript
// React Hooks for local state management
const [todos, setTodos] = useState([]);
const [newTodo, setNewTodo] = useState('');

// Fetch data on component mount
useEffect(() => {
  fetchTodos();
}, []);
```

*Using React Hooks provides a clean, functional approach to state management without the complexity of external state libraries.*

## 📖 Learning Outcomes

This project is an excellent demonstration of:

- ✅ **React Native Fundamentals**: Building mobile UIs with components and styling
- ✅ **API Integration**: Consuming RESTful APIs with Axios
- ✅ **Async Operations**: Handling asynchronous JavaScript with async/await
- ✅ **State Management**: Managing component state with React Hooks
- ✅ **Error Handling**: Implementing user-friendly error messages
- ✅ **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- ✅ **Mobile UX**: Designing intuitive mobile user interfaces
- ✅ **Cross-Platform Development**: Writing once, running everywhere with React Native

## 🔧 API Configuration

The app expects a REST API backend running at `http://localhost:3000/todos` with the following endpoints:

- **GET** `/todos` - Fetch all todos
- **POST** `/todos` - Create a new todo (body: `{ title: string }`)
- **PUT** `/todos/:id` - Update a todo (body: `{ title: string, completed: boolean }`)
- **DELETE** `/todos/:id` - Delete a todo

You can modify the API URL in `App.js`:
```javascript
const API_URL = 'http://localhost:3000/todos';
```

**Note for Android Emulator**: Replace `localhost` with `10.0.2.2`:
```javascript
const API_URL = 'http://10.0.2.2:3000/todos';
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 👨‍💻 Developer

- **Mohammad Firman Syah** - [mohammadfirmansyah@example.com]
- **Project Link:** [https://github.com/mohammadfirmansyah/myTodoApp](https://github.com/mohammadfirmansyah/myTodoApp)
- **Backend Repository:** [https://github.com/mohammadfirmansyah/ltsqj-crud_todo_sqlite](https://github.com/mohammadfirmansyah/ltsqj-crud_todo_sqlite)

---

**Note**: This app requires a running backend server. For production deployment, consider:
- Replacing `localhost` with your deployed API URL
- Adding authentication and authorization
- Implementing offline mode with local storage
- Adding loading states and optimistic UI updates
- Implementing pull-to-refresh functionality
