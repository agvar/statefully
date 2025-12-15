# Statefully 🧠

> A mindful productivity app that helps you track your thoughts, execute tasks, and understand your emotional patterns.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

## 📖 About

Statefully is a productivity app designed to help you manage not just your tasks, but your mental and emotional states. By tracking the time you spend in creative ("Flow") vs overwhelmed ("Drained") states, Statefully helps you understand your patterns and work more mindfully.

The app follows a simple workflow:
1. **Think**: Capture thoughts and feelings (voice or text input)
2. **Do**: Convert thoughts into actionable tasks with time tracking
3. **Pulse**: Visualize how you spend your time and energy

## ✨ Features

- 🎤 **Voice-first input** - Capture thoughts quickly with voice recording
- 🌓 **Dark/Light mode** - Think Stream uses dark mode, Do Board and Pulse use light mode
- ⏱️ **Time tracking** - Track how long tasks take with built-in timer
- 📊 **Visual insights** - See patterns in your productivity and emotional states
- 💭 **Sentiment analysis** - Understand the emotional tone of your thoughts
- 🎯 **Energy tracking** - Mark tasks by energy level (High, Medium, Low)
- 📱 **Native iOS experience** - Built with React Native for smooth performance

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Persistence**: AsyncStorage
- **UI Components**: Custom components with React Native Paper
- **Icons**: Ionicons (via @expo/vector-icons)

## 📱 Screenshots

_Coming soon - Screenshots will be added as features are completed_

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- npm or yarn
- Expo Go app (for testing on physical device)
- iOS Simulator (Mac) or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/agvar/statefully.git
   cd statefully

2. **Navigate to the project directory**
    ```bash
    cd statefully

3. **Install dependencies**    
    ```bash
    npm install

4. **Start the development server**    
    ```bash
    npm start
5. **Run on your device**   
    - Scan the QR code with Expo Go (iOS) or Expo app (Android)
    - Or press i for iOS simulator, a for Android emulator

### Project Structure
statefully/
├── app/                  # Screens (Expo Router)
│   ├── (tabs)/          # Tab navigation group
│   │   ├── think.tsx    # Think Stream screen
│   │   ├── do.tsx       # Do Board screen
│   │   └── pulse.tsx    # Pulse screen
│   └── _layout.tsx      # Root layout
├── components/          # Reusable UI components
├── constants/           # Theme, colors, typography
│   └── theme.ts        # Design system
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── assets/             # Images, fonts, icons

###  🎨 Design System
The app uses a custom design system with:

- Color Palette: Navy blue primary, Bronze accents, Flow (blue) and Drain (orange) states
- Typography: iOS-inspired scale (12px - 36px)
- Spacing: 8px-based system (4, 8, 16, 24, 32, 48)
- Shadows: Subtle iOS-style elevation

All design tokens are centralized in constants/theme.ts for consistency.

### 📄 License
- This project is open source and available under the [MIT License](https://github.com/agvar/statefully/blob/main/LICENSE).

### 🙏 Acknowledgments
- Design inspired by iOS design guidelines
- Built as a learning project to master React Native and TypeScript
- Special thanks to the React Native and Expo communities
