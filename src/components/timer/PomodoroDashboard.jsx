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
  const { tasks, history, settings } = usePomodoro();
  const {
    mode, cycles, timeLeft, isRunning, isPaused,
    startTimer, pauseTimer, resumeTimer, stopTimer, switchMode, addTime, skipCurrentMode, resetTimer,
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

  // Daily Goal Logic
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayFocusPomodoros = history.filter(item => {
    return item.type === 'focus' && new Date(item.date) >= todayStart;
  }).length;

  // Streak Logic
  const getStreak = () => {
    const dates = history
      .filter(item => item.type === 'focus')
      .map(item => {
        const d = new Date(item.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      });
      
    if (dates.length === 0) return 0;
    
    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();
    
    if (uniqueDates[0] !== todayTime && uniqueDates[0] !== yesterdayTime) {
      return 0; // Streak broken
    }
    
    let expectedNext = uniqueDates[0];
    
    for (let i = 0; i < uniqueDates.length; i++) {
      if (uniqueDates[i] === expectedNext) {
        currentStreak++;
        const prev = new Date(expectedNext);
        prev.setDate(prev.getDate() - 1);
        expectedNext = prev.getTime();
      } else {
        break;
      }
    }
    
    return currentStreak;
  };

  const streakCount = getStreak();

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        
        {/* Lado Esquerdo: Timer Principal */}
        <div className="dashboard-timer-section">
          
          {/* Top Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--panel-light)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--primary)', boxShadow: 'var(--border-glow)' }} title="Meta Diária de Pomodoros">
              <span style={{ fontSize: '1.2rem' }}>🎯</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Meta Diária</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-hover)', lineHeight: '1' }}>{todayFocusPomodoros} / {settings.dailyGoal || 8}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--panel-light)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--warning)', boxShadow: '0 0 10px rgba(252, 238, 10, 0.2)' }} title="Dias Seguidos de Foco">
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Streak</span>
                <span style={{ fontWeight: 'bold', color: 'var(--warning)', lineHeight: '1' }}>{streakCount} {streakCount === 1 ? 'dia' : 'dias'}</span>
              </div>
            </div>
          </div>

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
            skipCurrentMode={skipCurrentMode}
            resetTimer={resetTimer}
            isPipSupported={isPipSupported}
            togglePip={togglePip}
            isPipActive={!!pipWindow}
          />

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Array.from({ length: settings.cyclesBeforeLongBreak }).map((_, i) => {
                const isFilled = mode === 'long_break' ? true : i < (cycles % settings.cyclesBeforeLongBreak);
                return (
                  <div 
                    key={i} 
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: isFilled ? 'var(--primary)' : 'var(--panel-light)',
                      border: '1px solid var(--primary)',
                      boxShadow: isFilled ? '0 0 8px var(--primary)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                    title={`Progresso: Ciclo ${i + 1} de ${settings.cyclesBeforeLongBreak}`}
                  />
                );
              })}
            </div>
            <p style={{ fontSize: '0.9rem' }}>Ciclos completos: <strong>{cycles}</strong></p>
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
