'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export function ToastContainer() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        const bg =
          toast.type === 'error'
            ? 'bg-rose-600 text-white'
            : toast.type === 'info'
            ? 'bg-sky-600 text-white'
            : 'bg-emerald-600 text-white';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-apple-md shadow-lg font-medium text-sm transition-all duration-300 animate-slide-in ${bg}`}
          >
            <i
              className={
                toast.type === 'error'
                  ? 'ri-error-warning-line text-lg'
                  : toast.type === 'info'
                  ? 'ri-information-line text-lg'
                  : 'ri-checkbox-circle-line text-lg'
              }
            />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
