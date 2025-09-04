
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message, Role } from './types';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { InfoCard } from './components/InfoCard';
import { VoiceNudge } from './components/VoiceNudge';
import { VoiceSuccessToast } from './components/VoiceSuccessToast';
import { SparkleIcon } from './components/Icons';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showVoiceBetterCard, setShowVoiceBetterCard] = useState<boolean>(true);
  const [showPlusCard, setShowPlusCard] = useState<boolean>(true);
  
  const [showVoiceNudge, setShowVoiceNudge] = useState<boolean>(false);
  const [nudgeableQuery, setNudgeableQuery] = useState<string>('');
  
  const [showVoiceSuccessToast, setShowVoiceSuccessToast] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    cancelListening,
    browserSupportsSpeechRecognition,
    clearTranscript,
  } = useSpeechRecognition();
  const prevIsListening = useRef(isListening);


  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
      });
      setChat(newChat);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Initialization Error: ${e.message}`);
      } else {
        setError('An unknown initialization error occurred.');
      }
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const isShortConversationalQuery = (query: string): boolean => {
    const lowerQuery = query.toLowerCase().trim();
    const words = lowerQuery.split(/\s+/);
    const questionKeywords = ['what', 'what\'s', 'who', 'who\'s', 'when', 'where', 'why', 'how'];

    const isShort = words.length <= 10;
    const isQuestion = lowerQuery.endsWith('?');
    const startsWithQuestionWord = questionKeywords.some(kw => lowerQuery.startsWith(kw));

    return isShort && (isQuestion || startsWithQuestionWord);
  };

  const handleSendMessage = useCallback(async (text: string, fromVoice: boolean = false) => {
    if (!text.trim() || isLoading) return;
    
    if (showVoiceBetterCard) setShowVoiceBetterCard(false);
    if (showPlusCard && messages.length > 0) setShowPlusCard(false);
    
    const userMessage: Message = { role: Role.USER, content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setShowVoiceNudge(false);

    if (fromVoice) {
      setShowVoiceSuccessToast(true);
      setTimeout(() => setShowVoiceSuccessToast(false), 6000);
    } else {
      if (isShortConversationalQuery(text)) {
        setNudgeableQuery(text);
        setShowVoiceNudge(true);
      }
    }

    if (!chat) {
        setError("Chat is not initialized.");
        setIsLoading(false);
        return;
    }
    
    try {
      const result = await chat.sendMessage({ message: text });
      const modelMessage: Message = { role: Role.MODEL, content: result.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get response: ${errorMessage}`);
      setMessages(prev => [...prev, { role: Role.MODEL, content: `Sorry, I encountered an error. ${errorMessage}` }]);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading, showVoiceBetterCard, showPlusCard, messages.length]);
  
  useEffect(() => {
    if (prevIsListening.current && !isListening && transcript) {
      handleSendMessage(transcript, true);
      clearTranscript();
    }
    prevIsListening.current = isListening;
  }, [isListening, transcript, handleSendMessage, clearTranscript]);

  return (
    <div className="h-screen w-screen bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 flex flex-col font-sans max-w-lg mx-auto">
      <Header />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-2xl font-bold mb-6">What can I help with?</h1>
            {showVoiceBetterCard && (
              <InfoCard
                title="Voice input is now better"
                onDismiss={() => setShowVoiceBetterCard(false)}
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  supports local languages, enhanced privacy, and perfect for short queries!
                </p>
              </InfoCard>
            )}
            {showPlusCard && (
               <InfoCard
                title="Unlock more with Plus"
                onDismiss={() => setShowPlusCard(false)}
              >
                <div className="flex flex-col gap-3">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        ChatGPT Plus gives you higher limits, smarter models, and Sora for video.
                    </p>
                    <button className="bg-zinc-700 dark:bg-zinc-600 hover:bg-zinc-600 dark:hover:bg-zinc-500 text-white font-semibold py-2 px-4 rounded-lg w-full">
                        Upgrade
                    </button>
                </div>
              </InfoCard>
            )}
          </div>
        )}
        
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-4 p-4 rounded-lg">
            <SparkleIcon className="w-8 h-8 text-zinc-500 animate-pulse" />
            <div className="w-full space-y-2">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full w-3/4 animate-pulse"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full w-1/2 animate-pulse"></div>
            </div>
          </div>
        )}

        {error && <div className="text-red-500 text-center p-2 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}

      </main>

      {showVoiceNudge && <VoiceNudge query={nudgeableQuery} onUseVoice={() => {
        setShowVoiceNudge(false);
        startListening();
      }} onCancel={() => setShowVoiceNudge(false)} />}
      
      {showVoiceSuccessToast && <VoiceSuccessToast />}

      <footer className="p-4 border-t border-zinc-200 dark:border-zinc-700">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          transcript={transcript}
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
          cancelListening={cancelListening}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        />
        <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-3">
            ChatGPT can make mistakes. Check important info.
        </p>
      </footer>
    </div>
  );
};

export default App;
