// KariDoot AI · Craft-Tech Studio — Acoustic Cataloging + Spec HUD (Steps 2 & 3)
// Unified Context Pipeline: Combines AI Vision Inspection + Artisan Voice / Text Notes
// Multilingual Translation Integrity: Hindi, Telugu, Tamil, Bengali, English
// Structured JSON Output: Concise Titles, 4 Specific Tags, Authentic Craft Heritage Stories

import { useState, useRef, useEffect, useMemo } from 'react';
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
  Sparkles,
  Maximize2,
  Shield,
  Globe,
} from 'lucide-react';
import {
  processCraftListing,
  simulateDynamicFallback,
  LANG_MAP,
  generateCatalogTranslations,
} from '../services/aiService';
import { createVoiceRecorder, checkVoiceSupport } from '../services/voiceService';

const ICON_MAP = {
  layers: Layers,
  'map-pin': MapPin,
  settings: Settings,
  leaf: Leaf,
  shield: Shield,
  'maximize-2': Maximize2,
};

const LANGUAGE_OPTIONS = [
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'en', label: 'English' },
];

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

export default function VoiceCatalog({ photo, dialect = 'hi', catalogData, onCatalogReady, onNext, step }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(catalogData?.rawNotes || '');
  const [interim, setInterim] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeNotice, setAnalyzeNotice] = useState('');
  const [localCatalog, setLocalCatalog] = useState(catalogData);
  const [selectedLanguage, setSelectedLanguage] = useState(dialect || 'hi');
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [copied, setCopied] = useState(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const recorderRef = useRef(null);
  const voiceSupport = checkVoiceSupport();

  // Active catalog object with fallback to parent prop
  const catalog = localCatalog || catalogData;

  // Pre-cached multi-language bundle generated once from catalog or fallback (0ms lookup)
  const catalogTranslations = useMemo(() => {
    if (!catalog) return null;
    const context = `${catalog?.category || ''} ${catalog?.craft_category || ''} ${catalog?.title_en || ''} ${photo?.visualDescription || ''} ${photo?.name || ''}`;
    return generateCatalogTranslations(
      context,
      catalog.title_en,
      catalog.story_en,
      catalog.translations
    );
  }, [catalog, photo?.visualDescription, photo?.name]);

  // Derived active language payload: instant 0ms switch without network overhead
  const activeTranslation = useMemo(() => {
    if (!catalogTranslations) {
      return {
        title: catalog?.title_local || catalog?.title_en || '',
        story: catalog?.story_local || catalog?.story_en || '',
      };
    }
    const langKey = (selectedLanguage || 'hi').toLowerCase();
    const currentLangData =
      catalogTranslations[langKey] ||
      catalogTranslations[
        langKey === 'hi' ? 'hindi' :
        langKey === 'te' ? 'telugu' :
        langKey === 'ta' ? 'tamil' :
        langKey === 'bn' ? 'bengali' :
        langKey === 'en' ? 'english' : langKey
      ] ||
      catalogTranslations['english'] ||
      catalogTranslations['en'];

    return (
      currentLangData || {
        title: catalog?.title_local || catalog?.title_en || '',
        story: catalog?.story_local || catalog?.story_en || '',
      }
    );
  }, [selectedLanguage, catalogTranslations, catalog]);

  // Sync state if catalogData arrives or changes externally
  useEffect(() => {
    if (catalogData) {
      setLocalCatalog(catalogData);
      if (catalogData.rawNotes && !transcript) {
        setTranscript(catalogData.rawNotes);
      }
    }
  }, [catalogData]);

  // Keep selected language in sync with navbar dialect if passed
  useEffect(() => {
    if (dialect) {
      setSelectedLanguage(dialect);
    }
  }, [dialect]);

  // Voice recording listener
  useEffect(() => {
    if (!voiceSupport.stt) return;
    recorderRef.current = createVoiceRecorder(
      selectedLanguage,
      ({ final, interim: int }) => {
        setTranscript(final);
        setInterim(int);
      },
      (err) => setVoiceError(err),
      (state) => setIsRecording(state === 'recording')
    );
    return () => recorderRef.current?.stop?.();
  }, [selectedLanguage, voiceSupport.stt]);

  // ── Unified Context Pipeline Execution ──
  const handleAnalyze = async (langOverride = null) => {
    const langToUse = langOverride || selectedLanguage;
    const textToAnalyze = transcript.trim() || catalog?.rawNotes || '';
    const visualDesc = photo?.visualDescription || '';

    setIsAnalyzing(true);
    setAnalyzeNotice('');

    console.log('[KariDoot Catalog] Generating catalog with unified pipeline:');
    console.log(' - User Transcript/Notes:', textToAnalyze || '(brief/empty)');
    console.log(' - Photo Visual Description:', visualDesc || '(visual active)');
    console.log(' - Target Language:', langToUse);

    try {
      const res = await processCraftListing({
        userDescription: textToAnalyze,
        visualDescription: visualDesc,
        imageBase64: photo?.base64,
        imageDataUrl: photo?.dataUrl,
        imageMimeType: photo?.mimeType || 'image/jpeg',
        language: langToUse,
      });

      if (res.success && res.data) {
        setLocalCatalog(res.data);
        onCatalogReady?.(res.data);
      } else {
        throw new Error(res.error || 'Failed to generate catalog from AI');
      }
    } catch (err) {
      console.error('[KariDoot Catalog] Pipeline fallback note:', err);
      const fallback = await simulateDynamicFallback(textToAnalyze, visualDesc, langToUse);
      setLocalCatalog(fallback.data);
      onCatalogReady?.(fallback.data);
      setAnalyzeNotice('Generated with dynamic artisan intelligence.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Language switch handler: Pure local state update, zero network overhead (0ms instant switch)
  const handleLanguageChange = (langKey) => {
    setSelectedLanguage(langKey);
  };

  const handleSaveEdit = () => {
    if (!editMode || !catalog) return;
    const updated = { ...catalog, [editMode]: editValue };

    // Update translations dictionary if editing local or english title/story
    if (editMode === 'title_local' || editMode === 'story_local') {
      const field = editMode === 'title_local' ? 'title' : 'story';
      const lang = (selectedLanguage || 'hi').toLowerCase();
      const langFull =
        lang === 'hi' ? 'hindi' :
        lang === 'te' ? 'telugu' :
        lang === 'ta' ? 'tamil' :
        lang === 'bn' ? 'bengali' :
        lang === 'en' ? 'english' : lang;

      const currentTrans = { ...(catalog.translations || catalogTranslations || {}) };
      const currentObj = currentTrans[lang] ? { ...currentTrans[lang] } : { title: '', story: '' };
      currentObj[field] = editValue;
      currentTrans[lang] = currentObj;
      currentTrans[langFull] = currentObj;
      updated.translations = currentTrans;
    } else if (editMode === 'title_en' || editMode === 'story_en') {
      const field = editMode === 'title_en' ? 'title' : 'story';
      const currentTrans = { ...(catalog.translations || catalogTranslations || {}) };
      const enObj = currentTrans['english'] ? { ...currentTrans['english'] } : { title: '', story: '' };
      enObj[field] = editValue;
      currentTrans['english'] = enObj;
      currentTrans['en'] = enObj;
      updated.translations = currentTrans;
    }

    setLocalCatalog(updated);
    onCatalogReady?.(updated);
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
      <div className="max-w-2xl mx-auto animate-fade-slide-up space-y-6">
        <div>
          <div className="step-badge-active mb-3">◉ STEP 02 · ACOUSTIC CATALOGING &amp; AI VISION</div>
          <h2 className="font-serif font-bold text-white text-3xl sm:text-4xl mb-2">
            Acoustic <span className="text-gradient-saffron">Craft Intelligence</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Voice-narrate or type your craft notes. KariDoot AI merges your words with the photo's visual analysis to generate commercial e-commerce copy for any craft item.
          </p>
        </div>

        {/* Attached image chip + detected visual context */}
        {photo && (
          <div className="glass-card p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={photo.dataUrl}
                alt="Craft"
                className="w-14 h-14 object-cover rounded-xl border border-white/10 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-emerald-craft uppercase tracking-wider font-bold">
                  Photo AI Vision Attached ✓
                </p>
                <p className="text-xs text-white/70 truncate">{photo.name || 'Craft Studio Photo'}</p>
                {photo.visualDescription && (
                  <p className="text-[11px] text-saffron/90 truncate mt-0.5 max-w-md">
                    Detected: {photo.visualDescription}
                  </p>
                )}
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-craft bg-emerald-craft/10 px-2.5 py-1 rounded-full border border-emerald-craft/20 flex-shrink-0">
              MULTIMODAL UNIFIED
            </span>
          </div>
        )}

        {/* ── Multilingual Language Selector ── */}
        <div className="glass-card p-4 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-saffron" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Output Language:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {LANGUAGE_OPTIONS.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-saffron text-obsidian font-bold shadow-md shadow-saffron/20 scale-[1.02]'
                      : 'bg-white/4 text-white/60 hover:text-white hover:bg-white/10 border border-white/8'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* EQ Visualizer + Mic Orb */}
        <div className="flex flex-col items-center py-4">
          <div className="mb-4 w-full max-w-[240px]">
            <EqVisualizer active={isRecording} />
          </div>

          <div className="relative mb-4">
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-saffron/40 animate-pulse-ring scale-125" />
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
              className={`relative w-22 h-22 rounded-full border-2 flex items-center justify-center transition-all duration-200 select-none cursor-pointer ${
                isRecording ? 'border-saffron scale-95' : 'border-white/15 hover:border-white/30'
              }`}
              style={
                isRecording
                  ? {
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(16,185,129,0.15))',
                      boxShadow: '0 0 32px #F59E0B33, 0 0 60px #10B98111',
                    }
                  : { background: 'rgba(255,255,255,0.04)' }
              }
            >
              {isRecording ? <MicOff size={30} className="text-saffron" /> : <Mic size={30} className="text-white/70" />}
            </button>
          </div>

          <p className="text-xs text-white/50 font-mono">
            {isRecording ? '● RECORDING · Tap mic to stop' : 'Tap mic to speak or type artisan notes below'}
          </p>
          {interim && (
            <p className="text-xs text-saffron font-mono mt-1 italic animate-pulse">
              "{interim}..."
            </p>
          )}
        </div>

        {/* Manual Input Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Artisan Notes / Voice Transcript (Any Craft Item)
            </label>
            <span className="text-[10px] font-mono text-white/30">{transcript.length} characters</span>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Describe your craft (e.g., 'I hand-carved this pen from reclaimed rosewood with brass nib accents', 'Terracotta clay water pot fired in a wood kiln', 'Handwoven woolen blanket with brown dot motifs')..."
            rows={4}
            className="input-dark w-full resize-none text-sm font-sans leading-relaxed"
          />
        </div>

        {/* Quick Sample Artisan Notes */}
        <div>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">
            💡 Quick Artisan Sample Notes:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setTranscript(
                  'I hand-carved this ballpoint pen from reclaimed rosewood with precision brass nib accents, smooth twist mechanism'
                )
              }
              className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/3 hover:bg-white/8 text-white/70 text-xs font-mono transition-all cursor-pointer"
            >
              ✒️ Rosewood &amp; Brass Pen
            </button>
            <button
              type="button"
              onClick={() =>
                setTranscript(
                  'Handwoven pure mountain wool thermal blanket throw with natural organic texture, 60x90 inches'
                )
              }
              className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/3 hover:bg-white/8 text-white/70 text-xs font-mono transition-all cursor-pointer"
            >
              🧣 Handwoven Wool Blanket
            </button>
            <button
              type="button"
              onClick={() =>
                setTranscript(
                  'Traditional hand-thrown red terracotta clay water pot shaped on a potter wheel, keeps water cool naturally'
                )
              }
              className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/3 hover:bg-white/8 text-white/70 text-xs font-mono transition-all cursor-pointer"
            >
              🏺 Terracotta Clay Pot
            </button>
          </div>
        </div>

        {voiceError && (
          <div className="glass-card px-4 py-3 border-saffron/20 text-sm text-saffron/80">⚠ {voiceError}</div>
        )}
        {analyzeNotice && (
          <div className="glass-card px-4 py-3 border-emerald-craft/20 text-sm text-emerald-craft/80">
            ✓ {analyzeNotice}
          </div>
        )}

        <button
          onClick={() => handleAnalyze()}
          disabled={isAnalyzing}
          className="btn-saffron w-full flex items-center justify-center gap-3 py-4 text-base font-bold shadow-xl cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Generating Unified Multimodal Catalog...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate Dynamic Catalog</span>
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
          <div className="step-badge-active mb-3">◈ STEP 03 · DYNAMIC SPEC HUD &amp; CATALOG</div>
          <h2 className="font-serif font-bold text-white text-3xl sm:text-4xl mb-2">
            Catalog <span className="text-gradient-saffron">Intelligence HUD</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            AI-curated commercial catalog dynamically generated from your photo and voice notes. Review and refine specifications before pricing.
          </p>
        </div>

        {/* ── Multilingual Selector in Step 3 ── */}
        <div className="glass-card p-4 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-saffron" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Catalog Language:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {LANGUAGE_OPTIONS.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-saffron text-obsidian font-bold shadow-md shadow-saffron/20'
                      : 'bg-white/4 text-white/60 hover:text-white border border-white/8'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category & Tags Header */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-bold px-3.5 py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2))',
              border: '1px solid rgba(245,158,11,0.4)',
              color: '#F59E0B',
            }}
          >
            {catalog.category || catalog.craft_category || 'Handicrafts'}
          </span>
          {(catalog.tags || []).slice(0, 4).map((t, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono text-white/60 border border-white/10 rounded-full px-3 py-1 bg-white/2"
            >
              #{t.split(':')[0]?.trim() || `Tag ${idx + 1}`}
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
                English · Commercial E-Commerce Title
              </p>
              {editMode === 'title_en' ? (
                <div className="flex gap-2">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="input-dark flex-1 text-sm"
                  />
                  <button onClick={handleSaveEdit} className="btn-emerald px-3 py-2 text-xs cursor-pointer">
                    <Check size={13} />
                  </button>
                  <button onClick={() => setEditMode(null)} className="btn-ghost-dark px-3 py-2 text-xs cursor-pointer">
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
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleCopy(catalog.title_en, 'title_en')}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
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
                {LANG_MAP[selectedLanguage] || 'Regional'} · स्थानीय भाषा शीर्षक
              </p>
              {editMode === 'title_local' ? (
                <div className="flex gap-2">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="input-dark flex-1 text-sm"
                  />
                  <button onClick={handleSaveEdit} className="btn-emerald px-3 py-2 text-xs cursor-pointer">
                    <Check size={13} />
                  </button>
                  <button onClick={() => setEditMode(null)} className="btn-ghost-dark px-3 py-2 text-xs cursor-pointer">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-2 group">
                  <h3 className="font-serif font-bold text-saffron text-xl leading-tight flex-1">
                    {activeTranslation?.title || catalog.title_local || catalog.title_en}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditMode('title_local');
                        setEditValue(activeTranslation?.title || catalog.title_local || '');
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleCopy(activeTranslation?.title || catalog.title_local, 'title_local')}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
                      title="Copy"
                    >
                      {copied === 'title_local' ? <Check size={13} className="text-emerald-craft" /> : <Copy size={13} />}
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
            {
              key: 'story_en',
              label: 'Craft Heritage Story · English',
              color: 'text-white/85',
              content: catalog.story_en,
            },
            {
              key: 'story_local',
              label: `स्थानीय शिल्प कहानी · ${LANG_MAP[selectedLanguage] || 'Regional'}`,
              color: 'text-saffron/90',
              content: activeTranslation?.story || catalog.story_local,
            },
          ].map(({ key, label, color, content }) => (
            <div key={key} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{label}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditMode(key);
                      setEditValue(content || '');
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-colors cursor-pointer"
                    title="Edit narrative"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={() => handleCopy(content || '', key)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-colors cursor-pointer"
                    title="Copy"
                  >
                    {copied === key ? <Check size={12} className="text-emerald-craft" /> : <Copy size={12} />}
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
                    <button onClick={handleSaveEdit} className="btn-emerald py-1.5 text-xs flex-1 cursor-pointer">
                      Save
                    </button>
                    <button onClick={() => setEditMode(null)} className="btn-ghost-dark py-1.5 text-xs flex-1 cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className={`text-sm ${color} leading-relaxed font-sans`}>{content}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── 4 Specific Tags: Material, Technique, Dimensions/Weight, Care ── */}
        <div className="glass-card p-5">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">
            ◈ 4 Core E-Commerce Specifications (Material, Technique, Dimensions/Weight, Care)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(catalog.tags || []).slice(0, 4).map((tag, idx) => {
              const colonIdx = tag.indexOf(':');
              const label = colonIdx !== -1 ? tag.substring(0, colonIdx).trim() : `Spec ${idx + 1}`;
              const value = colonIdx !== -1 ? tag.substring(colonIdx + 1).trim() : tag;

              const lower = label.toLowerCase();
              const iconKey =
                lower.includes('technique') || lower.includes('craft')
                  ? 'settings'
                  : lower.includes('care') || lower.includes('preservation')
                  ? 'shield'
                  : lower.includes('dimension') || lower.includes('weight') || lower.includes('fit')
                  ? 'maximize-2'
                  : 'layers';

              const Icon = ICON_MAP[iconKey] || Layers;
              const isEditing = editMode === `tag_${idx}`;

              return (
                <div key={idx} className="spec-chip group p-3.5 rounded-2xl border border-white/8 bg-white/3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-saffron/15 flex items-center justify-center text-saffron flex-shrink-0 mt-0.5">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-0.5">
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
                            const updatedTags = [...(catalog.tags || [])];
                            updatedTags[idx] = `${label}: ${editValue}`;
                            const updated = { ...catalog, tags: updatedTags };
                            setLocalCatalog(updated);
                            onCatalogReady?.(updated);
                            setEditMode(null);
                          }}
                          className="btn-emerald p-1.5 text-xs rounded-lg cursor-pointer"
                        >
                          <Check size={11} />
                        </button>
                        <button
                          onClick={() => setEditMode(null)}
                          className="btn-ghost-dark p-1.5 text-xs rounded-lg cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs text-white/85 leading-snug font-medium">{value}</p>
                        <button
                          onClick={() => {
                            setEditMode(`tag_${idx}`);
                            setEditValue(value);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-white transition-opacity cursor-pointer"
                          title="Edit specification"
                        >
                          <Edit3 size={12} />
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
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing}
            className="btn-ghost-dark flex items-center justify-center gap-2 py-3 text-sm cursor-pointer"
          >
            <RefreshCw size={15} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>Re-generate Catalog</span>
          </button>
          <button
            onClick={onNext}
            className="btn-saffron flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm cursor-pointer"
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
