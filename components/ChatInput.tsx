
import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, ArrowUpIcon, XMarkIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (text: string, fromVoice: boolean) => void;
  isLoading: boolean;
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  cancelListening: () => void;
  browserSupportsSpeechRecognition: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
    onSendMessage, 
    isLoading,
    transcript,
    isListening,
    startListening,
    stopListening,
    cancelListening,
    browserSupportsSpeechRecognition
}) => {
  const [text, setText] = useState('');
  const wasListening = useRef(isListening);

  useEffect(() => {
    if (isListening) {
      setText(transcript);
    } else if (wasListening.current && !isListening) {
      // Just stopped listening, clear the input.
      setText('');
    }
    wasListening.current = isListening;
  }, [transcript, isListening]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text, false);
      setText('');
    }
  };
  
  const handleCancelVoice = () => {
    cancelListening();
    setText('');
  };

  const rightButton = () => {
    if (isListening) {
      return (
        <button
          type="button"
          onClick={stopListening}
          disabled={!text.trim()}
          className="p-2 rounded-full bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800 hover:opacity-90 disabled:opacity-50"
          title="Send"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )
    }
    if (text.trim()) {
      return (
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-2 rounded-full bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800 hover:opacity-90 disabled:opacity-50"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )
    }
    return (
      <button
        type="button"
        onClick={startListening}
        disabled={isLoading || !browserSupportsSpeechRecognition}
        className={`p-2 rounded-full transition-colors text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700`}
        title={browserSupportsSpeechRecognition ? 'Use voice input' : 'Speech recognition not supported'}
      >
        <MicrophoneIcon className="w-6 h-6" />
      </button>
    )
  };

  return (
    <form onSubmit={handleTextSubmit} className="flex items-center gap-2 p-2 border border-zinc-300 dark:border-zinc-600 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
       {isListening && (
        <button
          type="button"
          onClick={handleCancelVoice}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          title="Cancel voice input"
        >
          <XMarkIcon className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
      )}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isListening ? "Listening..." : "Ask anything"}
        className="flex-1 bg-transparent focus:outline-none px-2"
        disabled={isLoading || isListening}
      />
      {rightButton()}
    </form>
  );
};
