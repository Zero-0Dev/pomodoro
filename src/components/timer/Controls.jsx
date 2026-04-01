import React from 'react';
import { Play, Pause, Square, FastForward, Plus, Minus } from 'lucide-react';
import './Controls.css';

export default function Controls({ 
  isRunning, 
  startTimer, 
  pauseTimer, 
  stopTimer, 
  addTime, 
  switchMode, // for skipping to next break/focus
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
          <button className="btn btn-action play" onClick={startTimer}>
            <Play size={28} style={{ marginLeft: '4px' }} />
          </button>
        )}
        
        <button 
          className="btn btn-action stop" 
          onClick={stopTimer}
          disabled={!isRunning}
        >
          <Square size={24} />
        </button>
      </div>

      <div className="secondary-actions">
        <button className="btn btn-secondary small" onClick={() => addTime(-60)}>
          <Minus size={16} /> 1m
        </button>
        <button className="btn btn-secondary small" onClick={() => addTime(300)}>
          <Plus size={16} /> 5m
        </button>
      </div>
    </div>
  );
}
