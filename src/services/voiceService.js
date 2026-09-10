// KariDoot AI — Voice Service
// Web Speech API wrapper for Voice Copilot (TTS) and Voice Recording (STT)

import { VOICE_INSTRUCTIONS } from '../data/mockArtisanData';

// ─────────────────────────────────────────────────────────────
// TEXT-TO-SPEECH — Voice Copilot
// ─────────────────────────────────────────────────────────────
const LANG_MAP = {
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  bn: 'bn-IN',
  en: 'en-IN',
};

let currentUtterance = null;

export function speakInstruction(stepKey, dialect = 'hi', enabled = true) {
  if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return;

  const text = VOICE_INSTRUCTIONS[dialect]?.[stepKey] || VOICE_INSTRUCTIONS.en?.[stepKey] || '';
  if (!text) return;

  // Cancel any current speech
  window.speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = LANG_MAP[dialect] || 'hi-IN';
  currentUtterance.rate = 0.9;
  currentUtterance.pitch = 1.05;
  currentUtterance.volume = 1;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const targetLang = LANG_MAP[dialect] || 'hi-IN';
  const matchedVoice = voices.find((v) => v.lang.startsWith(targetLang.split('-')[0]));
  if (matchedVoice) {
    currentUtterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(currentUtterance);
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

  recognition.lang = LANG_MAP[dialect] || 'hi-IN';
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
      } catch (e) {
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
