import React from 'react';
import { Timer, BarChart2, History, Settings, X, Tag, CheckSquare, Layers } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, onNavigate, currentTab }) {
  const navItems = [
    { id: 'timer', label: 'Pomodoro', icon: <Timer size={20}/> },
    { id: 'tasks', label: 'Tarefas', icon: <CheckSquare size={20}/> },
    { id: 'flowboard', label: 'Flow Board', icon: <Layers size={20}/> },
    { id: 'charts', label: 'Estatísticas', icon: <BarChart2 size={20}/> },
    { id: 'history', label: 'Histórico', icon: <History size={20}/> },
    { id: 'categories', label: 'Categorias', icon: <Tag size={20}/> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20}/> }
  ];

  const handleNav = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="text-primary" style={{ margin: 0, fontSize: '1.5rem' }}>Pomodoro PRO</h2>
          <button className="close-btn mobile-only" onClick={onClose}>
            <X size={24} color="var(--text)" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button 
              key={item.id}
              className={`nav-btn ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
