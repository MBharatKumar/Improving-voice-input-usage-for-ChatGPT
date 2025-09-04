
import React from 'react';
import { XMarkIcon } from './Icons';

interface InfoCardProps {
  title: string;
  onDismiss: () => void;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, onDismiss, children }) => {
  return (
    <div className="w-full max-w-sm p-4 mb-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
        <button onClick={onDismiss} className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
          <XMarkIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        </button>
      </div>
      {children}
    </div>
  );
};
