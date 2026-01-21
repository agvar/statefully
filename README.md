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

### Implemented ✅
- 🎤 **Voice-first input** - Capture thoughts with voice recording and automatic transcription
- 🗣️ **Speech-to-Text** - Powered by Deepgram API for accurate transcription
- 💾 **Persistent storage** - Thoughts saved automatically and survive app restarts
- 🎨 **Animated UI** - Smooth pulsing button animations with React Native Animated API
- 🌓 **Dark mode** - Think Stream uses dark background for focused thought capture
- 📱 **Permission handling** - Proper microphone permission flow for iOS/Android

### In Progress 🚧
- 💭 **Sentiment analysis** - Emotional tone detection for thoughts
- ⏱️ **Time tracking** - Built-in timer for task duration
- 📊 **Visual insights** - Productivity and emotional state patterns
- 🎯 **Energy tracking** - Mark tasks by energy level (High, Medium, Low)
- 🌞 **Light mode screens** - Do Board and Pulse screens

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with persist middleware
- **Data Persistence**: AsyncStorage
- **Audio Recording**: expo-audio
- **File System**: expo-file-system
- **Speech-to-Text**: [Deepgram API](https://deepgram.com/)
- **UI Components**: Custom components built with React Native core
- **Icons**: Ionicons (via @expo/vector-icons)

## 📱 Screenshots

_Coming soon - Screenshots will be added as features are completed_

## 🚀 Getting Started
- **Deepgram API Key** - Sign up at [deepgram.com](https://deepgram.com/) for speech-to-text

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/agvar/statefully.git
   cd statefully
   ```

2. **Navigate to the project directory**
   ```bash
   cd statefully
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `statefully` directory:
   ```bash
   DEEPGRAM_API_KEY=your_deepgram_api_key_here
   ```
   

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on your device**   # Screens (Expo Router)
│   ├── (tabs)/             # Tab navigation group
│   │   ├── _layout.tsx     # Tab bar configuration
│   │   ├── think.tsx       # Think Stream screen (Voice recording)
│   │   ├── do.tsx          # Do Board screen (Task management)
│   │   └── pulse.tsx       # Pulse screen (Analytics)
│   ├── _layout.tsx         # Root layout
│   └── index.tsx           # Entry point
├── components/             # Reusable UI components
│   ├── ThoughtBubble.tsx   # Individual thought display
│   └── VoiceButton.tsx     # Animated recording button
├── constants/              # Design tokens
│   └── theme.ts           # Colors, typography, spacing, shadows
├── store/                  # State management
│   └── useStore.ts        # Zustand store with persistence
├── types/                  # TypeScript definitions
│   └── index.ts           # Thought, Task, Sentiment types
├── utils/                  # Helper functions
│   └── transcription.ts   # Deepgram API integration
├── assets/                 # Static resources
├── .env                    # Environment variables (not in repo)
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── app.json               # Expo configuration
└── README.md                # Screens (Expo Router)
│   ├── (tabs)/          # Tab navigation group
│   │   ├── think.tsx    # Think Stream screen
│   │   ├── do.tsx       # Do Board screen
│   │   └── pulse.tsx    # Pulse screen
│   └── _layout.tsx      # Root layout
├── components/          # Reusable UI components
├── constants/           # Theme, colors, typography
│   └── theme.ts        # Design system
├── store/              # Zustand state management
├─ 🎨 Design System

The app uses a custom design system with:

- **Color Palette**: Navy blue primary, Bronze accents, Flow (blue) and Drain (orange) states
- **Typography**: iOS-inspired scale (12px - 36px)
- **Spacing**: 8px-based system (4, 8, 16, 24, 32, 48, 64)
- **Shadows**: Subtle iOS-style elevation (sm, md, lg)
- **Animations**: React Native Animated API for smooth transitions

All design tokens are centralized in [constants/theme.ts](constants/theme.ts) for consistency.

## 🔧 Configuration

### Microphone Permissions

The app requires microphone access for voice recording. Permissions are configured in:

- **iOS**: `ios.infoPlist.NSMicrophoneUsageDescription` in `app.json`
- **Android**: `recordAudioAndroid: true` in `app.json`

### Deepgram API Setup

1. Sign up at [deepgram.com](https://deepgram.com/)
2. Create a new API key
3. Add it to your `.env` file
4. The app uses the `nova-3` model with smart formatting enabled

## 📝 Development Notes

- **State Management**: Zustand store persists thoughts and tasks to AsyncStorage
- **Date Handling**: Custom merge function handles Date serialization/deserialization
- **Audio Files**: Recordings saved to document directory as `.m4a` format
- **Animations**: Pulsing button uses looped parallel animations for scale and opacity
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
