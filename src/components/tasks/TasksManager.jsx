import React, { useState } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import { CheckCircle, Circle, Play, Pause, Trash2, Plus, Clock, Tag } from 'lucide-react';

export default function TasksManager() {
  const { tasks, addTask, updateTask, deleteTask, categories } = usePomodoro();
  const [filterMode, setFilterMode] = useState('all'); // all, active, pending, completed
  
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('normal');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    addTask({
      text: newTaskText,
      categoryId: newTaskCategory,
      priority: newTaskPriority,
      status: 'pending'
    });
    
    setNewTaskText('');
    setNewTaskCategory('');
    setNewTaskPriority('normal');
  };

  const filteredTasks = tasks.filter(task => {
    if (filterMode === 'all') return true;
    if (filterMode === 'active') return task.status === 'active';
    if (filterMode === 'pending') return task.status === 'pending';
    if (filterMode === 'completed') return task.status === 'completed';
    return true;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': 
      case 'normal': return '#f59e0b';
      case 'low': return '#10b981';
      default: return 'var(--text-muted)';
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0min';
    const min = Math.floor(seconds / 60);
    const h = Math.floor(min / 60);
    if (h > 0) return `${h}h ${min % 60}m`;
    return `${min}min`;
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--text)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Gestão de Tarefas</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gerencie suas pendências e acompanhe o foco.</p>
      </header>

      {/* Formulário de Adição */}
      <form onSubmit={handleAddTask} style={{
        background: 'var(--panel)',
        padding: '1.5rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="O que você precisa focar hoje?"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            style={{
              flex: '1 1 250px',
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '1rem'
            }}
          />
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)'
            }}
          >
            <option value="">Sem Categoria</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)'
            }}
          >
            <option value="low">Baixa Prioridade</option>
            <option value="normal">Prioridade Normal</option>
            <option value="high">Alta Prioridade</option>
          </select>
          <button type="submit" className="primary-btn" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', margin: 0
          }}>
            <Plus size={18} /> Adicionar
          </button>
        </div>
      </form>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { id: 'all', label: 'Todas', count: tasks.length },
          { id: 'active', label: 'Em Foco', count: tasks.filter(t => t.status === 'active').length },
          { id: 'pending', label: 'Pendentes', count: tasks.filter(t => t.status === 'pending').length },
          { id: 'completed', label: 'Concluídas', count: tasks.filter(t => t.status === 'completed').length }
        ].map(filter => (
          <button 
            key={filter.id}
            onClick={() => setFilterMode(filter.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '3rem',
              background: filterMode === filter.id ? 'var(--primary)' : 'var(--panel)',
              color: filterMode === filter.id ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${filterMode === filter.id ? 'var(--primary)' : 'var(--border)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {filter.label} 
            <span style={{ 
              background: filterMode === filter.id ? 'rgba(255,255,255,0.2)' : 'var(--bg)', 
              padding: '2px 6px', 
              borderRadius: '10px', 
              fontSize: '0.75rem' 
            }}>{filter.count}</span>
          </button>
        ))}
      </div>

      {/* Lista de Tarefas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--panel)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
            <div style={{ marginBottom: '1rem' }}><CheckCircle size={48} opacity={0.2} style={{ margin: 'auto' }} /></div>
            Nenhuma tarefa encontrada neste filtro.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} style={{
              background: 'var(--panel)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
              padding: '1.25rem',
              transition: 'all 0.2s',
              opacity: task.status === 'completed' ? 0.6 : 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                  <button 
                    onClick={() => updateTask(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px' }}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle color="var(--primary)" size={24} />
                    ) : (
                      <Circle color="var(--text-muted)" size={24} />
                    )}
                  </button>
                  <div>
                    <h3 style={{ 
                      margin: '0 0 0.25rem 0', 
                      fontSize: '1.1rem', 
                      color: 'var(--text)',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                    }}>{task.text}</h3>
                    
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      {task.categoryId && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Tag size={14} /> {task.categoryId}
                        </span>
                      )}
                      
                      {task.status === 'active' && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
                          <Play size={14} fill="var(--primary)" /> Em Foco
                        </span>
                      )}
                      
                      {(task.pomodorosCount > 0 || task.totalTimeSpent > 0) && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={14} /> Foco: {formatTime(task.totalTimeSpent)} ({task.pomodorosCount} pomodoros)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {task.status !== 'completed' && task.status !== 'active' && (
                    <button 
                      onClick={() => updateTask(task.id, { status: 'active' })}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                      title="Definir como foco atual"
                    >
                      <Play size={20} />
                    </button>
                  )}
                  {task.status === 'active' && (
                    <button 
                      onClick={() => updateTask(task.id, { status: 'pending' })}
                      style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }}
                      title="Pausar"
                    >
                      <Pause size={20} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteTask(task.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    title="Excluir tarefa"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
