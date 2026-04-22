<div align="center">

# Statefully

### *Most apps track your time. We track your energy.*

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![ExecuTorch](https://img.shields.io/badge/ExecuTorch-On--Device_AI-FF6B35?style=for-the-badge)](https://pytorch.org/executorch/)

</div>

---

## What is Statefully?

Statefully is an **energy awareness tool** for knowledge workers. Most productivity apps tell you what you did. Statefully helps you understand what it *cost* you — and what gave you energy back.

Every activity you do is either **Flow** (energising) or **Drain** (depleting). Statefully captures both — via voice, keyboard, or manual form — then surfaces patterns so you can make better choices about where your cognitive energy goes.

> **Not** a task manager. **Not** a journal. **Not** a habit tracker.  
> An inner weather station — a quiet observer of where your mind actually lives.

---

## The Three Screens

### Now — *Be present with what is happening*

The command center. Start activities, tag your energy state, and check in with how you're feeling — all from a single dark, focused interface. A halo-pulsing voice button lets you speak a thought, task, or emotion note into existence. Three capture modes — **Task**, **Thought**, and **Mood** — are always accessible via a segmented toggle. A keyboard button beside the mic lets you type instead of speak, using the same routing pipeline.

| Now — Voice Capture | Now — Emotion Check-in | Now — Active Activity |
|---|---|---|
| ![Now screen — voice button](docs/screenshots/now_voice.png) | ![Now screen — emotion check-in](docs/screenshots/now_emotion.png) | ![Now screen — active activity](docs/screenshots/now_active.png) |

> 📸 *Screenshots coming soon `*

---

### Log — *See what you have done*

A chronological record of every thought, task, and emotion check-in. Activities are colour-coded by energy state — blue for Flow, orange for Drain — so patterns emerge at a glance. Tap any entry to edit it. Add thoughts or tasks manually with full control over timestamp, energy state, and emotion at capture. Resurfaced thoughts show their recurrence history.

| Log — Activity List | Log — Thought Stream |
|---|---|
| ![Log screen — activity list](docs/screenshots/log_activities.png) | ![Log screen — thoughts](docs/screenshots/log_thoughts.png) |

> 📸 *Screenshots coming soon `*

---

### Pulse — *Understand your patterns*

Analytics, rendered beautifully. Flow vs Drain breakdown for the day, time distribution across energy states, and — the centrepiece — a **private, on-device AI reflection** powered by Llama 3.2. Tap *Reflect* and the model reads your day and offers an honest, brief observation. No data leaves the device.

| Pulse — Energy Overview | Pulse — AI Reflection |
|---|---|
| ![Pulse screen — metrics](docs/screenshots/pulse_metrics.png) | ![Pulse screen — LLM reflection](docs/screenshots/pulse_reflect.png) |

> 📸 *Screenshots coming soon `*

---

## Features

| Feature | Status |
|---|---|
| Voice-first capture — Task, Thought, and Mood modes | ✅ |
| Keyboard capture — same routing pipeline as voice | ✅ |
| Manual entry form — tasks and thoughts, with timestamps | ✅ |
| On-device Speech-to-Text via Whisper Tiny (ExecuTorch) | ✅ |
| Emotion check-in with coloured state pills (Alive / Calm / Low / Wired) | ✅ |
| Emotion-at-capture auto-anchoring (30-min window) | ✅ |
| Emotion-at-completion on task tagging | ✅ |
| Voice emotion note — speak a note into a mood check-in | ✅ |
| Flow / Drain energy tagging (voice tasks: two-phase commit) | ✅ |
| Activity time tracking with live timer | ✅ |
| Thought lifecycle — resurface, edit, historical back-fill | ✅ |
| Chronological log with energy-colour coding | ✅ |
| Edit any past task or thought from Log screen | ✅ |
| Delete emotion check-ins via long press | ✅ |
| Pulse analytics — daily energy breakdown, Flow vs Drain | ✅ |
| On-device LLM reflection (Llama 3.2 1B SPINQUANT) | ✅ |
| LLM prompt includes emotion notes + before/after emotion arc | ✅ |
| Guided onboarding overlay (first launch only, persisted) | ✅ |
| Aurora gradient design language across all screens | ✅ |
| Full persistent state (Zustand + AsyncStorage) | ✅ |
| Week / month reflection window | 🔜 |
| Llama 3.2 3B upgrade for richer responses | 🔜 |
| Anchor library — user-authored notes for low/wired moments | 🔜 |

---

## On-Device AI — No Cloud, No Compromise

Both AI features — speech transcription and LLM reflection — run entirely on your device using **ExecuTorch**.

**Speech-to-Text (Whisper Tiny EN Quantised)**
Powered by `react-native-executorch`'s `useSpeechToText` hook. Batch transcription: audio is recorded in full, then transcribed in one pass. The model lazy-loads on first use with a visible progress indicator.

**LLM Reflection (Llama 3.2 1B SPINQUANT)**
When you tap *Reflect* in the Pulse tab:
1. The model lazy-loads on first tap
2. Your tasks, thoughts, and emotion check-ins — including emotion arcs (e.g. *felt calm → wired*) and voice notes — are assembled into a structured prompt
3. Inference runs locally, streamed token by token to the screen
4. Nothing leaves the device

This is not a chatbot. It speaks once, briefly, and asks one question back. Think of it as a perceptive friend who has been quietly watching your day.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev/) (React Native) |
| Language | TypeScript |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) — file-based |
| State | [Zustand](https://github.com/pmndrs/zustand) + AsyncStorage |
| On-device AI | [react-native-executorch](https://github.com/software-mansion/react-native-executorch) |
| LLM Model | Llama 3.2 1B SPINQUANT (quantised, on-device) |
| STT Model | Whisper Tiny EN Quantised (via `react-native-executorch` `useSpeechToText`) |
| Background | [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) |
| Icons | Ionicons via `@expo/vector-icons` |

---

## Design System

Statefully uses a custom design language built around **energy states** and **clarity**.

- **Flow** `#007AFF` — blue, energising, the default aspiration
- **Drain** `#FF6B35` — orange, depleting, honest not punishing
- **Aurora backgrounds** — deep purple-to-teal gradient across all three screens
- **Dark surfaces** — layered: `#0A0A0F` base → `#1C1C1E` cards → `#2C2C2E` borders
- **Emotion colours** — Alive (green), Calm (sky blue), Low (gray), Wired (amber)
- **Typography** — iOS-native scale, white primary, muted gray secondary
- **Spacing** — strict 8px grid (4 / 8 / 16 / 24 / 32 / 48)

All tokens live in [constants/theme.ts](constants/theme.ts).

---

## Project Structure

```
statefully/
├── app/
│   ├── (tabs)/
│   │   ├── now.tsx          # Now screen — capture, emotion check-in, recents
│   │   ├── log.tsx          # Log screen — activity history, edit, manual entry
│   │   └── pulse.tsx        # Pulse screen — analytics + LLM reflection
│   └── _layout.tsx
├── components/
│   ├── VoiceButton.tsx           # 5-state animated halo recording button
│   ├── TextCaptureSheet.tsx      # Keyboard capture sheet (mode-aware: task/thought/mood)
│   ├── ThoughtTaggingSheet.tsx   # Post-voice tagging sheet (intensity + energy + emotion)
│   ├── OnboardingOverlay.tsx     # First-launch guided overlay (4 steps, persisted)
│   ├── MetricCircle.tsx          # Pulse energy ring
│   ├── TimeLineChart.tsx         # Pulse time distribution chart
│   ├── cards/
│   │   ├── ActiveActivityCard.tsx      # Live timer card for running task
│   │   ├── UntaggedActivityCard.tsx    # Awaiting Flow/Drain tag + emotion-at-completion
│   │   ├── CompletedActivityCard.tsx   # Tagged task — shows emotion arc
│   │   ├── ThoughtCard.tsx             # Thought — intensity, energy, resurface button
│   │   ├── EmotionCheckinCard.tsx      # Mood check-in — state, time, voice note
│   │   ├── ActivityLogCard.tsx         # Log screen row — edit/delete
│   │   └── EmotionPillRow.tsx          # Reusable emotion pill selector (sm/md sizes)
│   ├── forms/
│   │   └── ManualEntryForm.tsx         # Unified task+thought form with progressive disclosure
│   └── sections/
├── constants/
│   └── theme.ts             # Full design system — colors, type, spacing, shadows, gradients
├── store/
│   └── useStore.ts          # Zustand store — activities, emotions, onboarding, date-range selectors
├── types/
│   └── index.ts             # Activity, EmotionCheckin, EmotionState, Intensity types
├── utils/
│   ├── buildReflectionPrompt.ts   # LLM prompt builder — tasks, thoughts, emotions, arcs
│   ├── formatTime.ts              # 12h time formatter used across all cards
│   └── transcription.ts           # Deepgram fallback (dev only)
└── assets/
    └── models/              # ExecuTorch .pte model files (Whisper encoder/decoder)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator
- A physical device is recommended for on-device AI features

### Installation

```bash
# Clone
git clone https://github.com/agvar/statefully.git
cd statefully

# Install dependencies
npm install

# Start the dev server
npx expo start
```

### Running on device

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```
---

## Permissions

| Permission | Platform | Purpose |
|---|---|---|
| Microphone | iOS + Android | Voice activity capture |

Configured in `app.json`:
- iOS: `NSMicrophoneUsageDescription`
- Android: `recordAudioAndroid: true`

---

## Contributing

This is a personal learning project exploring on-device AI in React Native. Issues and pull requests are welcome — especially around model quality, prompt design, and UX patterns.

---

## License

[MIT](https://github.com/agvar/statefully/blob/main/LICENSE)

---

## Acknowledgements

- [Expo](https://expo.dev/) and the React Native community
- [Software Mansion](https://swmansion.com/) for `react-native-executorch`
- [Meta](https://ai.meta.com/llama/) for the Llama 3.2 model family
- [OpenAI](https://openai.com/research/whisper) for the Whisper speech recognition model
- iOS Human Interface Guidelines — the original design north star
