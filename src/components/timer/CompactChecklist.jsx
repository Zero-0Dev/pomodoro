import React, { useState } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import { CheckCircle, Circle, Play, Plus } from 'lucide-react';

export default function CompactChecklist({ isRunning, mode }) {
  const { tasks, updateTask, addTask } = usePomodoro();
  const [newTaskText, setNewTaskText] = useState('');

  // Se estiver em foco, queremos minimizar distrações
  // Mostra apenas a tarefa ativa se houver, ou nada
  const activeTask = tasks.find(t => t.status === 'active');
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask({
      text: newTaskText,
      categoryId: '', 
      status: 'pending',
      priority: 'normal'
    });
    setNewTaskText('');
  };

  const getUrgencyStyle = (createdAt) => {
    if (!createdAt) return { borderColor: 'var(--border)' };
    const days = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    
    if (days >= 3) return { borderColor: 'var(--danger)', boxShadow: '0 0 8px rgba(255, 0, 60, 0.4)' }; // Red neon
    if (days >= 1) return { borderColor: 'var(--warning)', boxShadow: '0 0 8px rgba(252, 238, 10, 0.4)' }; // Yellow neon
    return { borderColor: 'var(--success)', boxShadow: '0 0 8px rgba(57, 255, 20, 0.2)' }; // Green neon
  };

  if (isRunning && mode === 'focus') {
    if (!activeTask) return null;
    return (
      <div style={{ marginTop: '2rem', width: '100%', background: 'var(--panel)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--border-glow)' }}>
        <Play size={18} color="var(--primary)" />
        <span style={{ color: 'var(--text)', fontWeight: 600, textShadow: '0 0 5px rgba(224, 240, 255, 0.5)' }}>Foco Atual: {activeTask.text}</span>
      </div>
    );
  }

  // Em pausa ou parado: mostra a fila rápida
  return (
    <div style={{ marginTop: '0', width: '100%' }}>
      <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>Fila de Tarefas</span>
        <span style={{ fontSize: '0.8rem', background: 'var(--panel-light)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          {pendingTasks.length + (activeTask ? 1 : 0)} itens
        </span>
      </h3>
      
      <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input 
          className="input" 
          placeholder="Nova tarefa rápida..." 
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '0.9rem' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>
          <Plus size={18} />
        </button>
      </form>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem',
        maxHeight: '300px',
        overflowY: 'auto',
        paddingRight: '0.5rem'
      }}>
        {activeTask && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.8rem',
            background: 'var(--panel-light)',
            border: '1px solid var(--primary)',
            boxShadow: 'var(--border-glow)',
            borderRadius: 'var(--radius)'
          }}>
            <Play size={16} fill="var(--primary)" color="var(--primary)" />
            <span style={{ flex: 1, color: 'var(--text)', fontWeight: 600 }}>{activeTask.text}</span>
            <button 
              onClick={() => updateTask(activeTask.id, { status: 'completed' })}
              style={{ padding: 0 }}
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
              background: 'var(--panel-light)',
              border: '1px solid',
              borderRadius: 'var(--radius)',
              ...getUrgencyStyle(task.createdAt)
            }}>
              <button 
                onClick={() => updateTask(task.id, { status: 'completed' })}
                style={{ padding: 0, display: 'flex' }}
              >
                <Circle color="var(--text-muted)" size={20} />
              </button>
              <span style={{ flex: 1, color: 'var(--text)', fontSize: '0.95rem' }}>{task.text}</span>
              <button 
                onClick={() => updateTask(task.id, { status: 'active' })}
                style={{ fontSize: '0.8rem', color: 'var(--primary-hover)', fontWeight: 'bold' }}
              >
                ATIVAR
              </button>
           </div>
        ))}
        {pendingTasks.length === 0 && !activeTask && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
            Nenhuma tarefa pendente.
          </p>
        )}
      </div>
    </div>
  );
}
