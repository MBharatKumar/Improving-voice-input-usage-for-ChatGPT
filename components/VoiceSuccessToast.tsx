
import React from 'react';
import { SpeakerWaveIcon } from './Icons';

export const VoiceSuccessToast: React.FC = () => {
  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-slide-in-out">
      <SpeakerWaveIcon className="w-6 h-6" />
      <span className="text-base font-medium">Great! Voice just made your task easier.</span>
    </div>
  );
};
