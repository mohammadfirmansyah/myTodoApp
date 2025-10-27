# Contributing to My Todo App

Thank you for your interest in contributing to My Todo App! We welcome contributions from the community and appreciate your effort to make this project better.

## 🚀 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Screenshots**: If applicable, add screenshots
- **Environment**: Device, OS version, React Native version

### Suggesting Enhancements

We love new ideas! To suggest an enhancement:
1. Check if the enhancement has already been suggested
2. Create an issue with the `enhancement` label
3. Describe the feature and its benefits
4. Provide examples or mockups if possible

### Pull Requests

We actively welcome your pull requests!

1. **Fork the repository**
   ```bash
   gh repo fork mohammadfirmansyah/myTodoApp
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/myTodoApp.git
   cd myTodoApp
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Ensure your code passes all tests

6. **Test your changes**
   ```bash
   npm test
   npx expo start
   ```

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

8. **Push to your fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

9. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your feature branch
   - Fill in the PR template with details

## 📝 Code Style Guidelines

### JavaScript/React Native

- Use functional components with hooks
- Follow ESLint rules
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use async/await for asynchronous operations

### Example:

```javascript
// Fetch all todos from the backend API
// This function uses async/await for cleaner asynchronous code
const fetchTodos = async () => {
  try {
    const response = await axios.get(API_URL);
    setTodos(response.data);
  } catch (error) {
    Alert.alert('Error', 'Failed to fetch todos');
  }
};
```

### Naming Conventions

- **Components**: PascalCase (e.g., `TodoItem`, `AddButton`)
- **Functions**: camelCase (e.g., `fetchTodos`, `addTodo`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_ITEMS`)
- **Files**: camelCase or kebab-case (e.g., `todoItem.js`, `todo-item.js`)

## 🧪 Testing

Before submitting a PR, ensure:
- The app runs without errors
- All existing features still work
- Your new feature works as expected
- No console warnings or errors

## 📚 Documentation

If you add a new feature:
- Update the README.md if necessary
- Add inline comments explaining complex logic
- Update or create relevant documentation files

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- Be respectful and considerate
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling, insulting, or derogatory comments
- Publishing others' private information
- Any conduct that could be considered inappropriate

## 💡 Getting Help

If you need help:
- Check existing issues and discussions
- Read the documentation thoroughly
- Ask questions in a new issue with the `question` label
- Join our community discussions

## 🎯 Priority Areas

We especially welcome contributions in these areas:
- Bug fixes and error handling improvements
- Performance optimizations
- UI/UX enhancements
- Test coverage improvements
- Documentation improvements
- Accessibility features
- Internationalization (i18n)

## 📋 Checklist

Before submitting your PR, make sure:
- [ ] Code follows the project's style guidelines
- [ ] Self-review of your code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated if needed
- [ ] No new warnings generated
- [ ] All tests pass
- [ ] Tested on both iOS and Android (if applicable)

## 🙏 Thank You!

Every contribution, no matter how small, is valuable and appreciated. Thank you for taking the time to contribute to My Todo App!

---

**Questions?** Feel free to reach out by creating an issue with the `question` label.

**Developer:** Mohammad Firman Syah
