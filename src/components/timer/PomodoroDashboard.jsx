import React from 'react';
import { useTimer, MODES } from '../../hooks/useTimer';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import TaskPrompt from './TaskPrompt';
import TaskEvaluation from './TaskEvaluation';
import CompactChecklist from './CompactChecklist';
import { usePomodoro } from '../../store/PomodoroContext';

export default function PomodoroDashboard() {
  const { tasks } = usePomodoro();
  const {
    mode, cycles, timeLeft, isRunning, isPaused,
    startTimer, pauseTimer, resumeTimer, stopTimer, switchMode, addTime,
    activeTaskId,
    isTaskPromptOpen, setIsTaskPromptOpen, startTaskWithInfo,
    isEvaluationOpen, proceedFromEvaluation
  } = useTimer();

  const activeTask = tasks.find(t => t.id === activeTaskId);

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

      <CompactChecklist isRunning={isRunning} mode={mode} />

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
