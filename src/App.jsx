import React, { useState } from 'react';
import { PomodoroProvider } from './store/PomodoroContext';
import Layout from './components/ui/Layout';
import PomodoroDashboard from './components/timer/PomodoroDashboard';
import HistoryTable from './components/history/HistoryTable';
import Dashboard from './components/charts/Dashboard';
import CategoriesManager from './components/settings/CategoriesManager';
import Settings from './components/settings/Settings';
import './app.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('timer');

  const renderTab = () => {
    switch(currentTab) {
      case 'timer': return <PomodoroDashboard />;
      case 'history': return <HistoryTable />;
      case 'charts': return <Dashboard />;
      case 'categories': return <CategoriesManager />;
      case 'settings': return <Settings />;
      default: return <PomodoroDashboard />;
    }
  };

  return (
    <PomodoroProvider>
      <Layout currentTab={currentTab} onNavigate={setCurrentTab}>
        {renderTab()}
      </Layout>
    </PomodoroProvider>
  );
}
