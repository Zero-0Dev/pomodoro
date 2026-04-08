import React, { useState } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import './TaskPrompt.css';

export default function TaskPrompt({ isOpen, onClose, onStart }) {
  const { categories, tasks, addTask } = usePomodoro();
  const [taskText, setTaskText] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  if (!isOpen) return null;

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'active');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedTaskId) {
      onStart(selectedTaskId);
      setSelectedTaskId('');
    } else if (taskText.trim()) {
      const newId = addTask({
        text: taskText,
        categoryId: category,
        status: 'active',
        priority: 'normal'
      });
      onStart(newId);
      setTaskText('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card" style={{ maxWidth: '400px' }}>
        <h2 className="text-primary text-center">Início de Foco</h2>
        <p className="text-muted text-center" style={{ marginBottom: '1.5rem' }}>
          Qual o foco deste Pomodoro?
        </p>
        
        <form onSubmit={handleSubmit} className="task-form">
          {pendingTasks.length > 0 && (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Selecionar tarefa pendente</label>
              <select 
                className="input" 
                value={selectedTaskId} 
                onChange={(e) => {
                  setSelectedTaskId(e.target.value);
                  if (e.target.value) setTaskText('');
                }}
              >
                <option value="">-- Criar nova tarefa --</option>
                {pendingTasks.map(t => (
                  <option key={t.id} value={t.id}>{t.text} {t.categoryId ? `(${t.categoryId})` : ''}</option>
                ))}
              </select>
            </div>
          )}

          {!selectedTaskId && (
            <>
              <div className="form-group">
                <label>Nova Tarefa</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Ex: Estudar React..." 
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  autoFocus
                  required={!selectedTaskId}
                />
              </div>

              <div className="form-group">
                <label>Categoria (Nova Tarefa)</label>
                <select 
                  className="input" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Sem Categoria</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={!selectedTaskId && !taskText.trim()}>Iniciar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
