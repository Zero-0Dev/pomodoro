import React from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import { MODES } from '../../hooks/useTimer';
import './TimerDisplay.css';
import { Coffee, Briefcase, Moon } from 'lucide-react';

export default function TimerDisplay({ timeLeft, mode, currentTask }) {
  const { settings } = usePomodoro();

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  // Calcular progresso para barra circular ou linear
  const getProgress = () => {
    let total = settings.pomodoroTime * 60;
    if (mode === MODES.SHORT_BREAK) total = settings.shortBreakTime * 60;
    if (mode === MODES.LONG_BREAK) total = settings.longBreakTime * 60;
    
    if (total === 0) return 0;
    return ((total - timeLeft) / total) * 100;
  };

  const getModeInfo = () => {
    switch (mode) {
      case MODES.FOCUS:
        return { label: 'Foco', color: 'var(--primary)', icon: <Briefcase size={20}/> };
      case MODES.SHORT_BREAK:
        return { label: 'Pausa Curta', color: 'var(--success)', icon: <Coffee size={20}/> };
      case MODES.LONG_BREAK:
        return { label: 'Pausa Longa', color: '#3498db', icon: <Moon size={20}/> };
      default:
        return { label: '', color: 'var(--text)' };
    }
  };

  const info = getModeInfo();
  const progress = getProgress();

  return (
    <div className="timer-display-container">
      <div className="mode-badge" style={{ color: info.color, borderColor: info.color }}>
        {info.icon} {info.label}
      </div>
      
      {mode === MODES.FOCUS && currentTask && (
        <div className="current-task-label">
           Atividade atual: <strong>{currentTask}</strong>
        </div>
      )}

      <div className="timer-wrapper">
        {/* Simple Progress Ring effect */}
        <div 
          className="progress-ring-bg"
          style={{
            background: `conic-gradient(${info.color} ${progress}%, var(--panel-light) ${progress}%)`
          }}
        >
          <div className="timer-inner">
            <h1 className="timer-text" style={{ color: info.color }}>
              {minutes}:{seconds}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
