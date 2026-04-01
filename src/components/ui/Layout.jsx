import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function Layout({ children, onNavigate, currentTab }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 100,
          background: 'var(--panel)',
          padding: '0.5rem',
          borderRadius: 'var(--radius)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        <Menu size={24} color="var(--primary)" />
      </button>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={onNavigate}
        currentTab={currentTab}
      />
      
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        overflowY: 'auto'
      }}>
        {children}
      </main>

      {/* Global CSS for the mobile button */}
      <style>{`
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none; }
        }
      `}</style>
    </>
  );
}
