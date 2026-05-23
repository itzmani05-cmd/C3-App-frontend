# C³ Platform 

A modern **React Native Expo learner application** built for the **C3 Institute**, designed to provide an engaging mobile learning experience for students.

The platform supports **lessons, quizzes, progress tracking, profile management, and administrator workflows**, powered by cloud-based APIs for seamless educational access.


## ✨ Features

### 👨‍🎓 Student Features
- Secure authentication & account verification
- Lesson browsing and structured topic navigation
- Interactive quiz and question screens
- Image-supported question rendering
- Learning progress tracking
- Quiz results and performance reporting
- Password reset functionality
- Offline-friendly mobile experience

### 👨‍💼 Admin Features
- Admin dashboard access
- Student management workflows
- Content and lesson management
- Progress monitoring

### 📱 Mobile Features
- Native Android & iOS support
- Smooth navigation using React Navigation
- Cloud-backed API integration
- Local data persistence
- Optimized UI for mobile learning

---

## 🛠️ Tech Stack

### Frontend Framework
- React Native
- Expo

### Navigation
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native-stack`

### Expo Libraries
- `expo-image-picker`
- `expo-font`
- `expo-linear-gradient`
- `expo-print`
- `expo-sharing`
- `expo-status-bar`
- `expo-updates`

### State & API
- Axios (API Requests)
- Async Storage (Local Data Storage)

---

## 📂 Project Structure

```bash
C3-Platform/
│── App.js / index.js        # App entry points
│── app.json                 # Expo configuration
│── android/                 # Native Android project files
│── assets/                  # Images, icons, and assets
│
├── src/
│   ├── components/          # Reusable UI components
│   ├── navigation/          # Navigation setup
│   ├── screens/             # App screens
│   ├── config/              # API configuration
│   ├── constants/           # Reusable constants
│   ├── utils/               # Utility helpers
│   └── services/            # API services (if applicable)
```

## 🌐 Backend Configuration

The application uses a backend API configured in:

```txt
app.json → extra.API_URL
```

Current API Endpoint:

```txt
https://c3app-backend.onrender.com
```

## 🔐 Authentication

The platform includes:

- Login & Signup
- Account Verification
- Password Reset
- Secure Session Management

---

## 📊 Learning Features

Students can:

- Browse lessons by topic
- Attempt quizzes
- Track progress
- View results and scores
- Continue learning seamlessly

---

## 📱 Platform Support

| Platform | Supported |
|----------|------------|
| Android | ✅ |
| iOS | ✅ |
| Tablet | ✅ |

---
