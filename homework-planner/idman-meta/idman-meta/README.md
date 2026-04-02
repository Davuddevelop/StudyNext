# StudyNext Monorepo

A comprehensive student productivity platform featuring a homework planner, focus timer, and gamified learning experience.

[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28.svg)](https://firebase.google.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF.svg)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](homework-planner/LICENSE)

---

## Overview

StudyNext helps students organize their academic life with powerful tools:

- **Task Management** - Track homework, assignments, and exams
- **Pomodoro Timer** - Built-in focus sessions to boost productivity
- **Progress Analytics** - Visualize study habits with detailed reports
- **Gamification** - Leaderboards and achievements to stay motivated
- **Cross-Platform** - Web, iOS, and Android support via Capacitor

---

## Project Structure

```
idman/
├── homework-planner/    # Main application (React + Vite)
│   ├── src/             # Source code
│   ├── android/         # Android native project
│   ├── ios/             # iOS native project
│   └── dist/            # Production build
├── design-system/       # UI/UX design documentation
│   └── studynext/       # Design tokens and guidelines
└── CHANGES_LOG.md       # Development changelog
```

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- Firebase project credentials

### Installation

```bash
# Navigate to the app directory
cd homework-planner

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Mobile Development

Build native apps using Capacitor:

```bash
# Build the web app
npm run build

# Sync with native projects
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, Vite 7 |
| Backend | Firebase (Auth, Firestore) |
| Mobile | Capacitor 8 |
| Charts | Recharts |
| Payments | PayPal, RevenueCat |
| Utilities | date-fns, jsPDF, canvas-confetti |

---

## Documentation

- [Main App README](homework-planner/README.md) - Detailed app documentation
- [Changes Log](CHANGES_LOG.md) - Development history and decisions
- [Design System](design-system/studynext/) - UI guidelines and tokens

---

## License

This project is licensed under the MIT License - see the [LICENSE](homework-planner/LICENSE) file for details.

---

Built with care by **Davud** - 2026
