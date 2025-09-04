import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MicrophoneIcon, ArrowUpIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (text: string, fromVoice: boolean) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const { transcript, isListening, startListening, stopListening, browserSupportsSpeechRecognition, clearTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && !isListening) {
      onSendMessage(transcript, true);
      clearTranscript();
    }
  }, [transcript, isListening, onSendMessage, clearTranscript]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text, false);
      setText('');
    }
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form onSubmit={handleTextSubmit} className="flex items-center gap-2 p-2 border border-zinc-300 dark:border-zinc-600 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask anything"
        className="flex-1 bg-transparent focus:outline-none px-2"
        disabled={isLoading || isListening}
      />
      <button
        type="button"
        onClick={handleVoiceClick}
        disabled={isLoading || !browserSupportsSpeechRecognition}
        className={`p-2 rounded-full transition-colors ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        }`}
        title={browserSupportsSpeechRecognition ? 'Use voice input' : 'Speech recognition not supported'}
      >
        <MicrophoneIcon className="w-6 h-6" />
      </button>
      {text && (
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-2 rounded-full bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800 hover:opacity-90 disabled:opacity-50"
        >
          <ArrowUpIcon className="w-6 h-6 transform -rotate-45" />
        </button>
      )}
    </form>
  );
};
