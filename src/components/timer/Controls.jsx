import React from 'react';
import { Play, Pause, Square, Plus, Minus } from 'lucide-react';
import './Controls.css';

export default function Controls({ 
  isRunning,
  isPaused,
  startTimer, 
  pauseTimer,
  resumeTimer,
  stopTimer, 
  addTime,
  mode 
}) {
  return (
    <div className="controls-container">
      <div className="main-actions">
        {isRunning ? (
          <button className="btn btn-action pause" onClick={pauseTimer}>
            <Pause size={28} />
          </button>
        ) : (
          <button className="btn btn-action play" onClick={isPaused ? resumeTimer : startTimer}>
            <Play size={28} style={{ marginLeft: '4px' }} />
          </button>
        )}
        
        <button 
          className="btn btn-action stop" 
          onClick={stopTimer}
          disabled={!isRunning && !isPaused}
          title="Parar sessão"
        >
          <Square size={24} />
        </button>
      </div>

      <div className="secondary-actions">
        <button className="btn btn-secondary small" onClick={() => addTime(-60)} title="Remover 1 minuto">
          <Minus size={16} /> 1m
        </button>
        <button className="btn btn-secondary small" onClick={() => addTime(300)} title="Adicionar 5 minutos">
          <Plus size={16} /> 5m
        </button>
      </div>
    </div>
  );
}
