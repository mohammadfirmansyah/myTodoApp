# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-28

**GitHub Release:** [v1.1.0](https://github.com/mohammadfirmansyah/myTodoApp/releases/tag/v1.1.0)

### Added
- Socket.IO client integration for real-time synchronization
- WebSocket-based live updates across all connected devices
- Automatic UI refresh when backend data changes
- Connection handling with automatic reconnection (5 attempts, 1s delay)
- Real-time synchronization architecture diagrams in README
- Socket.IO Client dependency (v4.8.1)

### Fixed
- Added missing package.json metadata (description, author, license, keywords, repository)
- Corrected React Native version inconsistency from 0.76.3 to 0.81.5 across all documentation
- Updated Expo SDK version from 52.0.11 to 54.0.20 in README, CHANGELOG, and release notes
- Properly declared MIT license in package.json to match LICENSE file
- Added GitHub repository URL for better npm package integration

### Changed
- Updated package.json with complete metadata for better discoverability
- Ensured version consistency across package.json, app.json, and all documentation
- Enhanced README with WebSocket communication flow diagrams

### Developer
- Mohammad Firman Syah

## [1.0.0] - 2025-10-27

**GitHub Release:** [v1.0.0](https://github.com/mohammadfirmansyah/myTodoApp/releases/tag/v1.0.0)

### Added
- Complete CRUD functionality for todo items
- Integration with REST API backend using Axios
- Create new todos with input validation
- Read and display all todos from API
- Update todo completion status with toggle button
- Delete todos with confirmation
- Error handling with user-friendly alerts
- Clean and responsive UI design
- FlatList for efficient rendering of todo items
- Comprehensive README.md documentation
- Tutorial-style code comments throughout the application
- MIT License
- Contributing guidelines
- This changelog

### Features
- **Create**: Add new todo items through intuitive input interface
- **Read**: Display all todos fetched from REST API with real-time updates
- **Update**: Mark tasks as completed or uncompleted with a single tap
- **Delete**: Remove tasks with proper error handling
- **API Integration**: Seamless communication with backend microservices
- **Cross-Platform**: Runs on iOS, Android, and Web via Expo

### Technical Details
- React Native version: 0.81.5
- Expo SDK version: 54.0.20
- Axios for HTTP requests
- React Hooks (useState, useEffect) for state management
- StyleSheet for component styling

### Developer
- Mohammad Firman Syah

## [Unreleased]

### Planned Features
- Offline mode with local storage persistence
- Pull-to-refresh functionality
- Loading states and skeleton screens
- Optimistic UI updates
- Task categorization and filtering
- Due dates and reminders
- Task priority levels
- Search functionality
- Dark mode support
- Internationalization (i18n)
- User authentication
- Task sharing capabilities

### Future Improvements
- Add unit tests with Jest
- Add E2E tests with Detox
- Implement Redux for state management
- Add TypeScript support
- Performance optimizations
- Accessibility improvements
- Animation enhancements

---

**Note:** This project is actively maintained. Check the [GitHub repository](https://github.com/mohammadfirmansyah/myTodoApp) for the latest updates.
