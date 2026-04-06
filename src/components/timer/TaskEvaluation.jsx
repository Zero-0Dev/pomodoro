import React, { useState } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import { MODES } from '../../hooks/useTimer';
import './TaskPrompt.css'; // reaproveitando os estilos do modal

export default function TaskEvaluation({ 
  isOpen, 
  onComplete, 
  task, 
  category, 
  cycles, 
  mode
}) {
  const { addHistoryEntry } = usePomodoro();
  const [evaluation, setEvaluation] = useState('concluido');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to history
    addHistoryEntry({
      task,
      category,
      evaluation,
      note,
      type: mode,
    });

    setNote(''); // reset
    onComplete(); // continues to break
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <h2 className="text-primary text-center">Foco Concluído! 🎉</h2>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <p>Tarefa: <strong>{task}</strong></p>
          <p>Ciclo atual: {cycles + 1}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group eval-options">
            <label>Como foi o seu progresso?</label>
            <div className="radio-group">
              <label className={`radio-btn ${evaluation === 'concluido' ? 'selected success' : ''}`}>
                <input type="radio" value="concluido" checked={evaluation === 'concluido'} onChange={(e) => setEvaluation(e.target.value)} />
                ✅ Concluído
              </label>
              <label className={`radio-btn ${evaluation === 'parcial' ? 'selected warning' : ''}`}>
                <input type="radio" value="parcial" checked={evaluation === 'parcial'} onChange={(e) => setEvaluation(e.target.value)} />
                ⚠️ Parcial
              </label>
              <label className={`radio-btn ${evaluation === 'nao_concluido' ? 'selected error' : ''}`}>
                <input type="radio" value="nao_concluido" checked={evaluation === 'nao_concluido'} onChange={(e) => setEvaluation(e.target.value)} />
                ❌ Não Concluído
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Anotação (opcional)</label>
            <textarea 
              className="input textarea"
              placeholder="Ex: Tive dificuldade na parte X..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
            />
          </div>

          <div className="modal-actions" style={{ justifyContent: 'center' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Salvar e Descansar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
