# Raamu Development Guide

This document provides detailed guidance for continuing development on the Raamu application.

## 🏗️ Current Implementation Status

### ✅ Completed
- Project structure and folder organization
- Design system with CSS variables
- Common UI components (Button, Input, Card, Badge, Progress, Avatar)
- Layout components (Header, Sidebar, Footer)
- Context providers (Language, User, Progress)
- Landing page with hero and features sections
- Dashboard page with stats and progress tracking
- Chat page with AI companion interface
- Routing setup with React Router
- Responsive design foundation

### 🚧 In Progress / Next Steps

## Priority 1: Chapter View (Three-Pane Layout)

Create the main learning interface with textbook, digital twin, and AI copilot.

### Implementation Steps:

1. **Create ThreePaneLayout Component**
```jsx
// src/components/layout/ThreePaneLayout.jsx
- Left pane: Textbook content (resizable)
- Center pane: 3D Digital Twin canvas
- Right pane: AI Copilot chat (collapsible)
- Mobile: Tab-based navigation
```

2. **Create TextbookPane Component**
```jsx
// src/components/textbook/TextbookPane.jsx
- Render chapter content
- Page navigation
- Table of contents
- Language toggle integration
- Highlight/annotation features
```

3. **Create DigitalTwinCanvas Component**
```jsx
// src/components/digital-twin/DigitalTwinCanvas.jsx
- Three.js scene setup
- React Three Fiber integration
- Camera controls
- Loading states
```

4. **Create Chapter Page**
```jsx
// src/pages/ChapterPage.jsx
- Use ThreePaneLayout
- Load chapter data
- Sync between panes
```

## Priority 2: 3D Digital Twin Labs

Implement physics simulations using Three.js and cannon-es.

### Installation:
```bash
npm install cannon-es
```

### Friction Lab Implementation:

1. **Create FrictionLab Component**
```jsx
// src/components/digital-twin/labs/FrictionLab.jsx
- 3D scene with ground plane
- Movable block
- Force application controls
- Surface type selector (wood, ice, carpet, oil)
- Real-time force vectors visualization
- Coefficient of friction display
```

2. **Physics Engine Setup**
```jsx
// src/utils/physics-engine.js
- Initialize cannon-es world
- Create physics bodies
- Apply forces and constraints
- Sync with Three.js meshes
```

3. **Control Panel**
```jsx
// src/components/digital-twin/ControlPanel.jsx
- Sliders for applied force
- Surface material selector
- Play/pause/reset controls
- Speed controls
```

### Example Structure:
```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as CANNON from 'cannon-es';

function FrictionLab() {
  // Physics world setup
  // Three.js scene
  // User controls
  // Force vectors
  return (
    <div className="lab-container">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        {/* 3D objects */}
      </Canvas>
      <ControlPanel />
    </div>
  );
}
```

## Priority 3: Gemini AI Integration

Connect the chat interface to Google Gemini API.

### Installation:
```bash
npm install @google/generative-ai
```

### Implementation:

1. **Create Gemini Service**
```jsx
// src/utils/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function sendMessage(message, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `
    You are Raamu, an AI learning companion for Grade ${context.grade} students.
    Current Chapter: ${context.chapter}
    Student's Language: ${context.language}
    
    Student Question: ${message}
    
    Provide a clear, age-appropriate explanation.
    ${context.language === 'te' ? 'Respond in Telugu.' : 'Respond in English.'}
  `;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

2. **Update Chat Component**
```jsx
// Update src/pages/Chat.jsx
import { sendMessage } from '../utils/gemini';

// In handleSendMessage:
const response = await sendMessage(inputMessage, {
  grade: user.grade,
  chapter: currentChapter,
  language: language
});
```

3. **Create useGeminiChat Hook**
```jsx
// src/hooks/useGeminiChat.js
export function useGeminiChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const sendMessage = async (text) => {
    // Add user message
    // Call Gemini API
    // Add bot response
  };
  
  return { messages, sendMessage, loading };
}
```

## Priority 4: Additional Pages

### Chapters Listing Page
```jsx
// src/pages/Chapters.jsx
- Grid of chapter cards
- Progress indicators
- Filter by subject/grade
- Search functionality
```

### Progress Page
```jsx
// src/pages/Progress.jsx
- Overall progress charts
- Chapter-wise breakdown
- Time spent analytics
- Strengths and weaknesses
```

### Achievements Page
```jsx
// src/pages/Achievements.jsx
- Achievement cards grid
- Earned vs locked states
- Progress towards next achievement
- Share functionality
```

### Profile Page
```jsx
// src/pages/Profile.jsx
- User information
- Avatar upload
- Language preference
- Grade selection
```

## Development Guidelines

### Component Structure
```jsx
// Follow this pattern for all components:

import React from 'react';
import './ComponentName.css';

export default function ComponentName({ prop1, prop2 }) {
  // State management
  // Effects
  // Event handlers
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
}
```

### CSS Guidelines
- Use CSS variables from design-system.css
- Follow BEM naming convention for classes
- Keep component styles in separate CSS files
- Use responsive design patterns

### State Management
- Use Context for global state
- Use local state for component-specific data
- Consider Redux or Zustand for complex state

### API Integration
- Create service files in utils/
- Handle loading and error states
- Use environment variables for API keys

## Testing Recommendations

1. **Component Testing**
```bash
npm install --save-dev @testing-library/react vitest
```

2. **E2E Testing**
```bash
npm install --save-dev cypress
```

## Performance Optimization

1. **Code Splitting**
- Use React.lazy() for route-based splitting
- Lazy load heavy 3D components

2. **Memoization**
- Use React.memo for expensive renders
- Use useMemo for expensive calculations

3. **Asset Optimization**
- Optimize images
- Lazy load images below the fold
- Use webp format

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Build optimization
- [ ] Error boundaries added
- [ ] Loading states implemented
- [ ] Analytics integration
- [ ] SEO meta tags
- [ ] PWA configuration (optional)

## Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Docs](https://reactrouter.com/)

## Getting Help

- Check the component library in `/src/components/common/`
- Review design system in `/src/styles/design-system.css`
- Reference requirements in the original FRD document

## Next Session Checklist

When you start your next development session:

1. [ ] Pull latest changes
2. [ ] Run `npm install` to ensure dependencies are updated
3. [ ] Check `.env` file is configured
4. [ ] Run `npm run dev` to start dev server
5. [ ] Pick a priority from this document
6. [ ] Create feature branch
7. [ ] Implement feature
8. [ ] Test thoroughly
9. [ ] Commit with clear message

---

Happy coding! 🚀
