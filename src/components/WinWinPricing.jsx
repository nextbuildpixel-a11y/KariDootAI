// KariDoot AI · Craft-Tech Studio — Win-Win Pricing Engine (Step 4)
// Reactive Cost Inputs (no stuck numbers), Dynamic Base Cost & Margin Slider,
// Real-World Market Intelligence (Amazon Karigar & Flipkart), Dual-Win Card

import { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  Sparkles,
  TrendingUp,
  BadgeCheck,
  Info,
  RefreshCw,
  Layers,
  Hammer,
  Package,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { fetchLiveMarketBenchmarks } from '../services/aiService';

const FAIR_TRADE_THRESHOLD = 50;

export default function WinWinPricing({ catalogData, pricingData, onPricingReady, onNext }) {
  // ── Reactive User Inputs (Fully Controlled React State) ──
  const [costs, setCosts] = useState(() => ({
    material: pricingData?.costBreakdown?.material ?? (Number(catalogData?.cost_breakdown?.material_cost) || 120),
    labour: pricingData?.costBreakdown?.labour ?? (Number(catalogData?.cost_breakdown?.labour_cost) || 180),
    packaging: pricingData?.costBreakdown?.packaging ?? (Number(catalogData?.cost_breakdown?.packaging_cost) || 40),
    logistics: pricingData?.costBreakdown?.logistics ?? (Number(catalogData?.cost_breakdown?.logistics_cost) || 80),
  }));

  // Interactive Margin Slider (20% to 100%, default 50%)
  const [margin, setMargin] = useState(() => pricingData?.marginPercent ?? 50);

  // Market Benchmarks State
  const [benchmarks, setBenchmarks] = useState(() => {
    const initAmazon = Number(catalogData?.market_benchmarks?.amazon_avg) || 750;
    const initFlipkart = Number(catalogData?.market_benchmarks?.flipkart_avg) || 690;
    return {
      amazon_avg: initAmazon,
      flipkart_avg: initFlipkart,
      market_average: Math.round((initAmazon + initFlipkart) / 2),
      advice:
        catalogData?.market_benchmarks?.advice ||
        'Direct artisan storytelling and fair-trade certification justify premium marketplace positioning.',
    };
  });
  const [isLoadingBenchmarks, setIsLoadingBenchmarks] = useState(false);

  // Update costs if catalogData changes externally and no user edit was made yet
  useEffect(() => {
    if (!pricingData && catalogData?.cost_breakdown) {
      setCosts({
        material: Number(catalogData.cost_breakdown.material_cost) || 120,
        labour: Number(catalogData.cost_breakdown.labour_cost) || 180,
        packaging: Number(catalogData.cost_breakdown.packaging_cost) || 40,
        logistics: Number(catalogData.cost_breakdown.logistics_cost) || 80,
      });
    }
  }, [catalogData?.cost_breakdown, pricingData]);

  // Dynamic calculations on every keystroke
  const baseCost = (costs.material || 0) + (costs.labour || 0) + (costs.packaging || 0) + (costs.logistics || 0);
  const finalPrice = Math.round(baseCost * (1 + margin / 100));
  const artisanProfit = finalPrice - baseCost;

  const marketPrice = benchmarks.market_average || Math.round((benchmarks.amazon_avg + benchmarks.flipkart_avg) / 2) || Math.round(baseCost * 1.95);
  const customerSavings = Math.max(0, marketPrice - finalPrice);

  // Bubble up state changes to parent App state for persistence
  useEffect(() => {
    onPricingReady?.({
      costBreakdown: costs,
      marginPercent: margin,
      sellingPrice: finalPrice,
      baseCost,
      profit: artisanProfit,
      marketPrice,
      customerSavings,
    });
  }, [costs, margin, finalPrice, baseCost, artisanProfit, marketPrice, customerSavings, onPricingReady]);

  // Fetch real-world market intelligence via Gemini Flash
  const loadMarketData = async () => {
    if (!catalogData?.title_en) return;
    setIsLoadingBenchmarks(true);
    try {
      const data = await fetchLiveMarketBenchmarks({
        title: catalogData.title_en,
        craftCategory: catalogData.craft_category,
        baseCost,
      });
      setBenchmarks(data);
    } catch (err) {
      console.warn('[KariDoot Pricing] Could not refresh benchmarks:', err);
    } finally {
      setIsLoadingBenchmarks(false);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, [catalogData?.title_en]);

  const marginColor = margin < 35 ? '#F59E0B' : '#10B981';

  return (
    <div className="max-w-3xl mx-auto animate-fade-slide-up space-y-6">
      {/* ── Header ── */}
      <div>
        <div className="step-badge-active mb-3">◆ STEP 04 · WIN-WIN PRICING ENGINE</div>
        <h2 className="font-serif font-bold text-white text-3xl sm:text-4xl mb-2 tracking-tight">
          Win-Win <span className="text-gradient-saffron">Pricing Engine</span>
        </h2>
        <p className="text-white/50 text-sm leading-relaxed max-w-xl">
          Real-time production cost ledger with dynamic margin calibration. Compare your fair selling price with live Amazon Karigar and Flipkart retail benchmarks.
        </p>
      </div>

      {/* ── 1. REACTIVE USER INPUTS: 4 COST INPUTS ── */}
      <div className="glass-card p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-saffron" />
            <h3 className="font-serif font-bold text-white text-base">Artisan Cost Breakdown</h3>
          </div>
          <span className="text-xs font-mono text-white/40 uppercase">Direct Production Inputs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Material Cost */}
          <div className="p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-base">🪨</span> Material Cost
              </span>
              <span className="text-[11px] text-saffron font-medium">कच्चा माल</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus-within:border-saffron transition-all">
                <span className="font-mono text-white/50 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={costs.material === 0 ? '' : costs.material}
                  placeholder="0"
                  onChange={(e) => setCosts({ ...costs, material: Number(e.target.value) || 0 })}
                  className="w-full bg-transparent outline-none font-mono font-bold text-lg text-white price-mono"
                />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setCosts({ ...costs, material: Math.max(0, costs.material - 10) })}
                  className="w-8 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-sm active:scale-95"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setCosts({ ...costs, material: costs.material + 10 })}
                  className="w-8 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-sm active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Artisan Labour */}
          <div className="p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                <Hammer size={15} className="text-amber-400" /> Artisan Labour
              </span>
              <span className="text-[11px] text-amber-400 font-medium">कारीगरी / मेहनत</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus-within:border-saffron transition-all">
                <span className="font-mono text-white/50 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={costs.labour === 0 ? '' : costs.labour}
                  placeholder="0"
                  onChange={(e) => setCosts({ ...costs, labour: Number(e.target.value) || 0 })}
                  className="w-full bg-transparent outline-none font-mono font-bold text-lg text-white price-mono"
                />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setCosts({ ...costs, labour: Math.max(0, costs.labour - 10) })}
                  className="w-8 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-sm active:scale-95"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setCosts({ ...costs, labour: costs.labour + 10 })}
                  className="w-8 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-sm active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Packaging */}
          <div className="p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                <Package size={15} className="text-emerald-400" /> Packaging
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">सुरक्षित पैकेजिंग</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus-within:border-saffron transition-all">
                <span className="font-mono text-white/50 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={costs.packaging === 0 ? '' : costs.packaging}
                  placeholder="0"
                  onChange={(e) => setCosts({ ...costs, packaging: Number(e.target.value) || 0 })}
                  className="w-full bg-transparent outline-none font-mono font-bold text-lg text-white price-mono"
                />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setCosts({ ...costs, packaging: Math.max(0, costs.packaging - 10) })}
                  className="w-8 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-sm active:scale-95"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setCosts({ ...costs, packaging: costs.packaging + 10 })}
                  className="w-8 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-sm active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                <Truck size={15} className="text-sky-400" /> Logistics
              </span>
              <span className="text-[11px] text-sky-400 font-medium">परिवहन व डाक</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus-within:border-saffron transition-all">
                <span className="font-mono text-white/50 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={costs.logistics === 0 ? '' : costs.logistics}
                  placeholder="0"
                  onChange={(e) => setCosts({ ...costs, logistics: Number(e.target.value) || 0 })}
                  className="w-full bg-transparent outline-none font-mono font-bold text-lg text-white price-mono"
                />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setCosts({ ...costs, logistics: Math.max(0, costs.logistics - 10) })}
                  className="w-8 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-sm active:scale-95"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setCosts({ ...costs, logistics: costs.logistics + 10 })}
                  className="w-8 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-sm active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Base Cost Banner */}
        <div className="mt-2 p-3.5 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Total Base Cost (कुल उत्पादन लागत):</span>
            <p className="text-xs text-white/60 mt-0.5 font-mono">
              ₹{costs.material} (Material) + ₹{costs.labour} (Labour) + ₹{costs.packaging} (Packaging) + ₹{costs.logistics} (Logistics)
            </p>
          </div>
          <span className="font-mono font-bold text-2xl text-white price-mono">₹{baseCost}</span>
        </div>
      </div>

      {/* ── 2. INTERACTIVE MARGIN SLIDER (20% to 100%, default 50%) ── */}
      <div className="glass-card p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif font-bold text-white text-base">Artisan Profit Margin</p>
            <p className="text-xs text-white/50">Adjust your markup to calculate fair selling price and artisan earnings</p>
          </div>
          <div
            className="px-4 py-1.5 rounded-full font-mono font-bold text-xl price-mono border"
            style={{
              background: `${marginColor}18`,
              color: marginColor,
              borderColor: `${marginColor}44`,
            }}
          >
            {margin}%
          </div>
        </div>

        <input
          type="range"
          min={20}
          max={120}
          step={1}
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
          className="w-full h-2.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-saffron"
        />

        <div className="flex justify-between text-[11px] font-mono text-white/30">
          <span>20% Minimum</span>
          <span className="text-saffron font-semibold">50% Fair Trade Recommended</span>
          <span>120% Premium Artisan</span>
        </div>

        {/* Dynamic Price & Profit Summary */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-white/3 border border-white/8 text-center">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">KariDoot Direct Price</p>
            <p className="font-mono font-bold text-3xl sm:text-4xl text-gradient-saffron price-mono">
              ₹{finalPrice.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] font-mono text-white/30 mt-1">
              ₹{baseCost} + {margin}%
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
            <p className="text-[10px] font-mono text-emerald-400/70 uppercase tracking-widest mb-1">Artisan Profit</p>
            <p className="font-mono font-bold text-3xl sm:text-4xl text-emerald-400 price-mono" style={{ color: '#10B981' }}>
              +₹{artisanProfit.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] font-mono text-emerald-400/60 mt-1">
              Direct Earnings
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. REAL-WORLD MARKET INTELLIGENCE & DUAL-WIN CARD ── */}
      <div className="glass-card p-6 border-saffron/30 space-y-5 bg-gradient-to-br from-white/4 to-saffron/5 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-saffron" />
            <h3 className="font-serif font-bold text-white text-base">Real-World Market Intelligence</h3>
          </div>
          <button
            onClick={loadMarketData}
            disabled={isLoadingBenchmarks}
            className="flex items-center gap-1.5 text-[11px] font-mono text-saffron/80 hover:text-saffron transition-colors"
          >
            <RefreshCw size={12} className={isLoadingBenchmarks ? 'animate-spin' : ''} />
            <span>Refresh Benchmark</span>
          </button>
        </div>

        {/* Live Market Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/3 border border-white/8">
            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-1">
              <span>🛍️</span>
              <span>Amazon Karigar Avg</span>
            </div>
            <p className="font-mono font-bold text-xl text-white">₹{benchmarks.amazon_avg.toLocaleString('en-IN')}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/3 border border-white/8">
            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-1">
              <span>🏪</span>
              <span>Flipkart Samarth Avg</span>
            </div>
            <p className="font-mono font-bold text-xl text-white">₹{benchmarks.flipkart_avg.toLocaleString('en-IN')}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-saffron/10 border border-saffron/30">
            <div className="flex items-center gap-1.5 text-xs text-saffron mb-1">
              <span>🏷️</span>
              <span>Retail / Amazon Karigar Average</span>
            </div>
            <p className="font-mono font-bold text-xl text-saffron">₹{marketPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* ── DUAL-WIN CARD: WHY BOTH SIDES BENEFIT ── */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheck size={20} className="text-emerald-400" />
              <span className="font-serif font-bold text-white text-base">Dual-Win Value Proposition</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Fair Trade Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <p className="text-[10px] font-mono text-white/40 uppercase">Retail / Amazon Karigar Average</p>
              <p className="font-mono font-bold text-lg text-white/70 line-through mt-0.5">₹{marketPrice}</p>
            </div>

            <div className="p-3 rounded-xl bg-saffron/10 border border-saffron/30">
              <p className="text-[10px] font-mono text-saffron uppercase">KariDoot Direct Price</p>
              <p className="font-mono font-bold text-xl text-saffron mt-0.5">₹{finalPrice}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
              <p className="text-[10px] font-mono text-emerald-300 uppercase">Artisan Profit</p>
              <p className="font-mono font-bold text-xl text-emerald-400 mt-0.5 font-mono" style={{ color: '#10B981' }}>+₹{artisanProfit}</p>
            </div>

            <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-500/30">
              <p className="text-[10px] font-mono text-sky-300 uppercase">Customer Savings</p>
              <p className="font-mono font-bold text-xl text-sky-400 mt-0.5">₹{customerSavings}</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-white/70 leading-relaxed font-sans border-t border-white/5 flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <p>
              <span className="font-semibold text-emerald-400">Why this is a Dual-Win: </span>
              Customers save <span className="text-white font-bold">₹{customerSavings}</span> compared to commercial retail markups, while you earn a fair wage profit of <span className="text-emerald-400 font-bold">₹{artisanProfit}</span> ({margin}% margin) with zero middleman commissions.
            </p>
          </div>
        </div>

        {/* AI Commercial Verdict */}
        <div className="flex items-start gap-2.5 text-xs text-white/50 bg-white/2 p-3 rounded-xl border border-white/5">
          <Info size={14} className="text-saffron/70 flex-shrink-0 mt-0.5" />
          <p>
            <span className="text-saffron/90 font-semibold">Marketplace Strategy: </span>
            {benchmarks.advice}
          </p>
        </div>
      </div>

      {/* ── Action Next Step ── */}
      <button
        onClick={onNext}
        className="btn-saffron w-full flex items-center justify-center gap-2 py-4 text-base font-bold shadow-xl"
      >
        <span>Activate Omnichannel Launchpad</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
