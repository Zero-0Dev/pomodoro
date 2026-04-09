import React, { createContext, useContext } from 'react';
import { useTimer as useTimerHook } from '../hooks/useTimer';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const timerState = useTimerHook();

  return (
    <TimerContext.Provider value={timerState}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext deve ser usado dentro de um TimerProvider');
  }
  return context;
};
