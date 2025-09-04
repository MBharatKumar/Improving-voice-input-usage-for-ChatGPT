
import { useState, useEffect, useRef, useCallback } from 'react';

// Polyfill for browser compatibility
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  const browserSupportsSpeechRecognition = !!SpeechRecognition;

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcriptArray = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript);
      const fullTranscript = transcriptArray.join('');
      setTranscript(fullTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [browserSupportsSpeechRecognition]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };
  
  const cancelListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      setTranscript('');
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    cancelListening,
    browserSupportsSpeechRecognition,
    clearTranscript,
  };
};
