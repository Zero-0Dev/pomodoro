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
  const [isPaused, setIsPaused] = useState(false);

  // Anti-procrastination
  const [currentTask, setCurrentTask] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [isTaskPromptOpen, setIsTaskPromptOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  // Refs for precise timing — avoid stale closures
  const endTimeRef = useRef(null);
  const timerRef = useRef(null);
  // Store volatile state in refs so callbacks don't close over stale values
  const modeRef = useRef(mode);
  const cyclesRef = useRef(cycles);
  const isRunningRef = useRef(isRunning);
  const settingsRef = useRef(settings);

  // Keep refs in sync
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { cyclesRef.current = cycles; }, [cycles]);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  const getDurationForMode = useCallback((m) => {
    const s = settingsRef.current;
    if (m === MODES.FOCUS) return s.pomodoroTime * 60;
    if (m === MODES.SHORT_BREAK) return s.shortBreakTime * 60;
    return s.longBreakTime * 60;
  }, []);

  const notify = useCallback((title, body) => {
    const s = settingsRef.current;
    if (s.soundEnabled) {
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa12c9.mp3');
      audio.play().catch(() => {});
    }
    if (s.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }, []);

  // Sync timer display when settings change (only if paused)
  useEffect(() => {
    if (!isRunningRef.current) {
      setTimeLeft(getDurationForMode(modeRef.current));
    }
  }, [settings, getDurationForMode]);

  // The tick interval — only recreated when isRunning changes
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
        setTimeLeft(remaining);
      }, 500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  // Timer completion watcher
  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return;

    setIsRunning(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }

    const currentMode = modeRef.current;
    if (currentMode === MODES.FOCUS) {
      notify('Pomodoro Concluído!', 'Hora de registrar seu progresso.');
      setIsEvaluationOpen(true);
    } else {
      notify('Descanso Finalizado!', 'Pronto para o próximo foco?');
      // Break ended — go back to focus
      setMode(MODES.FOCUS);
      setIsPaused(false);
      const focusDuration = getDurationForMode(MODES.FOCUS);
      setTimeLeft(focusDuration);
      if (settingsRef.current.autoStartNext) {
        setTimeout(() => {
          setIsTaskPromptOpen(true);
        }, 300);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isRunning]);

  // Called by TaskEvaluation after user submits rating
  const proceedFromEvaluation = useCallback(() => {
    setIsEvaluationOpen(false);

    const newCycles = cyclesRef.current + 1;
    setCycles(newCycles);

    const s = settingsRef.current;
    const isLong = newCycles % s.cyclesBeforeLongBreak === 0;
    const nextMode = isLong ? MODES.LONG_BREAK : MODES.SHORT_BREAK;
    const breakDuration = getDurationForMode(nextMode);

    setMode(nextMode);
    setTimeLeft(breakDuration);

    if (s.autoStartNext) {
      setTimeout(() => {
        endTimeRef.current = Date.now() + breakDuration * 1000;
        setIsRunning(true);
      }, 500);
    }
  }, [getDurationForMode]);

  const startTimer = useCallback(() => {
    const currentMode = modeRef.current;
    if (currentMode === MODES.FOCUS && !currentTask) {
      setIsTaskPromptOpen(true);
      return;
    }
    setIsPaused(false);
    setTimeLeft(prev => {
      endTimeRef.current = Date.now() + prev * 1000;
      return prev;
    });
    setIsRunning(true);
  }, [currentTask]);

  const startTaskWithInfo = useCallback((task, category) => {
    setCurrentTask(task);
    setCurrentCategory(category);
    setIsTaskPromptOpen(false);
    setIsPaused(false);
    setTimeLeft(prev => {
      endTimeRef.current = Date.now() + prev * 1000;
      return prev;
    });
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setTimeLeft(prev => {
      endTimeRef.current = Date.now() + prev * 1000;
      return prev;
    });
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const stopTimer = useCallback(() => {
    if (window.confirm('Deseja interromper esta sessão?')) {
      setIsRunning(false);
      setIsPaused(false);
      setCurrentTask('');
      setCurrentCategory('');
      const focusDuration = getDurationForMode(MODES.FOCUS);
      setMode(MODES.FOCUS);
      setTimeLeft(focusDuration);
    }
  }, [getDurationForMode]);

  const switchModeCustom = useCallback((newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode));
  }, [getDurationForMode]);

  const addTime = useCallback((seconds) => {
    setTimeLeft(prev => {
      const next = Math.max(0, prev + seconds);
      if (isRunningRef.current) {
        endTimeRef.current += seconds * 1000;
      }
      return next;
    });
  }, []);

  return {
    mode,
    cycles,
    timeLeft,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    switchMode: switchModeCustom,
    addTime,
    currentTask,
    currentCategory,
    isTaskPromptOpen,
    setIsTaskPromptOpen,
    startTaskWithInfo,
    isEvaluationOpen,
    proceedFromEvaluation
  };
}
