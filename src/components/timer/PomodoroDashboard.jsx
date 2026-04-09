import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MODES } from '../../hooks/useTimer';
import { useTimerContext } from '../../store/TimerContext';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import TaskPrompt from './TaskPrompt';
import TaskEvaluation from './TaskEvaluation';
import CompactChecklist from './CompactChecklist';
import { usePomodoro } from '../../store/PomodoroContext';
import './PomodoroDashboard.css';

export default function PomodoroDashboard() {
  const { tasks } = usePomodoro();
  const {
    mode, cycles, timeLeft, isRunning, isPaused,
    startTimer, pauseTimer, resumeTimer, stopTimer, switchMode, addTime,
    activeTaskId,
    isTaskPromptOpen, setIsTaskPromptOpen, startTaskWithInfo,
    isEvaluationOpen, proceedFromEvaluation
  } = useTimerContext();

  const activeTask = tasks.find(t => t.id === activeTaskId);

  // Picture in Picture State
  const [pipWindow, setPipWindow] = useState(null);
  const isPipSupported = 'documentPictureInPicture' in window;

  const togglePip = async () => {
    if (pipWindow) {
      pipWindow.close();
      return;
    }
    
    if (isPipSupported) {
      try {
        const pip = await window.documentPictureInPicture.requestWindow({
          width: 350,
          height: 250,
        });

        // Copy styles to the PiP window
        [...document.styleSheets].forEach((styleSheet) => {
          try {
            const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
            const style = document.createElement('style');
            style.textContent = cssRules;
            pip.document.head.appendChild(style);
          } catch (e) {
            if (styleSheet.href) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = styleSheet.type;
                link.media = styleSheet.media;
                link.href = styleSheet.href;
                pip.document.head.appendChild(link);
            }
          }
        });

        // Set PiP initial background
        pip.document.body.style.background = '#050505'; // Cyberpunk dark
        pip.document.body.style.margin = '0';
        pip.document.body.style.display = 'flex';
        pip.document.body.style.alignItems = 'center';
        pip.document.body.style.justifyContent = 'center';

        pip.addEventListener('pagehide', () => {
           setPipWindow(null);
        });
        
        setPipWindow(pip);
      } catch (e) {
        console.error("Erro abrir PiP", e);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        
        {/* Lado Esquerdo: Timer Principal */}
        <div className="dashboard-timer-section">
          <TimerDisplay 
            timeLeft={timeLeft} 
            mode={mode} 
            currentTask={activeTask ? activeTask.text : ''} 
          />
          
          <Controls 
            isRunning={isRunning}
            isPaused={isPaused}
            mode={mode}
            startTimer={startTimer}
            pauseTimer={pauseTimer}
            resumeTimer={resumeTimer}
            stopTimer={stopTimer}
            addTime={addTime}
            switchMode={switchMode}
            isPipSupported={isPipSupported}
            togglePip={togglePip}
            isPipActive={!!pipWindow}
          />

          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Ciclos completos: <strong>{cycles}</strong></p>
          </div>
        </div>

        {/* Lado Direito: Tarefas Fixadas (Post-it style) */}
        <div className="dashboard-tasks-section">
          <CompactChecklist isRunning={isRunning} mode={mode} />
        </div>

      </div>

      <TaskPrompt 
        isOpen={isTaskPromptOpen}
        onClose={() => setIsTaskPromptOpen(false)}
        onStart={startTaskWithInfo}
      />

      <TaskEvaluation
        isOpen={isEvaluationOpen}
        onComplete={proceedFromEvaluation}
        task={activeTask ? activeTask.text : ''}
        category={activeTask ? activeTask.categoryId : ''}
        taskId={activeTask ? activeTask.id : null}
        cycles={cycles}
        mode={mode}
      />

      {/* Renderização no Janela Flutuante (Portal) */}
      {pipWindow && createPortal(
         <div style={{ padding: '2rem', width: '100%', height: '100%', boxSizing: 'border-box' }}>
            <TimerDisplay timeLeft={timeLeft} mode={mode} currentTask={activeTask ? activeTask.text : ''} isPip={true} />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button onClick={() => isRunning ? pauseTimer() : resumeTimer()} className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>
                {isRunning ? 'Pausar' : 'Continuar'}
              </button>
            </div>
         </div>,
         pipWindow.document.body
      )}
    </div>
  );
}
