import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PomodoroContext = createContext();

export const DEFAULT_SETTINGS = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  cyclesBeforeLongBreak: 4,
  dailyGoal: 8,
  autoStartNext: false,
  soundEnabled: true,
  notificationsEnabled: true
};

export const PomodoroProvider = ({ children }) => {
  const [settings, setSettings] = useLocalStorage('pomodoro_settings', DEFAULT_SETTINGS);
  const [history, setHistory] = useLocalStorage('pomodoro_history', []);
  const [categories, setCategories] = useLocalStorage('pomodoro_categories', ['Estudos', 'Trabalho', 'Projeto']);
  const [tasks, setTasks] = useLocalStorage('pomodoro_tasks', []);

  // Tarefas / Checklist
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      text: taskData.text,
      categoryId: taskData.categoryId || '',
      status: taskData.status || 'pending', // pending, active, paused, completed
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      priority: taskData.priority || 'normal', // baixa, normal, alta
      pomodorosCount: 0,
      totalTimeSpent: 0 // in seconds
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask.id;
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        if (updates.status === 'active' && !t.startedAt) {
          updated.startedAt = new Date().toISOString();
        }
        if (updates.status === 'completed' && !t.completedAt) {
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    if(confirm("Tem certeza que deseja apagar esta tarefa? Todo o histórico dela será finalizado.")) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

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
      removeCategory,
      tasks,
      addTask,
      updateTask,
      deleteTask
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
