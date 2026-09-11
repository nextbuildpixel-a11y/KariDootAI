// KariDoot AI · Craft-Tech Studio — Omnichannel Launchpad (Step 5)
// 3D Stall Poster, Glassmorphic Export Matrix, Store Preview

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ExternalLink, Copy, Check, Printer, X, Globe } from 'lucide-react';
import {
  generateOndcBecknJson,
  generateEcommerceCsv,
  generateWhatsAppMessage,
} from '../services/aiService';
import { ARTISAN_PROFILES } from '../data/mockArtisanData';

function ExportCard({ icon, label, sublabel, onClick, accent = '#F59E0B' }) {
  const [done, setDone] = useState(false);
  const handle = async () => {
    await onClick?.();
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="w-full text-left glass-card p-5 hover:border-white/20 transition-all duration-200 group hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-transform duration-200 group-hover:scale-110"
          style={{ background: `${accent}18`, border: `1px solid ${accent}33` }}
        >
          {done ? '✓' : icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white text-sm group-hover:text-white transition-colors">{done ? 'Complete ✓' : label}</p>
          <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{sublabel}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200
          ${done ? 'bg-emerald-craft border-emerald-craft' : 'border-white/10 group-hover:border-white/25'}`}>
          {done ? <Check size={10} className="text-white" /> : <Download size={10} className="text-white/30" />}
        </div>
      </div>
    </button>
  );
}

export default function OmnichannelHub({ catalogData, pricingData, photo }) {
  const [showQr, setShowQr] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const artisanId = catalogData?.artisanId || 'artisan-rajasthan-001';
  const artisanProfile = ARTISAN_PROFILES[artisanId] || ARTISAN_PROFILES['artisan-rajasthan-001'];
  const storeUrl = `${window.location.origin}/store/${artisanId}`;
  const sellingPrice = pricingData?.sellingPrice || 0;

  const handleOndcDownload = () => {
    const json = generateOndcBecknJson(catalogData, pricingData, artisanProfile);
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `karidoot-ondc-${artisanId}.json`;
    a.click();
  };

  const handleCsvDownload = () => {
    const csv = generateEcommerceCsv(catalogData, pricingData, artisanProfile);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `karidoot-catalog.csv`;
    a.click();
  };

  const handleWhatsApp = () => {
    const msg = generateWhatsAppMessage(catalogData, pricingData, artisanProfile, storeUrl);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(storeUrl).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-slide-up">
      {/* Header */}
      <div className="mb-8">
        <div className="step-badge-active mb-4">◀ STEP 05 · OMNICHANNEL LAUNCHPAD</div>
        <h2 className="font-serif font-bold text-white text-3xl sm:text-4xl mb-2">
          Omnichannel <span className="text-gradient-saffron">Launchpad</span>
        </h2>
        <p className="text-white/45 text-sm">Deploy your catalog across ONDC, Amazon, Flipkart, and WhatsApp</p>
      </div>

      {/* ── Launch Banner ── */}
      <div
        className="rounded-2xl p-5 mb-6 border border-emerald-craft/20 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(245,158,11,0.05))' }}
      >
        <div className="text-4xl">🚀</div>
        <div className="min-w-0">
          <p className="font-serif font-bold text-white text-lg leading-tight">
            {artisanProfile?.name_local || artisanProfile?.name} — Catalog Live
          </p>
          <p className="text-white/50 text-sm mt-0.5">
            <span className="font-mono font-bold text-saffron">₹{sellingPrice.toLocaleString('en-IN')}</span>
            {' '}· {catalogData?.craft_category} · MoSJE Verified
          </p>
        </div>
        <div
          className="ml-auto flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold border"
          style={{ background: '#10B98115', borderColor: '#10B98133', color: '#10B981' }}
        >
          LIVE ●
        </div>
      </div>

      {/* ── Store Card ── */}
      <div className="glass-card p-4 mb-5">
        <div className="flex items-center gap-3 mb-3">
          {photo && (
            <img src={photo.dataUrl} alt="Craft" className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-serif font-bold text-white leading-tight truncate">{catalogData?.title_en}</p>
            <p className="text-[11px] text-white/40 mt-0.5">{artisanProfile?.name} · {artisanProfile?.village}</p>
            <p className="font-mono font-bold text-saffron text-xl mt-1">₹{sellingPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Store URL bar */}
        <div
          className="flex items-center gap-2 rounded-xl border border-white/8 px-3 py-2 mb-3"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <Globe size={11} className="text-white/25 flex-shrink-0" />
          <span className="text-[11px] font-mono text-white/35 flex-1 truncate">{storeUrl}</span>
          <button onClick={handleCopyLink}
            className="flex items-center gap-1 text-[11px] font-semibold text-saffron/80 hover:text-saffron transition-colors">
            {linkCopied ? <><Check size={10} />Copied</> : <><Copy size={10} />Copy</>}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setShowStore(true)}
            className="btn-ghost-dark flex items-center justify-center gap-2 py-2.5 text-xs">
            <ExternalLink size={13} /> Store Preview
          </button>
          <button onClick={() => setShowQr(true)}
            className="btn-saffron flex items-center justify-center gap-2 py-2.5 text-xs font-bold">
            <span>📱</span> Stall QR Poster
          </button>
        </div>
      </div>

      {/* ── Export Matrix ── */}
      <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">⬡ Export Intelligence Matrix</p>
      <div className="space-y-2.5 mb-6">
        <ExportCard
          icon="🌐"
          label="Deploy to ONDC Network"
          sublabel="Beckn Protocol v1.2.0 catalog JSON — ready for ONDC operator ingestion"
          onClick={handleOndcDownload}
          accent="#10B981"
        />
        <ExportCard
          icon="📊"
          label="Export Amazon / Flipkart Flat-File"
          sublabel="Standard bulk upload CSV — compatible with Seller Central & Flipkart Samarth"
          onClick={handleCsvDownload}
          accent="#F59E0B"
        />
        <ExportCard
          icon="💬"
          label="Launch WhatsApp Direct Store"
          sublabel="Pre-populated message with store link, UPI, craft story — zero friction ordering"
          onClick={handleWhatsApp}
          accent="#25D366"
        />
      </div>

      {/* ── Artisan Profile ── */}
      <div className="glass-card p-4">
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Artisan Identity Card</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Name', value: artisanProfile.name_local || artisanProfile.name },
            { label: 'Region', value: artisanProfile.village },
            { label: 'UPI', value: artisanProfile.upi, mono: true },
            { label: 'Experience', value: `${artisanProfile.experience_years} years` },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <p className="text-[10px] font-mono text-white/25 mb-0.5">{label}</p>
              <p className={`text-sm font-semibold text-white ${mono ? 'font-mono text-xs text-saffron/80' : ''}`}>{value}</p>
            </div>
          ))}
        </div>
        {artisanProfile.certified && (
          <div className="mt-3 flex items-center gap-2 text-emerald-craft text-xs font-semibold">
            <Check size={13} /> MoSJE Certified Artisan · SIH26090
          </div>
        )}
      </div>

      {/* ── QR Poster Modal ── */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-craft no-print">
          <div
            className="rounded-2xl border border-white/10 max-w-sm w-full overflow-hidden"
            style={{ background: '#111827', boxShadow: '0 0 80px rgba(0,0,0,0.8)' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 no-print">
              <div>
                <p className="font-semibold text-white text-sm">Exhibition Stall Poster</p>
                <p className="text-[11px] text-white/35 font-mono">A4 Print · Surajkund · Dilli Haat · Shilp Samagam</p>
              </div>
              <button onClick={() => setShowQr(false)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40">
                <X size={16} />
              </button>
            </div>

            {/* Printable Poster Content */}
            <div className="p-6 text-center print-poster" style={{ background: '#FAF7F2', color: '#1B2430' }}>
              {/* Saffron Header Band */}
              <div className="rounded-xl p-3 mb-4" style={{ background: 'linear-gradient(135deg, #C85A32, #A04420)' }}>
                <p className="font-serif font-bold text-white text-lg">KariDoot AI · कारीदूत</p>
                <p className="text-white/70 text-[11px]">Ministry of Social Justice & Empowerment</p>
              </div>

              {photo && (
                <img src={photo.dataUrl} alt="Craft" className="w-32 h-32 object-cover rounded-xl border-2 border-indigo-craft/20 mx-auto mb-3" />
              )}
              <p className="font-serif font-bold text-xl text-indigo-craft mb-1 leading-tight">{catalogData?.title_en}</p>
              <p className="font-mono font-bold text-3xl mb-1" style={{ color: '#C85A32' }}>₹{sellingPrice}</p>
              <p className="text-xs text-indigo-craft/50 mb-5">{artisanProfile.name} · {artisanProfile.village}</p>

              {/* QR Code */}
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-white border-2 border-indigo-craft/20 rounded-xl shadow-md">
                  <QRCodeSVG value={storeUrl} size={160} fgColor="#1B2430" bgColor="#ffffff" level="H" includeMargin={false} />
                </div>
              </div>
              <p className="text-xs font-semibold text-indigo-craft mb-1">Scan to Order · स्कैन करें</p>
              <p className="text-[9px] font-mono text-indigo-craft/40 mb-4 break-all">{storeUrl}</p>

              <div className="grid grid-cols-3 gap-1 text-[10px] text-indigo-craft/60 mb-4">
                <div className="bg-sand rounded-lg p-2">💳 UPI<br /><span className="font-mono text-[9px]">{artisanProfile.upi}</span></div>
                <div className="bg-sand rounded-lg p-2">📞 Call<br />{artisanProfile.phone?.slice(-10)}</div>
                <div className="bg-sand rounded-lg p-2">💬 WhatsApp<br />Available</div>
              </div>

              <div className="flex flex-wrap gap-1 justify-center">
                {['Surajkund Mela', 'Dilli Haat', 'Shilp Samagam'].map((v) => (
                  <span key={v} className="text-[9px] bg-brass/20 border border-brass/30 text-indigo-craft px-2 py-0.5 rounded-full">{v}</span>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-white/8 no-print" style={{ background: '#0d1117' }}>
              <button onClick={() => window.print()} className="btn-saffron w-full flex items-center justify-center gap-2 font-bold">
                <Printer size={15} /> Print A4 Poster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Store Preview Modal ── */}
      {showStore && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-craft">
          <div
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: '#111827', boxShadow: '0 0 80px rgba(0,0,0,0.8)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <div>
                <p className="font-semibold text-white text-sm">Public Store Preview</p>
                <p className="text-[11px] text-white/35 font-mono">Customer-facing product page</p>
              </div>
              <button onClick={() => setShowStore(false)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40">
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <div
                className="rounded-xl p-4 mb-4 border border-white/8"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex gap-3">
                  {photo && <img src={photo.dataUrl} alt="Craft" className="w-20 h-20 object-cover rounded-lg border border-white/10 flex-shrink-0" />}
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#F59E0B18', color: '#F59E0B', border: '1px solid #F59E0B33' }}>
                      {catalogData?.craft_category}
                    </span>
                    <p className="font-serif font-bold text-white mt-1 leading-tight">{catalogData?.title_en}</p>
                    <p className="font-mono font-bold text-2xl text-saffron">₹{sellingPrice}</p>
                  </div>
                </div>
                <p className="text-xs text-white/45 mt-3 leading-relaxed line-clamp-3">{catalogData?.story_en}</p>
              </div>
              <div className="space-y-2">
                <button className="btn-saffron w-full flex items-center justify-center gap-2 py-3 font-bold">
                  💳 Pay via UPI · ₹{sellingPrice}
                </button>
                <button onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: '#25D366', color: 'white', boxShadow: '0 4px 12px #25D36644' }}>
                  💬 Order on WhatsApp
                </button>
              </div>
              <p className="text-center text-[11px] text-white/25 font-mono mt-3">
                {artisanProfile.name} · {artisanProfile.village} · ✓ MoSJE Verified
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
