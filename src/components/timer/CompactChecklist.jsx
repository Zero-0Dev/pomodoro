import React from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import { CheckCircle, Circle, Play } from 'lucide-react';

export default function CompactChecklist({ isRunning, mode }) {
  const { tasks, updateTask } = usePomodoro();

  // Se estiver em foco, queremos minimizar distrações
  // Mostra apenas a tarefa ativa se houver, ou nada
  const activeTask = tasks.find(t => t.status === 'active');
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  if (isRunning && mode === 'focus') {
    if (!activeTask) return null;
    return (
      <div style={{ marginTop: '2rem', width: '100%', background: 'var(--panel)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Play size={18} color="var(--primary)" />
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>Foco Atual: {activeTask.text}</span>
      </div>
    );
  }

  if (pendingTasks.length === 0 && !activeTask) {
    return null;
  }

  // Em pausa ou parado: mostra a fila rápida
  return (
    <div style={{ marginTop: '2rem', width: '100%' }}>
      <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>Fila de Tarefas</span>
        <span style={{ fontSize: '0.8rem', background: 'var(--panel)', padding: '2px 8px', borderRadius: '10px' }}>{pendingTasks.length + (activeTask ? 1 : 0)} itens</span>
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        maxHeight: '200px',
        overflowY: 'auto',
        paddingRight: '0.5rem'
      }}>
        {activeTask && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.8rem',
            background: 'var(--panel)',
            border: '1px solid var(--primary)',
            borderRadius: 'var(--radius)',
          }}>
            <Play size={16} fill="var(--primary)" color="var(--primary)" />
            <span style={{ flex: 1, color: 'var(--text)' }}>{activeTask.text}</span>
            <button 
              onClick={() => updateTask(activeTask.id, { status: 'completed' })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Circle color="var(--text-muted)" size={20} />
            </button>
          </div>
        )}
        
        {pendingTasks.map(task => (
           <div key={task.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.8rem',
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              opacity: 0.8
            }}>
              <button 
                onClick={() => updateTask(task.id, { status: 'completed' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                <Circle color="var(--text-muted)" size={20} />
              </button>
              <span style={{ flex: 1, color: 'var(--text)', fontSize: '0.95rem' }}>{task.text}</span>
              <button 
                onClick={() => updateTask(task.id, { status: 'active' })}
                style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Ativar
              </button>
           </div>
        ))}
      </div>
    </div>
  );
}
