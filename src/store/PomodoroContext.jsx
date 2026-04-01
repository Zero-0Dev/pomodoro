import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PomodoroContext = createContext();

export const DEFAULT_SETTINGS = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  cyclesBeforeLongBreak: 4,
  autoStartNext: false,
  soundEnabled: true,
  notificationsEnabled: true
};

export const PomodoroProvider = ({ children }) => {
  const [settings, setSettings] = useLocalStorage('pomodoro_settings', DEFAULT_SETTINGS);
  const [history, setHistory] = useLocalStorage('pomodoro_history', []);
  const [categories, setCategories] = useLocalStorage('pomodoro_categories', ['Estudos', 'Trabalho', 'Projeto']);

  const addHistoryEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const deleteHistoryEntry = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };
  
  const clearHistory = () => {
    if(confirm("Tem certeza que deseja limpar todo o histórico?")) {
       setHistory([]);
    }
  }

  const addCategory = (category) => {
    if (category.trim() && !categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(prev => prev.filter(c => c !== categoryToRemove));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Notification permission
  useEffect(() => {
    if (settings.notificationsEnabled && ('Notification' in window)) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, [settings.notificationsEnabled]);

  return (
    <PomodoroContext.Provider value={{
      settings,
      updateSettings,
      history,
      addHistoryEntry,
      deleteHistoryEntry,
      clearHistory,
      categories,
      addCategory,
      removeCategory
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro deve ser usado dentro de um PomodoroProvider');
  }
  return context;
};
