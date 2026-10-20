# TaskTodo

A React Native to-do app for Android and iOS. Tasks are stored on the device with AsyncStorage and can be grouped by category and priority. An optional root component adds Firebase email/password sign-in.

![React Native](https://img.shields.io/badge/React_Native-0.82.1-61DAFB?logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)
![React Native Paper](https://img.shields.io/badge/React_Native_Paper-5.14.5-6200EE)

> The default entry point currently shows the task list, categories and profile tabs only. See [Known limitations](#known-limitations).

## Features

- **Local task storage**: tasks are saved as JSON in AsyncStorage (`src/services/storage.ts`), so the default build works offline with no account. Three sample tasks are added on first launch.
- **Task fields**: title, description, one of six categories (work, personal, shopping, health, education, other), one of four priorities (low, medium, high, urgent), and an optional due date and reminder picked with `react-native-date-picker`. The add form checks that a title is set and that the reminder comes before the due date.
- **Task list**: search by title or description, a "Show Completed" toggle, sorting by due date, pull-to-refresh and a checkbox on each card to mark a task done.
- **Task details**: shows category, priority, created, updated and due dates and the reminder, with edit and delete (delete asks for confirmation).
- **Categories tab**: pending and completed counts per category with a color-coded progress bar.
- **Profile tab**: total, completed and pending tasks and the completion rate.
- **Optional Firebase sign-in** (`App_Firebase.tsx`): sign up, log in, password reset email and sign out with Firebase Authentication.
- **iOS local notifications** (used by `TaskContext`): a reminder at the chosen time and an alert 24 hours before the due date.

## Tech stack

| Area | Libraries |
| --- | --- |
| App | React Native 0.82, React 19, TypeScript |
| UI | React Native Paper, react-native-vector-icons (Material Icons) |
| Navigation | React Navigation 7 (stack and bottom tabs) |
| State and storage | React Context with `useReducer`, AsyncStorage |
| Auth and notifications | `@react-native-firebase/auth`, `@react-native-community/push-notification-ios` |
| Testing | Jest, react-test-renderer |

## Getting started

### Prerequisites

- Node.js 20 or later (set in `package.json` `engines`)
- A React Native development environment: Android Studio and a JDK for Android; Xcode, Ruby and Bundler for iOS (see the [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment))

### Install and run

```bash
npm install

# Start Metro
npm start

# In a second terminal
npm run android

# iOS: install CocoaPods through Bundler the first time, then the pods
bundle install
cd ios && bundle exec pod install && cd ..
npm run ios
```

### Other scripts

```bash
npm test       # Jest tests in __tests__/ (App render, storage service, utils)
npm run lint   # ESLint
```

### Firebase configuration (only for `App_Firebase.tsx`)

The default `App.tsx` does not call Firebase. To use the Firebase variant, create your own Firebase project and supply:

- `android/app/google-services.json`: Firebase Android config for package `com.tasktodoapp`. The file in the repo is a placeholder.
- `ios/GoogleService-Info.plist`: Firebase iOS config (not in the repo).

`android/app/build.gradle` does not apply the Google Services Gradle plugin yet, so add it when you set up Firebase on Android. `firebase.config.example.js` is a template only and is not imported by the app.

## Project structure

```
index.js              # Registers App.tsx as the root component
App.tsx               # Default root: SimpleTaskProvider + tab navigator, no login
App_Firebase.tsx      # Alternative root: AuthProvider + TaskProvider + auth-aware navigator
App_Simple.tsx        # Alternative root: TaskProvider + tab navigator
src/
├── components/       # TaskItem card
├── navigation/       # Auth stack, tab navigators, tasks stack
├── screens/
│   ├── auth/         # Login, Signup, ForgotPassword
│   ├── main/         # Categories, Profile, SimpleProfile
│   └── tasks/        # TaskList, TaskDetails, AddTask, EditTask
├── services/         # AsyncStorage, Firebase Auth/Messaging, iOS notifications
├── store/            # AuthContext, TaskContext, SimpleTaskContext
├── types/            # Task, category, priority and navigation types
└── utils/            # IDs, date formatting, sorting, colors, validation
__tests__/            # Jest tests
android/, ios/        # Native projects
```

## Known limitations

- In the default `App.tsx`, the tab navigator mounts `TaskListScreen` directly and does not register the `AddTask`, `TaskDetails` or `EditTask` routes, so the "+" button and tapping a task have no screen to open.
- The screens use two different task contexts: `TaskListScreen` and `CategoriesScreen` read from `SimpleTaskContext`, while `AddTaskScreen`, `EditTaskScreen`, `TaskDetailsScreen` and `ProfileScreen` read from `TaskContext`. Each root component provides only one of them, so no root currently connects every screen.
- The "Filters" menu items (Category, Priority, Sort by) have no handlers yet; the list is always sorted by due date.
- Notifications are only implemented for iOS; on Android the notification calls do nothing.
