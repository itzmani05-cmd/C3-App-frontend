# C³ Platform 📱

A modern **React Native Expo learner application** built for the **C3 Institute**, designed to provide an engaging mobile learning experience for students.

The platform supports **lessons, quizzes, progress tracking, profile management, and administrator workflows**, powered by cloud-based APIs for seamless educational access.

---

## 🚀 GitHub About

> **C³ Platform** — React Native Expo learner app for student lessons, quiz questions, progress tracking, and admin management with cloud-backed APIs.

---

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

---

## ⚙️ Prerequisites

Before running the project, ensure you have installed:

- Node.js **v18+** (Recommended: Latest LTS)
- npm or yarn
- Expo CLI
- Android Studio (for Android Emulator)
- Xcode (for iOS development on macOS)

Install Expo CLI globally:

```bash
npm install -g expo-cli
```

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/c3-platform.git
```

### 2. Navigate to Project Folder

```bash
cd c3-platform
```

### 3. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

## ▶️ Running the Application

### Start Expo Development Server

```bash
npm start
```

or

```bash
yarn start
```

---

### Run on Android

```bash
npm run android
```

or

```bash
yarn android
```

---

### Run on iOS

```bash
npm run ios
```

or

```bash
yarn ios
```

---

## 🌐 Backend Configuration

The application uses a backend API configured in:

```txt
app.json → extra.API_URL
```

Current API Endpoint:

```txt
https://c3app-backend.onrender.com
```

Example configuration:

```json
{
  "expo": {
    "extra": {
      "API_URL": "https://c3app-backend.onrender.com"
    }
  }
}
```

---

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

## ⚡ App Configuration

### Expo SDK
- Expo SDK **54**

### React Native Version
- React Native **0.81.5**

### Android Permissions
- Internet Access
- Audio Recording

### iOS Configuration
Bundle Identifier:

```txt
com.c3institute.app
```

Tablet support enabled.

---

## 🤝 Contributing

Contributions are welcome!

### Steps to Contribute

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Manikandan**  
Computer Science Student | Full Stack Developer

GitHub: https://github.com/your-username
