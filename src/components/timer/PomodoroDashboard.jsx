import React from 'react';
import { useTimer, MODES } from '../../hooks/useTimer';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import TaskPrompt from './TaskPrompt';
import TaskEvaluation from './TaskEvaluation';

export default function PomodoroDashboard() {
  const {
    mode, cycles, timeLeft, isRunning, isPaused,
    startTimer, pauseTimer, resumeTimer, stopTimer, switchMode, addTime,
    currentTask, currentCategory,
    isTaskPromptOpen, setIsTaskPromptOpen, startTaskWithInfo,
    isEvaluationOpen, proceedFromEvaluation
  } = useTimer();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '500px',
      margin: 'auto'
    }}>
      <TimerDisplay 
        timeLeft={timeLeft} 
        mode={mode} 
        currentTask={currentTask} 
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

      <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Ciclos completos: <strong>{cycles}</strong></p>
      </div>

      <TaskPrompt 
        isOpen={isTaskPromptOpen}
        onClose={() => setIsTaskPromptOpen(false)}
        onStart={startTaskWithInfo}
      />

      <TaskEvaluation
        isOpen={isEvaluationOpen}
        onComplete={proceedFromEvaluation}
        task={currentTask}
        category={currentCategory}
        cycles={cycles}
        mode={mode}
      />
    </div>
  );
}
