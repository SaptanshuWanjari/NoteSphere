"use client";
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within a NotificationProvider');
  return ctx;
};

let idCounter = 0;

const typeStyles = {
  info: {
    container: 'bg-blue-600 text-white',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100-2 1 1 0 000 2zm-1 2a1 1 0 000 2h1v4a1 1 0 102 0v-5a1 1 0 00-1-1h-2z" clipRule="evenodd" />
      </svg>
    )
  },
  success: {
    container: 'bg-green-600 text-white',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 12.086l6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )
  },
  danger: {
    container: 'bg-red-600 text-white',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.59c.75 1.334-.213 2.986-1.742 2.986H3.48c-1.53 0-2.492-1.652-1.743-2.985l6.52-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
      </svg>
    )
  }
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const remove = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
  };

  const show = (message, type = 'info', duration = 2500) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    const timeout = setTimeout(() => remove(id), duration);
    timers.current.set(id, timeout);
    return id;
  };

  const value = useMemo(() => ({ show }), []);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(({ id, message, type }) => {
          const styles = typeStyles[type] || typeStyles.info;
          return (
            <div
              key={id}
              className={`pointer-events-auto shadow-lg rounded-md px-4 py-3 flex items-center gap-2 ${styles.container}`}
              role="status"
              aria-live="polite"
            >
              <span className="shrink-0" aria-hidden>{styles.icon}</span>
              <span className="text-sm font-medium">{message}</span>
              <button
                onClick={() => remove(id)}
                className="ml-2 inline-flex items-center justify-center rounded hover:opacity-80 focus:outline-none"
                aria-label="Close notification"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};
