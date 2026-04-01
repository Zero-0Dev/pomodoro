import React, { useState } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import './TaskPrompt.css';

export default function TaskPrompt({ isOpen, onClose, onStart }) {
  const { categories } = usePomodoro();
  const [task, setTask] = useState('');
  const [category, setCategory] = useState(categories[0] || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    onStart(task, category);
    setTask(''); // reset for next time
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <h2 className="text-primary text-center">Início de Foco</h2>
        <p className="text-muted text-center" style={{ marginBottom: '1.5rem' }}>
          O que você vai realizar neste Pomodoro?
        </p>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Tarefa Atual</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Ex: Estudar React, Ler capítulo 3..." 
              value={task}
              onChange={(e) => setTask(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select 
              className="input" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={!task.trim()}>Iniciar Foco</button>
          </div>
        </form>
      </div>
    </div>
  );
}
