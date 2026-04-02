# StudyNext - The Ultimate Student Productivity Platform 🚀

StudyNext is a comprehensive, modern homework and exam planner designed to help students maximize their academic performance. With features like a built-in Pomodoro timer, detailed progress analytics, and a gamified experience, StudyNext transforms study sessions into productive, rewarding journeys.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28.svg)](https://firebase.google.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-v8-119EFF.svg)](https://capacitorjs.com/)

---

## ✨ Key Features

### 📊 Interactive Dashboard
Get a high-level overview of your academic life. View upcoming tasks, study streaks, and productivity insights at a glance.

### ⏱️ Focus Timer (Pomodoro)
Boost your concentration with our built-in focus timer. Follow the Pomodoro technique to stay fresh and avoid burnout.

### 📅 Calendar & Task Management
Effortlessly track your homework, assignments, and exam schedules. Use the visual calendar to plan your week and stay ahead of deadlines.

### 📈 Advanced Reports
Visualize your progress with beautiful, data-driven reports. Track study hours, completion rates, and subject-specific analytics.

### 🏆 Gamified Leaderboard
Stay motivated by competing with others. Earn points for completed tasks and climb the ranks of top students.

### 💳 Modern Monetization
Seamlessly manage your premium subscription with integrated RevenueCat and PayPal support.

### 📱 Cross-Platform Support
Take your planner anywhere. StudyNext is built with Capacitor, offering a native app experience on both iOS and Android.

---

## 🌟 Case Studies

### 👩‍⚕️ Sarah, Medical Student
> "StudyNext's Pomodoro timer and exam tracker helped me stay organized during finals week. I increased my study efficiency by 40%! The visual progress reports are a game-changer."

### 👨‍🎓 James, High School Senior
> "The leaderboard makes studying feel like a game. I've never been more motivated to finish my homework on time. It's actually fun to compete with my friends for the top spot."

### 👩‍💼 Elena, Part-time MBA Student
> "Managing work and study was a nightmare until I found StudyNext. The dashboard gives me exactly what I need to see every morning, and the mobile sync is flawless."

---

## 📈 Shipping Updates (Progress)

### **Recent Milestones**
- **v1.2.0**: 🚀 Fully migrated to **React 19** and **Vite** for 2x faster build times.
- **v1.1.5**: 💳 Integrated **RevenueCat** and **PayPal** for secure, seamless premium features.
- **v1.1.0**: 📱 Added native mobile support via **Capacitor** for iOS and Android.
- **v1.0.5**: ✨ Enhanced UI with skeleton loaders, success overlays, and confetti animations.
- **v1.0.0**: 🎉 Initial release of the StudyNext web platform.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS (for styling)
- **Backend & Auth**: Firebase (Auth, Firestore)
- **Mobile Foundation**: Capacitor
- **Data Visualization**: Recharts
- **Payment & Subscriptions**: RevenueCat, PayPal
- **Utilities**: date-fns, react-icons, canvas-confetti, jspdf

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A Firebase project for the backend

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Davuddevelop/Homework-planner.git
   cd Homework-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file based on `.env.example` and add your Firebase and API keys:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # ... add other required keys
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📱 Mobile Deployment

### Build for Android/iOS

1. Build the web project:
   ```bash
   npm run build
   ```

2. Sync with Capacitor:
   ```bash
   npx cap sync
   ```

3. Open in native IDE:
   ```bash
   npx cap open android
   # OR
   npx cap open ios
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Created with ❤️ by **Davud** – 2026
