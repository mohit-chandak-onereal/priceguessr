'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';

interface Toast {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({ 
  toast, 
  onRemove 
}: { 
  toast: Toast; 
  onRemove: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration || 5000;
    
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    const removeTimer = setTimeout(() => {
      onRemove();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.duration, onRemove]);

  return (
    <div
      className={`
        panel-game-show p-4 min-w-[300px] max-w-md
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
      onClick={() => {
        setIsExiting(true);
        setTimeout(onRemove, 300);
      }}
    >
      <div className="flex items-start gap-3">
        {toast.icon && (
          <div className="text-3xl">{toast.icon}</div>
        )}
        <div className="flex-1">
          <h3 className="font-bold text-yellow-bright text-game-show">
            {toast.title}
          </h3>
          {toast.description && (
            <p className="text-sm text-muted mt-1">
              {toast.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to show achievement toast
export function showAchievementToast(name: string, description: string, icon: string) {
  useToastStore.getState().addToast({
    title: 'Achievement Unlocked!',
    description: `${icon} ${name} - ${description}`,
    icon: '🏆',
    duration: 7000,
  });
}