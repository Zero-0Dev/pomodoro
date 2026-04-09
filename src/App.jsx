import React, { useState } from 'react';
import { PomodoroProvider } from './store/PomodoroContext';
import { TimerProvider } from './store/TimerContext';
import Layout from './components/ui/Layout';
import PomodoroDashboard from './components/timer/PomodoroDashboard';
import HistoryTable from './components/history/HistoryTable';
import Dashboard from './components/charts/Dashboard';
import CategoriesManager from './components/settings/CategoriesManager';
import Settings from './components/settings/Settings';
import TasksManager from './components/tasks/TasksManager';
import './app.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('timer');

  const renderTab = () => {
    switch(currentTab) {
      case 'timer': return <PomodoroDashboard />;
      case 'tasks': return <TasksManager />;
      case 'history': return <HistoryTable />;
      case 'charts': return <Dashboard />;
      case 'categories': return <CategoriesManager />;
      case 'settings': return <Settings />;
      default: return <PomodoroDashboard />;
    }
  };

  return (
    <PomodoroProvider>
      <TimerProvider>
        <Layout currentTab={currentTab} onNavigate={setCurrentTab}>
          {renderTab()}
        </Layout>
      </TimerProvider>
    </PomodoroProvider>
  );
}
