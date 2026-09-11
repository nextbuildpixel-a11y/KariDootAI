// KariDoot AI — Voice Service
// Web Speech API wrapper for Voice Copilot (TTS) and Voice Recording (STT)

import { VOICE_INSTRUCTIONS } from '../data/mockArtisanData';

// ─────────────────────────────────────────────────────────────
// TEXT-TO-SPEECH — Voice Copilot
// ─────────────────────────────────────────────────────────────
// Map your UI dropdown labels to BCP 47 language tags
export const languageMap = {
  'Telugu': 'te-IN',
  'Hindi': 'hi-IN',
  'Tamil': 'ta-IN',
  'Bengali': 'bn-IN',
  'English': 'en-IN',
  'te': 'te-IN',
  'hi': 'hi-IN',
  'ta': 'ta-IN',
  'bn': 'bn-IN',
  'en': 'en-IN'
};

// Call this function when the user clicks "Next Step" or the Speaker icon
export const triggerVoiceGuidance = (instructionText, selectedLanguage = 'English') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  // IMMEDIATELY cancel any stuck audio to prevent silent hanging
  window.speechSynthesis.cancel(); 
  
  const utterance = new SpeechSynthesisUtterance(instructionText);
  utterance.lang = languageMap[selectedLanguage] || 'en-IN';
  utterance.rate = 0.9; // Slightly slower for better regional pronunciation
  
  window.speechSynthesis.speak(utterance);
};

export function speakInstruction(stepKey, dialect = 'hi', enabled = true) {
  if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return;

  const text = VOICE_INSTRUCTIONS[dialect]?.[stepKey] || VOICE_INSTRUCTIONS.en?.[stepKey] || '';
  if (!text) return;

  triggerVoiceGuidance(text, dialect);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// ─────────────────────────────────────────────────────────────
// SPEECH-TO-TEXT — Voice Note Recording
// ─────────────────────────────────────────────────────────────
export function createVoiceRecorder(dialect = 'hi', onResult, onError, onStateChange) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError?.('Speech recognition not supported in this browser. Please use Chrome or Edge.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = languageMap[dialect] || 'hi-IN';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let finalTranscript = '';
  let isRecording = false;

  recognition.onstart = () => {
    isRecording = true;
    onStateChange?.('recording');
  };

  recognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interim += transcript;
      }
    }
    onResult?.({ final: finalTranscript.trim(), interim: interim.trim() });
  };

  recognition.onerror = (event) => {
    isRecording = false;
    onStateChange?.('idle');
    if (event.error === 'not-allowed') {
      onError?.('Microphone permission denied. Please allow microphone access.');
    } else if (event.error === 'network') {
      onError?.('Network error. Speech recognition requires internet connection.');
    } else {
      onError?.(`Recording error: ${event.error}`);
    }
  };

  recognition.onend = () => {
    isRecording = false;
    onStateChange?.('idle');
  };

  return {
    start: () => {
      finalTranscript = '';
      try {
        recognition.start();
      } catch (e) {
        onError?.(`Could not start recording: ${e.message}`);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    },
    isRecording: () => isRecording,
    getTranscript: () => finalTranscript.trim(),
  };
}

// ─────────────────────────────────────────────────────────────
// VOICE SUPPORT DETECTION
// ─────────────────────────────────────────────────────────────
export function checkVoiceSupport() {
  return {
    tts: typeof window !== 'undefined' && 'speechSynthesis' in window,
    stt: typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
  };
}
