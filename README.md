# Raamu - The Cognitive Companion for Dual Mastery

A modern React-based educational platform for Andhra Pradesh students, featuring interactive 3D simulations, AI-powered learning companion, and bilingual support (English/Telugu).

## 🚀 Features

- **Interactive Digital Textbook**: Complete AP Board syllabus with bilingual support
- **3D Digital Twin Labs**: Physics simulations using Three.js
- **AI Learning Companion**: Powered by Google Gemini AI
- **Progress Tracking**: Comprehensive learning analytics
- **Responsive Design**: Mobile-first, works seamlessly across devices
- **Modern UI**: Built with a comprehensive design system

## 📦 Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router DOM
- **3D Graphics**: Three.js, React Three Fiber
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Styling**: Custom CSS with Design System

## 🛠️ Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Build for production**:
```bash
npm run build
```

4. **Preview production build**:
```bash
npm run preview
```

## 📁 Project Structure

```
raamu-app/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Progress.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── textbook/        # Textbook components (to be implemented)
│   │   ├── digital-twin/    # 3D simulation components (to be implemented)
│   │   ├── ai-copilot/      # AI chat components (partially implemented)
│   │   └── info-panel/      # Information panels (to be implemented)
│   ├── pages/
│   │   ├── Landing.jsx      # Landing page
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   └── Chat.jsx         # AI chat interface
│   ├── context/
│   │   ├── LanguageContext.jsx
│   │   ├── UserContext.jsx
│   │   └── ProgressContext.jsx
│   ├── styles/
│   │   ├── design-system.css
│   │   ├── components.css
│   │   └── globals.css
│   ├── utils/               # Utility functions (to be implemented)
│   ├── hooks/               # Custom React hooks (to be implemented)
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design System

The app uses a comprehensive design system with:
- **Color Palette**: Primary (Purple), Secondary (Teal), Semantic colors
- **Typography**: Inter font family with Telugu support
- **Spacing**: 8px base unit system
- **Shadows**: 6-level elevation system
- **Responsive**: Mobile-first breakpoints

## 🔑 Key Components

### Context Providers
- **LanguageContext**: Manages app language (English/Telugu)
- **UserContext**: User state and profile management
- **ProgressContext**: Learning progress tracking

### Common Components
- **Button**: Multiple variants (primary, secondary, ghost) and sizes
- **Card**: Flexible card component with header, body, footer
- **Input**: Form input with error states
- **Badge**: Status indicators
- **Progress**: Visual progress bar
- **Avatar**: User avatars with initials fallback

### Layout Components
- **Header**: Top navigation with language toggle
- **Sidebar**: Main navigation sidebar
- **Footer**: App footer with links

## 🚧 To Be Implemented

The following features are part of the roadmap:

1. **Chapter View Page**: Three-pane layout with textbook, digital twin, and AI copilot
2. **3D Digital Twin Labs**: 
   - Friction lab
   - Pressure lab
   - Additional physics simulations
3. **Textbook Component**: Interactive textbook reader
4. **Gemini AI Integration**: Connect to Google Gemini API
5. **Assessment System**: Quizzes and tests
6. **User Authentication**: Login/signup system
7. **Backend API**: Connect to backend services

## 🎯 Next Steps for Development

1. **Implement Chapter View**:
   - Create three-pane layout
   - Add textbook pane component
   - Integrate 3D canvas for digital twins

2. **Add Three.js Simulations**:
   - Set up React Three Fiber
   - Create friction simulation
   - Add interactive controls

3. **Integrate Gemini AI**:
   - Set up API connection
   - Implement chat functionality
   - Add context-aware responses

4. **Add More Pages**:
   - Chapters listing
   - Progress tracking
   - Achievements
   - Profile & settings

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=your_backend_api_url
```

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

This is a starter template. Continue development by:
1. Opening the project in Cursor or your preferred IDE
2. Following the folder structure
3. Using the design system variables
4. Creating new components in the appropriate folders

## 📄 License

This project is part of the Raamu educational platform.

## 🙏 Acknowledgments

- Design inspired by Duolingo, Khan Academy, and Notion
- Built for students in Andhra Pradesh
- Focused on making physics learning interactive and accessible

---

**Made with ❤️ for students in Andhra Pradesh**
