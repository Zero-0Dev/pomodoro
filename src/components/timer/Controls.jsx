import React from 'react';
import { Play, Pause, Square, Plus, Minus, PictureInPicture, SkipForward, RotateCcw } from 'lucide-react';
import './Controls.css';

export default function Controls({ 
  isRunning,
  isPaused,
  startTimer, 
  pauseTimer,
  resumeTimer,
  stopTimer, 
  addTime,
  skipCurrentMode,
  resetTimer,
  mode,
  isPipSupported,
  togglePip,
  isPipActive
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

        <button 
          className="btn btn-action skip" 
          onClick={skipCurrentMode}
          title="Pular"
        >
          <SkipForward size={24} />
        </button>

        <button 
          className="btn btn-action reset" 
          onClick={resetTimer}
          title="Reiniciar tempo"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      <div className="secondary-actions">
        <button className="btn btn-secondary small" onClick={() => addTime(-60)} title="Remover 1 minuto">
          <Minus size={16} /> 1m
        </button>
        
        {isPipSupported && (
          <button 
            className={`btn btn-secondary small ${isPipActive ? 'active-pip' : ''}`} 
            onClick={togglePip} 
            title={isPipActive ? "Fechar Mini Player" : "Abrir Mini Player Flutuante"}
            style={{ 
              color: isPipActive ? 'var(--primary)' : 'inherit',
              borderColor: isPipActive ? 'var(--primary)' : 'inherit',
              boxShadow: isPipActive ? '0 0 10px rgba(255,0,60,0.3)' : 'none'
            }}
          >
            <PictureInPicture size={18} /> PiP
          </button>
        )}
        
        <button className="btn btn-secondary small" onClick={() => addTime(300)} title="Adicionar 5 minutos">
          <Plus size={16} /> 5m
        </button>
      </div>
    </div>
  );
}
