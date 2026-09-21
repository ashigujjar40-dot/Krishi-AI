// Voice recognition and audio playback utilities for low-literacy users

export function speakText(text: string, lang: 'en' | 'hi' | 'mr' | 'te', onEnd?: () => void): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser');
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Map languages
  if (lang === 'hi') utterance.lang = 'hi-IN';
  else if (lang === 'mr') utterance.lang = 'mr-IN';
  else if (lang === 'te') utterance.lang = 'te-IN';
  else utterance.lang = 'en-IN';

  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function createSpeechRecognizer(
  lang: 'en' | 'hi' | 'mr' | 'te',
  onResult: (transcript: string) => void,
  onError: (err: string) => void,
  onEnd: () => void
) {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  if (lang === 'hi') recognition.lang = 'hi-IN';
  else if (lang === 'mr') recognition.lang = 'mr-IN';
  else if (lang === 'te') recognition.lang = 'te-IN';
  else recognition.lang = 'en-IN';

  recognition.onresult = (event: any) => {
    let current = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      current += event.results[i][0].transcript;
    }
    onResult(current);
  };

  recognition.onerror = (event: any) => {
    onError(event.error || 'Voice input error');
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
