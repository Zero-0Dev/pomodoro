import { useState, useEffect, useRef, useCallback } from 'react';
import { usePomodoro } from '../store/PomodoroContext';

export const MODES = {
  FOCUS: 'focus',
  SHORT_BREAK: 'short_break',
  LONG_BREAK: 'long_break'
};

export function useTimer() {
  const { settings } = usePomodoro();
  
  const [mode, setMode] = useState(MODES.FOCUS);
  const [cycles, setCycles] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  // Anti-procrastination
  const [currentTask, setCurrentTask] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [isTaskPromptOpen, setIsTaskPromptOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  // Refs for precise timing
  const endTimeRef = useRef(null);
  const timerRef = useRef(null);

  const getDurationForMode = useCallback((m) => {
    if (m === MODES.FOCUS) return settings.pomodoroTime * 60;
    if (m === MODES.SHORT_BREAK) return settings.shortBreakTime * 60;
    return settings.longBreakTime * 60;
  }, [settings]);

  const notify = useCallback((title, body) => {
    if (settings.soundEnabled) {
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa12c9.mp3');
      audio.play().catch(e => console.error("Audio block:", e));
    }
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }, [settings]);

  // Sync initial timer when settings change (only if not running)
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getDurationForMode(mode));
    }
  }, [settings, mode, isRunning, getDurationForMode]);

  // The actual interval loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const difference = Math.round((endTimeRef.current - now) / 1000);
        
        if (difference <= 0) {
          setTimeLeft(0);
        } else {
          setTimeLeft(difference);
        }
      }, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Watcher para quando o tempo acabar (Evita stale closures do setInterval)
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false); // break reference
      if (timerRef.current) clearInterval(timerRef.current);
      
      if (mode === MODES.FOCUS) {
        notify("Pomodoro Concluído!", "Hora de registrar seu progresso.");
        setIsEvaluationOpen(true);
      } else {
        notify("Descanso Finalizado!", "Pronto para o próximo foco?");
        handleBreakComplete();
      }
    }
  }, [timeLeft, isRunning, mode, notify]);

  const handleBreakComplete = useCallback(() => {
    let nextCycles = cycles;
    if (mode === MODES.LONG_BREAK) {
      nextCycles = 0;
    }
    
    setMode(MODES.FOCUS);
    setCycles(nextCycles);
    setTimeLeft(getDurationForMode(MODES.FOCUS));

    if (settings.autoStartNext) {
      // Must give UI a split second to render before triggering next
      setTimeout(() => {
        setIsTaskPromptOpen(true); // Always prompts for task on focus
      }, 300);
    }
  }, [mode, cycles, settings.autoStartNext, getDurationForMode]);

  const proceedFromEvaluation = useCallback(() => {
    // UI called this after saving the history item
    setIsEvaluationOpen(false);
    
    // Switch to break
    const nextCycles = cycles + 1;
    setCycles(nextCycles);
    
    if (nextCycles >= settings.cyclesBeforeLongBreak) {
      setMode(MODES.LONG_BREAK);
      setTimeLeft(getDurationForMode(MODES.LONG_BREAK));
    } else {
      setMode(MODES.SHORT_BREAK);
      setTimeLeft(getDurationForMode(MODES.SHORT_BREAK));
    }

    if (settings.autoStartNext) {
      setTimeout(() => {
        endTimeRef.current = Date.now() + (getDurationForMode(nextCycles >= settings.cyclesBeforeLongBreak ? MODES.LONG_BREAK : MODES.SHORT_BREAK) * 1000);
        setIsRunning(true);
      }, 500);
    }
  }, [cycles, settings, getDurationForMode]);

  const startTimer = useCallback(() => {
    if (mode === MODES.FOCUS && !currentTask) {
      setIsTaskPromptOpen(true);
      return;
    }
    
    endTimeRef.current = Date.now() + (timeLeft * 1000);
    setIsRunning(true);
  }, [mode, currentTask, timeLeft]);

  const startTaskWithInfo = useCallback((task, category) => {
    setCurrentTask(task);
    setCurrentCategory(category);
    setIsTaskPromptOpen(false);
    endTimeRef.current = Date.now() + (timeLeft * 1000);
    setIsRunning(true);
  }, [timeLeft]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resumeTimer = useCallback(() => {
    endTimeRef.current = Date.now() + (timeLeft * 1000);
    setIsRunning(true);
  }, [timeLeft]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(getDurationForMode(mode));
  }, [mode, getDurationForMode]);

  const stopTimer = useCallback(() => {
    if(window.confirm("Deseja interromper esta sessão? (Ela será contada como incompleta)")) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setMode(MODES.FOCUS);
      setCycles(0);
      setCurrentTask('');
      setCurrentCategory('');
      setTimeLeft(getDurationForMode(MODES.FOCUS));
    }
  }, [getDurationForMode]);

  const switchModeCustom = useCallback((newMode) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode));
  }, [getDurationForMode]);

  const addTime = useCallback((seconds) => {
    const newTime = timeLeft + seconds;
    if (isRunning) {
      endTimeRef.current += (seconds * 1000);
    }
    setTimeLeft(Math.max(0, newTime));
  }, [timeLeft, isRunning]);

  return {
    mode,
    cycles,
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer,
    switchMode: switchModeCustom,
    addTime,
    // Anti Procrastination
    currentTask,
    currentCategory,
    isTaskPromptOpen,
    setIsTaskPromptOpen,
    startTaskWithInfo,
    isEvaluationOpen,
    proceedFromEvaluation
  };
}
