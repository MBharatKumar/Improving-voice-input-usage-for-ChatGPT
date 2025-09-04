
import React from 'react';
import { Message, Role } from '../types';
import { SparkleIcon, UserIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;

  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-indigo-500' : 'bg-zinc-600'}`}>
        {isModel ? (
          <SparkleIcon className="w-5 h-5 text-white" />
        ) : (
          <UserIcon className="w-5 h-5 text-white" />
        )}
      </div>
      <div className={`prose prose-zinc dark:prose-invert max-w-full rounded-lg p-4 ${isModel ? 'bg-zinc-100 dark:bg-zinc-700/50' : ''}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
