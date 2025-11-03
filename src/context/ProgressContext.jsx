import React, { createContext, useContext, useState } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({
    completed: 15,
    total: 50,
    chapters: [
      { id: 1, name: 'Force', completed: true, progress: 100 },
      { id: 2, name: 'Friction', completed: false, progress: 60 },
      { id: 3, name: 'Pressure', completed: false, progress: 0 },
    ],
    achievements: [
      { id: 1, name: 'First Steps', icon: '🎯', earned: true },
      { id: 2, name: 'Week Streak', icon: '🔥', earned: false },
    ],
  });

  const updateProgress = (chapterId, newProgress) => {
    setProgress((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, progress: newProgress, completed: newProgress === 100 }
          : chapter
      ),
    }));
  };

  const completeLesson = () => {
    setProgress((prev) => ({
      ...prev,
      completed: prev.completed + 1,
    }));
  };

  const value = {
    progress,
    setProgress,
    updateProgress,
    completeLesson,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
