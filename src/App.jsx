// KariDoot AI · Craft-Tech Studio — Main App Orchestrator
// Navigation v2: full two-way flow, persistent state, unlocked step pills

import { useState } from 'react';
import Navbar from './components/Navbar';
import VoiceCopilot from './components/VoiceCopilot';
import PhotoStudio from './components/PhotoStudio';
import VoiceCatalog from './components/VoiceCatalog';
import WinWinPricing from './components/WinWinPricing';
import OmnichannelHub from './components/OmnichannelHub';

export default function App() {
  const [step, setStep] = useState(1);
  // ── Persistent state — NEVER wiped on back-navigation ──
  const [photo, setPhoto] = useState(null);
  const [catalogData, setCatalogData] = useState(null);
  const [pricingData, setPricingData] = useState(null);
  const [dialect, setDialect] = useState('hi');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Track highest step reached — used to unlock forward navigation
  const [maxStep, setMaxStep] = useState(1);

  const goTo = (s) => {
    // Allow navigation to any step ≤ maxStep (already visited)
    if (s >= 1 && s <= 5 && s <= maxStep) setStep(s);
  };

  const nextStep = () => {
    const next = Math.min(5, step + 1);
    setStep(next);
    setMaxStep((m) => Math.max(m, next));
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  // Step 1 → 2: state is stored; advance on user confirmation or continue button
  const handlePhotoCapture = (data, autoAdvance = false) => {
    setPhoto(data);
    if (data && autoAdvance && step === 1) {
      const next = 2;
      setStep(next);
      setMaxStep((m) => Math.max(m, next));
    }
  };

  // Step 2 → 3: auto-advance on first catalog generation
  const handleCatalogReady = (data) => {
    setCatalogData(data);
    if (step === 2) {
      const next = 3;
      setStep(next);
      setMaxStep((m) => Math.max(m, next));
    }
  };

  // Catalog edits from Step 3 (no step change)
  const handleCatalogUpdate = (data) => setCatalogData(data);

  // Step 3 → 4
  const handleCatalogNext = () => { setStep(4); setMaxStep((m) => Math.max(m, 4)); };

  // Step 4 → 5
  const handlePricingNext = () => { setStep(5); setMaxStep((m) => Math.max(m, 5)); };

  // "Next →" is enabled if: current step < maxStep (already completed) OR step-specific condition met
  const nextEnabled =
    step === 1 ? (!!photo || maxStep > 1) :
    step === 2 ? maxStep > 2 :
    step === 3 ? maxStep > 3 :
    step === 4 ? maxStep > 4 :
    false;

  return (
    <div className="min-h-dvh relative overflow-x-hidden">
      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #1E293B 0%, #0B0F17 65%)' }} />
      {/* Grain */}
      <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }} />
      {/* Glow orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #F59E0B08 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 left-1/4 w-[400px] h-[200px] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #10B98106 0%, transparent 70%)' }} />

      {/* ── Navbar — passes maxStep so pills unlock correctly ── */}
      <Navbar
        currentStep={step}
        maxStep={maxStep}
        onStepClick={goTo}
        dialect={dialect}
        onDialectChange={setDialect}
        voiceEnabled={voiceEnabled}
        onVoiceToggle={() => setVoiceEnabled((v) => !v)}
      />

      {/* ── Dynamic Island Copilot ── */}
      <VoiceCopilot step={step} dialect={dialect} enabled={voiceEnabled} />

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 py-8 pb-28">

        {step === 1 && (
          <PhotoStudio
            onPhotoCapture={handlePhotoCapture}
            capturedPhoto={photo}
            onNext={nextStep}
          />
        )}

        {step === 2 && (
          <VoiceCatalog
            step={2}
            photo={photo}
            dialect={dialect}
            catalogData={catalogData}
            onCatalogReady={handleCatalogReady}
            onNext={nextStep}
          />
        )}

        {step === 3 && (
          <VoiceCatalog
            step={3}
            photo={photo}
            dialect={dialect}
            catalogData={catalogData}
            onCatalogReady={handleCatalogUpdate}
            onNext={handleCatalogNext}
          />
        )}

        {step === 4 && (
          <WinWinPricing
            catalogData={catalogData}
            pricingData={pricingData}
            onPricingReady={setPricingData}
            onNext={handlePricingNext}
          />
        )}

        {step === 5 && (
          <OmnichannelHub
            catalogData={catalogData}
            pricingData={pricingData}
            photo={photo}
          />
        )}
      </main>

      {/* ── Bottom Navigation Bar (shown on all steps) ── */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-white/5 no-print z-40"
        style={{ background: 'rgba(11,15,23,0.92)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* ← Back */}
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`btn-ghost-dark flex items-center gap-2 py-2 text-sm transition-opacity duration-200 ${step === 1 ? 'opacity-30 pointer-events-none' : ''}`}
          >
            ← Back
          </button>

          {/* Progress dots — clickable */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => goTo(s)}
                disabled={s > maxStep}
                className={`rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 h-2 bg-saffron cursor-default'
                    : s <= maxStep
                    ? 'w-2 h-2 bg-emerald-craft/60 hover:bg-emerald-craft cursor-pointer'
                    : 'w-2 h-2 bg-white/10 cursor-not-allowed'
                }`}
                title={s <= maxStep ? `Go to Step ${s}` : 'Complete previous steps first'}
              />
            ))}
          </div>

          {/* Next → / New Catalog */}
          {step < 5 ? (
            <button
              onClick={nextStep}
              disabled={!nextEnabled}
              className={`btn-saffron flex items-center gap-2 py-2 text-sm font-bold transition-opacity duration-200 ${!nextEnabled ? 'opacity-40 pointer-events-none' : ''}`}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => {
                setStep(1);
                setMaxStep(1);
                setPhoto(null);
                setCatalogData(null);
                setPricingData(null);
              }}
              className="btn-ghost-dark flex items-center gap-2 py-2 text-sm"
            >
              ↺ New Catalog
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
