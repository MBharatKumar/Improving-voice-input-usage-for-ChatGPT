
import React from 'react';

interface VoiceNudgeProps {
  query: string;
  onUseVoice: () => void;
  onCancel: () => void;
}

export const VoiceNudge: React.FC<VoiceNudgeProps> = ({ query, onUseVoice, onCancel }) => {
  return (
    <div className="px-4 pb-2">
      <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg shadow-md flex justify-between items-center">
        <div className="flex-1">
          <p className="text-xs text-zinc-600 dark:text-zinc-300">You can ask this aloud next time for even faster results.</p>
          <p className="font-semibold truncate text-sm">"{query}"</p>
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={onUseVoice} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Use Voice</button>
          <button onClick={onCancel} className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:underline">Cancel</button>
        </div>
      </div>
    </div>
  );
};
