# StudyNext Architecture

## Overview

StudyNext is a cross-platform homework planner built with React and Firebase, following a **component-based architecture** with a clear separation of concerns.

## Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Pages  │  │Components│  │  Hooks  │  │ Context │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        │            │            │            │
┌───────┴────────────┴────────────┴────────────┴──────────────┐
│                     Service Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │homeworkService│  │ userService  │  │ examService  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
┌─────────┴─────────────────┴─────────────────┴───────────────┐
│                    Storage Adapter Layer                     │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  FirebaseAdapter │  │LocalStorageAdapter│                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
└───────────┼─────────────────────┼───────────────────────────┘
            │                     │
    ┌───────┴───────┐     ┌───────┴───────┐
    │   Firestore   │     │  localStorage │
    └───────────────┘     └───────────────┘
```

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx       # Main app shell with navigation
│   ├── FocusTimer.jsx   # Pomodoro timer component
│   ├── EmptyState.jsx   # Empty state illustrations
│   └── ...
├── pages/               # Route-level components
│   ├── Dashboard.jsx    # Main dashboard with stats
│   ├── HomeworkList.jsx # Task list view
│   ├── CalendarView.jsx # Calendar visualization
│   ├── Reports.jsx      # Analytics & charts
│   └── ...
├── contexts/            # React Context providers
│   └── AuthContext.jsx  # Authentication state management
├── hooks/               # Custom React hooks
│   ├── useFocusTimer.js # Timer logic
│   ├── useMediaQuery.js # Responsive breakpoints
│   └── useReminders.js  # Notification scheduling
├── services/            # Business logic & data access
│   ├── homeworkService.js
│   ├── userService.js
│   ├── examService.js
│   └── adapters/        # Storage abstraction
│       ├── StorageAdapter.js
│       ├── FirebaseAdapter.js
│       └── LocalStorageAdapter.js
└── styles/              # Global CSS
```

## Key Design Decisions

### 1. Context API for State Management
Using React Context instead of Redux for simplicity:
- `AuthContext` manages user authentication state
- Avoids prop drilling through component tree
- Sufficient for app's complexity level

### 2. Storage Adapter Pattern
Abstract storage layer allows swapping backends:
```javascript
// services/adapters/StorageAdapter.js
class StorageAdapter {
  async get(key) { throw new Error('Not implemented'); }
  async set(key, value) { throw new Error('Not implemented'); }
  async delete(key) { throw new Error('Not implemented'); }
}
```
Benefits:
- Easy to switch between Firebase and localStorage
- Enables offline-first capability
- Simplifies testing with mock adapters

### 3. Service Layer Separation
Services encapsulate all data operations:
- Components never directly access Firebase
- Business logic centralized in services
- Easier to test and maintain

### 4. Responsive Design Strategy
- Mobile-first approach with CSS variables
- `useMediaQuery` hook for breakpoint detection
- Separate `BottomNav` (mobile) and `Sidebar` (desktop)

## Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│ Firebase │────▶│  Auth    │────▶│ Dashboard│
│  Page    │     │   Auth   │     │ Context  │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                       │
                       ▼
               ┌──────────────┐
               │  Firestore   │
               │ User Profile │
               └──────────────┘
```

## Security Model

Firebase Security Rules enforce:
1. **Authentication Required** - All operations require `request.auth != null`
2. **User Isolation** - Users can only access their own data
3. **XP Anti-Cheat** - Maximum 500 XP gain per transaction
4. **Input Validation** - Plan must be 'free' or 'premium'

See `firestore.rules` for complete implementation.

## Performance Optimizations

1. **Code Splitting** - Vite automatically splits by route
2. **Lazy Loading** - Pages loaded on demand
3. **Optimistic Updates** - UI updates before server confirmation
4. **Memoization** - Heavy computations cached with `useMemo`

## Tech Stack Rationale

| Choice | Reason |
|--------|--------|
| React 19 | Latest features, concurrent rendering |
| Vite | Fast HMR, optimized builds |
| Firebase | Real-time sync, hosted auth, scales automatically |
| Capacitor | Single codebase for web + native apps |
| Recharts | Declarative charts, React-native integration |
