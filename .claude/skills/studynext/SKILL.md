---
name: studynext
description: Context about the StudyNext homework planner app. Claude uses this automatically when working on this project.
user-invocable: false
---

# StudyNext App Context

## Tech Stack
- **Frontend**: React 19 + Vite
- **Mobile**: Capacitor (iOS/Android)
- **Backend**: Firebase Auth + Firestore
- **Payments**: RevenueCat for in-app purchases
- **Hosting**: Firebase Hosting (https://takflow-6d0f5.web.app/)

## Key Directories
- `src/pages/` - Main page components (Dashboard, AddHomework, etc.)
- `src/components/` - Reusable UI components
- `src/services/` - Firebase service layers (homeworkService, userService)
- `src/contexts/` - React contexts (AuthContext)
- `src/hooks/` - Custom hooks (useFocusTimer, useReminders)

## Design System
- **Theme**: Dark mode with CSS variables
- **Primary Color**: #FF6B4A (coral/orange)
- **Accent Color**: #FFB74D (amber)
- **Success Color**: #4ADE80 (green)

## Gamification
- XP system with levels (1000 XP per level)
- Streak tracking (daily usage)
- Confetti celebrations on milestones

## Free vs Premium
- Free: 5 tasks max, stored in localStorage
- Premium: Unlimited tasks in Firestore, smart reminders

## Deployment
```bash
npm run build && npx firebase deploy --only hosting
```
