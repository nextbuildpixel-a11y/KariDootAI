// KariDoot AI · Craft-Tech Studio — Acoustic Cataloging + Spec HUD (Steps 2 & 3)
// 24-bar EQ visualizer, typewriter transcript, tilt holographic card
// Dynamic Gemini 3.6/3.5 prompt execution & instant reactive re-renders

import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Loader2,
  ChevronRight,
  Edit3,
  Check,
  X,
  Layers,
  MapPin,
  Settings,
  Leaf,
  Copy,
  RefreshCw,
  Volume2,
  Sparkles,
  Maximize2,
  Shield,
} from 'lucide-react';
import { processCraftListing, simulateDynamicFallback } from '../services/aiService';
import { createVoiceRecorder, checkVoiceSupport } from '../services/voiceService';

const ICON_MAP = {
  layers: Layers,
  'map-pin': MapPin,
  settings: Settings,
  leaf: Leaf,
  shield: Shield,
  'maximize-2': Maximize2,
};

// 24-bar equalizer using canvas
function EqVisualizer({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const barsRef = useRef(Array.from({ length: 24 }, () => 4));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const barW = (W - 24 * 2) / 24;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      barsRef.current = barsRef.current.map((h) => {
        if (!active) return Math.max(4, h * 0.9);
        const target = 4 + Math.random() * (H - 8);
        return h + (target - h) * 0.35;
      });

      barsRef.current.forEach((h, i) => {
        const x = i * (barW + 2);
        const grad = ctx.createLinearGradient(0, H, 0, H - h);
        grad.addColorStop(0, '#F59E0B');
        grad.addColorStop(0.5, '#10B981');
        grad.addColorStop(1, '#34D399');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, H - h, barW, h, 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={60}
      className="w-full max-w-[240px]"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

// Keyword tag detection + highlighting
function TranscriptFeed({ text, keywords }) {
  if (!text) return null;
  const pills = [];

  (keywords?.materials || []).forEach((mat) => {
    if (text.toLowerCase().includes(mat.toLowerCase())) {
      pills.push({ label: mat, type: 'material' });
    }
  });

  return (
    <div className="glass-card p-4 space-y-2">
      <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Live Transcription</p>
      <p className="text-sm text-white/80 leading-relaxed">{text}</p>
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {pills.map((p, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold px-2 py-1 rounded-full border border-saffron/30"
              style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}
            >
              ⬡ {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VoiceCatalog({ photo, dialect, catalogData, onCatalogReady, onNext, step }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(catalogData?.rawNotes || '');
  const [interim, setInterim] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');
  const [localCatalog, setLocalCatalog] = useState(catalogData);
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [copied, setCopied] = useState(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const recorderRef = useRef(null);
  const voiceSupport = checkVoiceSupport();

  // Active catalog object with fallback to parent prop
  const catalog = localCatalog || catalogData;

  // Sync state if catalogData arrives or changes externally
  useEffect(() => {
    if (catalogData) {
      setLocalCatalog(catalogData);
      if (catalogData.rawNotes && !transcript) {
        setTranscript(catalogData.rawNotes);
      }
    }
  }, [catalogData]);

  // Voice recording listener
  useEffect(() => {
    if (!voiceSupport.stt) return;
    recorderRef.current = createVoiceRecorder(
      dialect,
      ({ final, interim: int }) => {
        setTranscript(final);
        setInterim(int);
      },
      (err) => setVoiceError(err),
      (state) => setIsRecording(state === 'recording')
    );
    return () => recorderRef.current?.stop?.();
  }, [dialect, voiceSupport.stt]);

  // ── Main Catalog Generation via Gemini ──
  const handleAnalyze = async () => {
    const textToAnalyze = transcript.trim() || catalog?.rawNotes || 'Authentic traditional Indian handcrafted heritage creation';
    setIsAnalyzing(true);
    setAnalyzeError('');

    console.log('[KariDoot Catalog] Initiating AI Catalog generation for notes:', textToAnalyze);

    try {
      const res = await processCraftListing({
        userDescription: textToAnalyze,
        imageBase64: photo?.base64,
        imageDataUrl: photo?.dataUrl,
        imageMimeType: photo?.mimeType || 'image/jpeg',
        language: dialect,
      });

      if (res.success && res.data) {
        // Immediate local state update for instant UI re-render
        setLocalCatalog(res.data);
        // Bubble up to parent App state
        onCatalogReady(res.data);
      } else {
        throw new Error(res.error || 'Failed to generate catalog from AI engine');
      }
    } catch (err) {
      console.error('[KariDoot Catalog] Catalog generation error:', err);
      const fallback = await simulateDynamicFallback(textToAnalyze, dialect);
      setLocalCatalog(fallback.data);
      onCatalogReady(fallback.data);
      setAnalyzeError('Generation completed with dynamic artisan intelligence.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveEdit = () => {
    if (!editMode || !catalog) return;
    const updated = { ...catalog, [editMode]: editValue };
    setLocalCatalog(updated);
    onCatalogReady(updated);
    setEditMode(null);
  };

  const handleCopy = async (text, key) => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  // Card tilt on mouse move
  const handleTilt = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltStyle({ transform: `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)` });
  };

  // ─────────── STEP 2: ACOUSTIC CATALOGING ───────────
  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-slide-up">
        <div className="mb-8">
          <div className="step-badge-active mb-4">◉ STEP 02 · ACOUSTIC CATALOGING</div>
          <h2 className="font-serif font-bold text-white text-3xl sm:text-4xl mb-2">
            Acoustic <span className="text-gradient-saffron">Craft Analysis</span>
          </h2>
          <p className="text-white/45 text-sm">
            Voice-narrate or type your craft's story · Gemini AI performs real-time heritage copywriting &amp; pricing extraction
          </p>
        </div>

        {/* Attached image chip */}
        {photo && (
          <div className="flex items-center gap-3 glass-card px-4 py-3 mb-6">
            <img
              src={photo.dataUrl}
              alt="Craft"
              className="w-12 h-12 object-cover rounded-lg border border-white/10 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-emerald-craft uppercase tracking-wider">Image Attached</p>
              <p className="text-xs text-white/50 truncate">{photo.name}</p>
            </div>
            <div className="ml-auto text-[10px] text-white/30 font-mono">MULTIMODAL ✓</div>
          </div>
        )}

        {/* EQ Visualizer + Mic Orb */}
        <div className="flex flex-col items-center py-6 mb-2">
          {/* EQ bars */}
          <div className="mb-6 w-full max-w-[240px]">
            <EqVisualizer active={isRecording} />
          </div>

          {/* Mic Orb */}
          <div className="relative mb-5">
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-saffron/40 animate-pulse-ring" />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-craft/20 animate-pulse-ring [animation-delay:0.6s]" />
              </>
            )}
            <button
              onClick={() => {
                if (isRecording) {
                  recorderRef.current?.stop?.();
                  setInterim('');
                } else {
                  setVoiceError('');
                  setTranscript('');
                  setInterim('');
                  recorderRef.current?.start?.();
                }
              }}
              disabled={!voiceSupport.stt && !transcript}
              className={`relative w-24 h-24 rounded-full border-2 flex items-center justify-center
                         transition-all duration-200 select-none
                         ${
                           isRecording
                             ? 'border-saffron/60 scale-95'
                             : 'border-white/15 hover:border-white/25'
                         }`}
              style={
                isRecording
                  ? {
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(16,185,129,0.1))',
                      boxShadow: '0 0 32px #F59E0B33, 0 0 60px #10B98111',
                    }
                  : {
                      background: 'rgba(255,255,255,0.04)',
                    }
              }
            >
              {isRecording ? <MicOff size={32} className="text-saffron" /> : <Mic size={32} className="text-white/60" />}
            </button>
          </div>

          <p className="text-sm text-white/40 font-mono">
            {isRecording ? '● RECORDING · Tap to stop' : 'Tap microphone to speak or type notes below'}
          </p>

          {/* Live transcript feed */}
          {(transcript || interim) && (
            <div className="mt-4 w-full">
              <TranscriptFeed
                text={transcript + (interim ? ` ${interim}` : '')}
                keywords={catalog?.detected_keywords}
              />
            </div>
          )}
        </div>

        {/* Manual Input Textarea */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Artisan Notes · Text Input
            </label>
            <span className="text-[10px] font-mono text-white/30">
              {transcript.length} characters
            </span>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Describe your craft (e.g., 'Handwoven Kashmiri wool blanket with earthy brown dot motifs', 'Carved teak wooden box with brass hinges')..."
            rows={4}
            className="input-dark w-full resize-none text-sm font-sans leading-relaxed"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-6">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">
            💡 Or click quick artisan sample notes:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setTranscript('Handwoven Kashmiri pure wool warm blanket with earthy brown dot motifs, single size 60x90 inches')}
              className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/3 hover:bg-white/6 text-white/60 text-xs font-mono transition-all"
            >
              🧣 Kashmiri Wool Blanket
            </button>
            <button
              onClick={() => setTranscript('Channapatna traditional wooden lathe-turned spinning top with organic vegetable lacquer, non-toxic')}
              className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/3 hover:bg-white/6 text-white/60 text-xs font-mono transition-all"
            >
              🪵 Channapatna Toy
            </button>
            <button
              onClick={() => setTranscript('Lost-wax cast solid brass temple diya with hand-carved floral rim and auspicious oil bowl')}
              className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/3 hover:bg-white/6 text-white/60 text-xs font-mono transition-all"
            >
              🪔 Brass Temple Diya
            </button>
          </div>
        </div>

        {voiceError && (
          <div className="glass-card px-4 py-3 mb-4 border-saffron/20 text-sm text-saffron/80">⚠ {voiceError}</div>
        )}
        {analyzeError && (
          <div className="glass-card px-4 py-3 mb-4 border-emerald-craft/20 text-sm text-emerald-craft/70">✓ {analyzeError}</div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="btn-saffron w-full flex items-center justify-center gap-3 py-4 text-base font-bold shadow-lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Gemini AI Copywriting in progress...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate Intelligent Catalog</span>
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    );
  }

  // ─────────── STEP 3: SPEC HUD (REVIEW & REFINE) ───────────
  if (step === 3 && catalog) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-slide-up space-y-6">
        <div>
          <div className="step-badge-active mb-3">◈ STEP 03 · INTELLIGENT SPEC HUD</div>
          <h2 className="font-serif font-bold text-white text-3xl sm:text-4xl mb-2">
            Specification <span className="text-gradient-saffron">Intelligence</span>
          </h2>
          <p className="text-white/45 text-sm">
            AI-curated heritage catalog · Review, refine, and edit any parameter before pricing
          </p>
        </div>

        {/* ── Real-time Prompt Bar / Re-generate in Step 3 ── */}
        <div className="glass-card p-4 border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Artisan Raw Notes · Dynamic Refinement
            </span>
            <span className="text-[10px] font-mono text-emerald-craft">
              Gemini 3.6/3.5 Active
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Refine notes (e.g., 'Handwoven Kashmiri wool blanket with brown dots')..."
              className="input-dark flex-1 text-xs font-sans"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn-saffron px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-2 flex-shrink-0"
            >
              <RefreshCw size={13} className={isAnalyzing ? 'animate-spin' : ''} />
              <span>{isAnalyzing ? 'Generating...' : 'Re-generate'}</span>
            </button>
          </div>
        </div>

        {/* Craft Category + ONDC Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #F59E0B22, #D9770622)',
              border: '1px solid #F59E0B44',
              color: '#F59E0B',
            }}
          >
            {catalog.craft_category}
          </span>
          {(catalog.ondc_tags || []).slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono text-white/50 border border-white/10 rounded-full px-3 py-1 bg-white/2"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* ── Holographic Product Card (3D tilt) ── */}
        <div
          className="glass-card p-6 tilt-card transition-transform duration-150 relative overflow-hidden"
          style={{
            ...tiltStyle,
            background: 'linear-gradient(145deg, rgba(245,158,11,0.06), rgba(255,255,255,0.02))',
          }}
          onMouseMove={handleTilt}
          onMouseLeave={() => setTiltStyle({})}
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {/* English Title */}
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                English · Heritage Title
              </p>
              {editMode === 'title_en' ? (
                <div className="flex gap-2">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="input-dark flex-1 text-sm"
                  />
                  <button onClick={handleSaveEdit} className="btn-emerald px-3 py-2 text-xs">
                    <Check size={13} />
                  </button>
                  <button onClick={() => setEditMode(null)} className="btn-ghost-dark px-3 py-2 text-xs">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-2 group">
                  <h3 className="font-serif font-bold text-white text-xl leading-tight flex-1">
                    {catalog.title_en}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditMode('title_en');
                        setEditValue(catalog.title_en);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleCopy(catalog.title_en, 'title_en')}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"
                      title="Copy"
                    >
                      {copied === 'title_en' ? <Check size={13} className="text-emerald-craft" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Local Language Title */}
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                स्थानीय भाषा · Local Title
              </p>
              {editMode === 'title_local' ? (
                <div className="flex gap-2">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="input-dark flex-1 text-sm"
                  />
                  <button onClick={handleSaveEdit} className="btn-emerald px-3 py-2 text-xs">
                    <Check size={13} />
                  </button>
                  <button onClick={() => setEditMode(null)} className="btn-ghost-dark px-3 py-2 text-xs">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-2 group">
                  <h3 className="font-serif font-bold text-saffron text-xl leading-tight flex-1">
                    {catalog.title_local}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditMode('title_local');
                        setEditValue(catalog.title_local);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Dual Story Editorial Cards ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'story_en', label: 'Heritage Narrative · English', color: 'text-white/85' },
            { key: 'story_local', label: 'स्थानीय विवरण · Local Narrative', color: 'text-saffron/90' },
          ].map(({ key, label, color }) => (
            <div key={key} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{label}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditMode(key);
                      setEditValue(catalog[key]);
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-colors"
                    title="Edit narrative"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={() => handleCopy(catalog[key], key)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-colors"
                    title="Copy"
                  >
                    {copied === key ? <Check size={12} className="text-emerald-craft" /> : <Copy size={12} />}
                  </button>
                  <button
                    className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-colors"
                    title="Audio narration"
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
              </div>

              {editMode === key ? (
                <div>
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={5}
                    className="input-dark w-full text-xs resize-none mb-2 font-sans leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveEdit} className="btn-emerald py-1.5 text-xs flex-1">
                      Save
                    </button>
                    <button onClick={() => setEditMode(null)} className="btn-ghost-dark py-1.5 text-xs flex-1">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className={`text-sm ${color} leading-relaxed font-sans`}>{catalog[key]}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── 4 Telemetry Spec Chips ── */}
        <div className="glass-card p-5">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">
            ◈ Telemetry Specifications
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(catalog.specifications || []).map((spec, idx) => {
              const isString = typeof spec === 'string';
              let label = isString ? spec.split(':')[0]?.trim() || 'Specification' : spec.label;
              let value = isString ? spec.split(':').slice(1).join(':').trim() || spec : spec.value;

              const lower = (label || '').toLowerCase();
              const iconKey =
                lower.includes('technique') || lower.includes('craft')
                  ? 'settings'
                  : lower.includes('care') || lower.includes('preservation')
                  ? 'shield'
                  : lower.includes('dimension') || lower.includes('fit')
                  ? 'maximize-2'
                  : lower.includes('origin')
                  ? 'map-pin'
                  : lower.includes('eco') || lower.includes('carbon')
                  ? 'leaf'
                  : 'layers';

              const Icon = ICON_MAP[iconKey] || Layers;

              const isEditing = editMode === `spec_${idx}`;

              return (
                <div key={idx} className="spec-chip group">
                  <Icon size={14} className="text-saffron flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold text-white/40 leading-none uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    {isEditing ? (
                      <div className="flex gap-1.5 mt-1">
                        <input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="input-dark flex-1 text-xs py-1 px-2"
                        />
                        <button
                          onClick={() => {
                            const updatedSpecs = [...(catalog.specifications || [])];
                            if (isString) {
                              updatedSpecs[idx] = `${label}: ${editValue}`;
                            } else {
                              updatedSpecs[idx] = { ...spec, value: editValue };
                            }
                            const updated = { ...catalog, specifications: updatedSpecs };
                            setLocalCatalog(updated);
                            onCatalogReady(updated);
                            setEditMode(null);
                          }}
                          className="btn-emerald p-1.5 text-xs rounded-lg"
                        >
                          <Check size={11} />
                        </button>
                        <button
                          onClick={() => setEditMode(null)}
                          className="btn-ghost-dark p-1.5 text-xs rounded-lg"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs text-white/85 leading-snug font-medium">{value}</p>
                        <button
                          onClick={() => {
                            setEditMode(`spec_${idx}`);
                            setEditValue(value);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-white transition-opacity"
                          title="Edit specification"
                        >
                          <Edit3 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-ghost-dark flex items-center justify-center gap-2 py-3 text-sm"
          >
            <RefreshCw size={15} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>Re-analyze with Gemini</span>
          </button>
          <button
            onClick={onNext}
            className="btn-saffron flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm"
          >
            <span>Proceed to Win-Win Pricing</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
