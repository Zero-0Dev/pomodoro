import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function Layout({ children, onNavigate, currentTab }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      minHeight: '100vh',
      background: 'var(--bg)'
    }}>
      {/* Sidebar - always rendered, mobile sliding overlay */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={onNavigate}
        currentTab={currentTab}
      />

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            style={{
              background: 'var(--panel)',
              padding: '0.6rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Menu size={22} color="var(--primary)" />
          </button>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>Pomodoro PRO</span>
          <div style={{ width: 38 }} />
        </div>

        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: currentTab === 'flowboard' ? 'stretch' : 'center',
          justifyContent: 'flex-start',
          padding: currentTab === 'flowboard' ? '1.25rem 1.5rem' : '2rem 1.5rem',
          overflowY: currentTab === 'flowboard' ? 'hidden' : 'auto',
          overflow: currentTab === 'flowboard' ? 'hidden' : undefined,
        }}>
          {children}
        </main>
      </div>

      <style>{`
        .mobile-topbar {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            background: var(--panel);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 50;
          }
        }
      `}</style>
    </div>
  );
}
