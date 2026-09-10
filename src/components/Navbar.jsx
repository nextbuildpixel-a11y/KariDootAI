// KariDoot AI · Craft-Tech Studio — Navbar
import { useState } from 'react';
import { Globe, Volume2, VolumeX, ChevronDown, Zap } from 'lucide-react';
import { DIALECTS } from '../data/mockArtisanData';

const STEPS = [
  { id: 1, label: 'Vision Studio', icon: '◎' },
  { id: 2, label: 'Acoustic Lab', icon: '◉' },
  { id: 3, label: 'Spec HUD', icon: '◈' },
  { id: 4, label: 'Telemetry', icon: '◆' },
  { id: 5, label: 'Launchpad', icon: '◀' },
];

export default function Navbar({ currentStep, maxStep = currentStep, onStepClick, dialect, onDialectChange, voiceEnabled, onVoiceToggle }) {
  const [showDialect, setShowDialect] = useState(false);
  const currentDialect = DIALECTS.find((d) => d.code === dialect) || DIALECTS[0];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5" style={{ background: 'rgba(11,15,23,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Brand Row */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 0 16px #F59E0B44' }}>
              <span className="text-obsidian font-bold text-base">K</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-white text-base leading-none">
                  KariDoot <span className="text-gradient-saffron">AI</span>
                </h1>
                <span className="hidden sm:block text-[10px] font-mono text-white/30 border border-white/10 rounded px-1.5 py-0.5">
                  CRAFT-TECH v2.0
                </span>
              </div>
              <p className="text-white/35 text-[10px] leading-tight hidden sm:block mt-0.5">
                कारीगर की आवाज़ · Digital Market Intelligence
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Dialect */}
            <div className="relative">
              <button
                onClick={() => setShowDialect(!showDialect)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/10 text-white/70 text-xs font-medium
                           hover:border-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <Globe size={12} className="text-saffron" />
                <span className="hidden sm:block">{currentDialect.label}</span>
                <ChevronDown size={10} className="opacity-50" />
              </button>
              {showDialect && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDialect(false)} />
                  <div className="absolute right-0 top-10 z-50 rounded-xl border border-white/10 overflow-hidden min-w-[150px]"
                    style={{ background: '#111827', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
                    {DIALECTS.map((d) => (
                      <button
                        key={d.code}
                        onClick={() => { onDialectChange(d.code); setShowDialect(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors
                          ${dialect === d.code ? 'text-saffron bg-saffron/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                      >
                        <span>{d.label}</span>
                        <span className="opacity-40 text-[10px]">{d.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Voice Toggle */}
            <button
              onClick={onVoiceToggle}
              title={voiceEnabled ? 'AI Sahayak: ON' : 'AI Sahayak: OFF'}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200
                ${voiceEnabled
                  ? 'border-emerald-craft/40 text-emerald-craft bg-emerald-craft/10'
                  : 'border-white/10 text-white/30 bg-white/4'
                }`}
            >
              {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
          </div>
        </div>

        {/* Step Tracker */}
        <div className="pb-3 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {STEPS.map((step, idx) => {
              const isActive   = step.id === currentStep;
              const isVisited  = !isActive && step.id <= maxStep;
              const state      = isActive ? 'active' : isVisited ? 'done' : 'idle';
              return (
                <div key={step.id} className="flex items-center gap-1">
                  <button
                    onClick={() => isVisited && onStepClick?.(step.id)}
                    disabled={step.id > maxStep}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold
                               transition-all duration-200 select-none
                               ${state === 'done'
                                 ? 'bg-emerald-craft/10 border border-emerald-craft/30 text-emerald-craft cursor-pointer hover:bg-emerald-craft/20'
                                 : state === 'active'
                                 ? 'border text-obsidian cursor-default'
                                 : 'border border-white/8 text-white/20 cursor-not-allowed'
                               }`}
                    style={state === 'active' ? {
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      borderColor: 'transparent',
                      boxShadow: '0 0 12px #F59E0B44',
                    } : {}}
                  >
                    <span className="opacity-60">{state === 'done' ? '✓' : step.icon}</span>
                    <span className="hidden sm:block">{step.label}</span>
                    <span className="sm:hidden">{step.id}</span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className={`w-3 h-px rounded-full transition-colors duration-300 mx-0.5
                      ${step.id <= maxStep - 1 ? 'bg-emerald-craft/40' : 'bg-white/8'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
