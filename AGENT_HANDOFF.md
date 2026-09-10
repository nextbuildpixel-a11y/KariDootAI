# AGENT_HANDOFF.md — KariDoot AI · Craft-Tech Studio v2.0
> **Last Updated**: 2026-09-09T22:38 IST  
> **Status**: ✅ Build Green (zero warnings) · Dev server live on `http://localhost:5173/`  
> **SIH Problem**: SIH26090 · Ministry of Social Justice and Empowerment (MoSJE)

---

## 1. BRAND IDENTITY & THEME TOKENS (v2.0 Craft-Tech Studio)

| Token | Value | Usage |
|-------|-------|-------|
| `obsidian` | `#0B0F17` | App background |
| `obsidian-radial` | `radial-gradient(ellipse at 50% 0%, #1E293B, #0B0F17)` | Full BG |
| `saffron` | `#F59E0B → #D97706` | Primary gradient (buttons, accents) |
| `emerald-craft` | `#10B981` | Success, fair-trade, live status |
| `rose-craft` | `#F43F5E` | Recording indicator |
| `glass-card` | `rgba(255,255,255,0.04) + blur-xl + border-white/10` | All cards |
| `btn-saffron` | saffron gradient + glow shadow | Primary CTA |
| `btn-emerald` | emerald gradient + glow shadow | Secondary CTA |
| `btn-ghost-dark` | transparent + border-white/10 | Tertiary |
| Font Serif | Playfair Display | Titles |
| Font Sans | Plus Jakarta Sans | Body/UI |
| Font Mono | JetBrains Mono | Prices, HUD labels |
| `arc-slider` | Custom CSS with `--pct` gradient fill | Margin slider |
| `scan-beam` | keyframe animation, saffron→emerald gradient | Vision Studio |
| `ticker` | 22s linear infinite translateX | Market data |
| `stamp` | spring bounce 0.55s | Fair Trade Seal |

---

## 2. COMPONENT FILE TREE (v2.0)

```
c:\kaladoot\
├── public/manifest.json              ✅ PWA manifest
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                ✅ Dark glass header + step tracker (workstation labels)
│   │   ├── VoiceCopilot.jsx          ✅ Dynamic Island pill — waveform, steps, replay
│   │   ├── PhotoStudio.jsx           ✅ Vision Studio — scan beam, remove.bg, glass curtain
│   │   ├── VoiceCatalog.jsx          ✅ Acoustic Lab (Step 2) + Spec HUD (Step 3) + tilt card
│   │   ├── WinWinPricing.jsx         ✅ Fintech Ledger — steppers, arc slider, ticker, seal
│   │   └── OmnichannelHub.jsx        ✅ Launchpad — export matrix, QR poster, store preview
│   ├── services/
│   │   ├── aiService.js              ✅ Gemini + remove.bg + ONDC/CSV/WA generators
│   │   └── voiceService.js           ✅ TTS + STT (unchanged)
│   ├── data/mockArtisanData.js       ✅ 3 craft products + profiles + dialects
│   ├── App.jsx                       ✅ Obsidian BG + ambient glows + orchestrator
│   ├── main.jsx                      ✅ React entry
│   └── index.css                     ✅ Full Craft-Tech Studio CSS system
├── .env                              ✅ VITE_GEMINI_API_KEY + VITE_REMOVE_BG_KEY
├── tailwind.config.js                ✅ Complete v2.0 design tokens + 15 animations
└── AGENT_HANDOFF.md                  This file
```

---

## 3. API KEYS WIRED

| Service | Env Var | Purpose |
|---------|---------|---------|
| Google Gemini 1.5 Flash | `VITE_GEMINI_API_KEY` | Multimodal craft analysis, cost extraction, market benchmarks |
| Remove.bg | `VITE_REMOVE_BG_KEY` | Neural background removal for studio cutout |

Resolver order: `.env` → `localStorage` → built-in mock engine (graceful fallback).

---

## 4. KEY FEATURES v2.0

| Workstation | Feature |
|---|---|
| Vision Studio | AI Laser Scan Beam animation · remove.bg API · glass curtain Before/After slider · bracket-lock |
| Acoustic Lab | 24-bar canvas EQ visualizer · pulsing mic orb · keyword pill transcription · bilingual fallback |
| Spec HUD | 3D tilt holographic card · dual editorial story cards · copy/edit/audio per field |
| Pricing Telemetry | Fintech stepper dials · arc gradient slider · count-up numbers · Fair Trade seal + particles · live ticker |
| Omnichannel Launchpad | Glassmorphic export cards · QR A4 poster modal · live store preview · WhatsApp direct |
| Dynamic Island | Floating persistent pill · emerald pulse · waveform bars · step dots · replay button |

---

## 5. WIZARD STATE

```js
{
  step: 1,          // 1–5 (workstation index)
  photo: { dataUrl, base64, mimeType, name },
  catalogData: {    // Gemini/mock JSON
    title_en, title_local, craft_category, story_en, story_local,
    specifications, cost_breakdown, market_benchmarks, ondc_tags, artisanId
  },
  pricingData: { costBreakdown, marginPercent, sellingPrice, baseCost, profit },
  dialect: 'hi',    // hi | te | ta | bn | en
  voiceEnabled: true
}
```

---

## 6. RUN COMMANDS

```bash
cd c:\kaladoot
npm run dev         # → http://localhost:5173/
npm run build       # ✓ 0 errors, 0 warnings, ~715ms
```
