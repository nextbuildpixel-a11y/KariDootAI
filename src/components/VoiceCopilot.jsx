// KariDoot AI · Craft-Tech Studio — Dynamic Island Copilot ("AI Sahayak")
// Persistent floating pill with waveform, step progress, dialect switcher

import { useEffect, useState, useRef } from 'react';
import { Volume2, RotateCcw } from 'lucide-react';
import { speakInstruction, stopSpeaking } from '../services/voiceService';

const STEP_LABELS = {
  1: { en: 'Vision Studio', hi: 'विजन स्टूडियो' },
  2: { en: 'Acoustic Lab', hi: 'ध्वनि प्रयोगशाला' },
  3: { en: 'Spec HUD', hi: 'विशेषता HUD' },
  4: { en: 'Pricing Telemetry', hi: 'मूल्य टेलीमेट्री' },
  5: { en: 'Omnichannel Launchpad', hi: 'लॉन्चपैड' },
};

export default function VoiceCopilot({ step, dialect, enabled }) {
  const [speaking, setSpeaking] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef(null);

  const triggerSpeak = () => {
    if (!enabled) return;
    setSpeaking(true);
    setExpanded(true);
    speakInstruction(`step${step}`, dialect, enabled);

    clearTimeout(collapseTimer.current);
    collapseTimer.current = setTimeout(() => {
      setSpeaking(false);
      setExpanded(false);
    }, 5500);
  };

  useEffect(() => {
    triggerSpeak();
    return () => {
      clearTimeout(collapseTimer.current);
      stopSpeaking();
    };
  }, [step, dialect, enabled]);

  const stepLabel = STEP_LABELS[step] || STEP_LABELS[1];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 no-print">
      <div
        className={`relative flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-2.5 cursor-pointer
                   transition-all duration-500 ease-out overflow-hidden select-none`}
        style={{
          background: 'rgba(17, 24, 39, 0.92)',
          backdropFilter: 'blur(24px)',
          boxShadow: speaking
            ? '0 0 0 1px #10B98133, 0 0 24px #10B98122, 0 8px 32px rgba(0,0,0,0.6)'
            : '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5)',
          minWidth: expanded ? '280px' : '140px',
          maxWidth: '340px',
        }}
        onClick={() => { setExpanded((e) => !e); }}
      >
        {/* Emerald pulse dot */}
        <div className="relative flex-shrink-0">
          <div className={`w-2.5 h-2.5 rounded-full ${speaking ? 'bg-emerald-craft' : 'bg-white/20'} transition-colors duration-300`} />
          {speaking && (
            <div className="absolute inset-0 rounded-full bg-emerald-craft animate-pulse-ring" />
          )}
        </div>

        {/* Waveform (when speaking) */}
        {speaking ? (
          <div className="flex items-center gap-0.5 h-4 flex-shrink-0">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="wave-bar w-0.5"
                style={{
                  height: `${6 + Math.sin(i * 1.2) * 6}px`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex-shrink-0">
            AI Sahayak
          </span>
        )}

        {/* Step label (expanded) */}
        {expanded && (
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-white leading-none truncate">{stepLabel.en}</p>
            <p className="text-[10px] text-white/40 leading-none mt-0.5 truncate">{stepLabel.hi}</p>
          </div>
        )}

        {/* Step progress dots */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`rounded-full transition-all duration-300 ${
                s === step ? 'w-4 h-1.5 bg-saffron' : s < step ? 'w-1.5 h-1.5 bg-emerald-craft/60' : 'w-1.5 h-1.5 bg-white/15'
              }`}
            />
          ))}
        </div>

        {/* Replay button */}
        {enabled && (
          <button
            onClick={(e) => { e.stopPropagation(); triggerSpeak(); }}
            className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-saffron transition-colors"
          >
            <RotateCcw size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
