import React from 'react';
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
    </div>
  );
}
