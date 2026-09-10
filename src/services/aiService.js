// KariDoot AI — AI Service (Craft-Tech Studio)
// Dynamic Gemini Multimodal Copywriting Engine + Live Market Benchmarks + ONDC / CSV / WhatsApp Exporters

export function getGeminiKey() {
  const envKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY);
  if (envKey && envKey.trim().length > 10) return envKey.trim();
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('karidoot_gemini_key') : null;
  if (localKey && localKey.trim().length > 10) return localKey.trim();
  return null;
}

export const getApiKey = getGeminiKey;

export function getRemoveBgKey() {
  const envKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_REMOVE_BG_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_REMOVE_BG_KEY);
  if (envKey && envKey.trim().length > 5) return envKey.trim();
  return typeof localStorage !== 'undefined' ? localStorage.getItem('karidoot_removebg_key') : null;
}

export function saveApiKey(key) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('karidoot_gemini_key', key.trim());
  }
}

export function clearApiKey() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('karidoot_gemini_key');
  }
}

// ─────────────────────────────────────────────────────────────
// NUMBER & PRICE PARSER
// Safely extracts numeric values from numbers, strings with currency symbols, or commas
// ─────────────────────────────────────────────────────────────
export function parsePrice(val, defaultVal = 0) {
  if (typeof val === 'number') return Math.round(val);
  if (!val) return defaultVal;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return !isNaN(num) && num > 0 ? Math.round(num) : defaultVal;
}

// ─────────────────────────────────────────────────────────────
// GEMINI AI — Dynamic Copywriting & Catalog Engine
// ─────────────────────────────────────────────────────────────
const LANG_MAP = {
  hi: 'Hindi',
  te: 'Telugu',
  ta: 'Tamil',
  bn: 'Bengali',
  en: 'English',
  mr: 'Marathi',
  gu: 'Gujarati',
  kn: 'Kannada',
  ml: 'Malayalam',
};

// Verified active Gemini models on v1beta API
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash-lite'];

/**
 * Normalizes and formats the catalog response from Gemini or fallback.
 * Ensures numbers, specs, and 4 specific tags match application requirements.
 */
function normalizeCatalogResponse(data, rawNotes) {
  const costBreakdown = {
    material_cost: parsePrice(data.cost_breakdown?.material_cost, 280),
    labour_cost: parsePrice(data.cost_breakdown?.labour_cost, 450),
    packaging_cost: parsePrice(data.cost_breakdown?.packaging_cost, 60),
    logistics_cost: parsePrice(data.cost_breakdown?.logistics_cost, 120),
  };

  const baseCost =
    costBreakdown.material_cost +
    costBreakdown.labour_cost +
    costBreakdown.packaging_cost +
    costBreakdown.logistics_cost;

  const marketBenchmarks = {
    amazon_avg: parsePrice(data.market_benchmarks?.amazon_avg, Math.round(baseCost * 2.1)),
    flipkart_avg: parsePrice(data.market_benchmarks?.flipkart_avg, Math.round(baseCost * 1.85)),
    ondc_avg: parsePrice(data.market_benchmarks?.ondc_avg, Math.round(baseCost * 1.55)),
    market_verdict: data.market_benchmarks?.market_verdict || 'Sweet Spot',
    advice:
      data.market_benchmarks?.advice ||
      'Highlight authentic handmade craftsmanship and direct artisan provenance for premium marketplace pricing.',
  };

  const ICON_LOOKUP = {
    material: 'layers',
    technique: 'settings',
    craft: 'settings',
    dimension: 'maximize-2',
    fit: 'maximize-2',
    care: 'shield',
    preservation: 'shield',
    origin: 'map-pin',
    eco: 'leaf',
  };

  const rawSpecs = Array.isArray(data.specifications) ? data.specifications : [];
  const normalizedSpecs = rawSpecs.map((spec) => {
    if (typeof spec === 'string') {
      const colonIdx = spec.indexOf(':');
      let label = 'Specification';
      let value = spec;
      if (colonIdx !== -1) {
        label = spec.substring(0, colonIdx).trim();
        value = spec.substring(colonIdx + 1).trim();
      }
      const lower = label.toLowerCase();
      let icon = 'layers';
      for (const [k, ic] of Object.entries(ICON_LOOKUP)) {
        if (lower.includes(k)) {
          icon = ic;
          break;
        }
      }
      return {
        label,
        value,
        rawString: spec,
        icon,
      };
    }
    return {
      label: spec.label || 'Specification',
      value: spec.value || String(spec),
      rawString: `${spec.label}: ${spec.value}`,
      icon: spec.icon || 'layers',
    };
  });

  // Ensure exactly 4 specific tags derived from item
  let rawTags = Array.isArray(data.ondc_tags) ? data.ondc_tags : [];
  if (rawTags.length === 0) {
    const category = data.craft_category || 'Handicrafts';
    rawTags = [`Handcrafted ${category}`, `${category} Artisan Decor`, 'Traditional Indian Craft', 'Sustainable Handmade'];
  }
  const ondcTags = rawTags.slice(0, 4);
  while (ondcTags.length < 4) {
    ondcTags.push(`Authentic ${data.craft_category || 'Artisan Craft'}`);
  }

  return {
    title_en: data.title_en || 'Artisanal Handcrafted Heritage Creation',
    title_local: data.title_local || data.title_en || 'हस्तनिर्मित पारंपरिक कलाकृति',
    craft_category: data.craft_category || 'Handicrafts',
    story_en: data.story_en || '',
    story_local: data.story_local || '',
    specifications: normalizedSpecs,
    cost_breakdown: costBreakdown,
    market_benchmarks: marketBenchmarks,
    ondc_tags: ondcTags,
    rawNotes,
  };
}

/**
 * Main catalog generation function.
 * Ingests whatever image and description the user inputs and generates
 * authentic product title, craft category, authentic craft story, and 4 specific tags.
 */
export async function processCraftListing({
  userDescription,
  imageBase64,
  imageDataUrl,
  imageMimeType = 'image/jpeg',
  language = 'Hindi',
}) {
  const rawKey = getGeminiKey();
  const targetLanguage = LANG_MAP[language] || language || 'Hindi';
  const cleanDescription = (userDescription || '').trim() || 'Traditional Indian artisanal handcrafted creation';

  console.log('[KariDoot AI] Processing craft listing with Gemini API. Language:', targetLanguage);
  console.log('[KariDoot AI] User input notes:', cleanDescription);

  if (!rawKey) {
    console.warn('[KariDoot AI] Missing Gemini API key, utilizing dynamic artisan fallback...');
    return simulateDynamicFallback(cleanDescription, targetLanguage);
  }

  const prompt = `You are an expert e-commerce cataloguer, commercial copywriter, and Indian craft historian for traditional artisans under the PM Vishwakarma initiative.

Analyze the user's raw notes and the attached product image:
---
Raw Artisan Notes: '${cleanDescription}'
Target Language: ${targetLanguage}
---

CRITICAL INSTRUCTIONS:
1. Derive EVERY single detail strictly and dynamically from the actual item described in the notes and shown in the image (whether it is pottery, brass, woodwork, saree, blanket, leather, jewelry, or stone carving).
2. DO NOT return generic or hardcoded blanket or clay pot text if the user provided something else.
3. Return exactly 4 specific, highly relevant searchable tags in "ondc_tags".

Return ONLY a valid JSON object matching this schema (NO markdown wrappers, NO backticks):
{
  "title_en": "Professional, evocative, SEO-optimized title in English",
  "title_local": "Product title translated naturally into ${targetLanguage}",
  "craft_category": "Identified traditional craft discipline (e.g., Terracotta Pottery, Handloom Textiles, Dhokra Brasswork, Channapatna Woodcraft, Leathercraft)",
  "story_en": "A 3-4 sentence authentic, compelling heritage narrative: describe ancestral technique, tactile texture, artisan dedication, and modern home appeal.",
  "story_local": "The heritage narrative translated naturally into conversational ${targetLanguage}",
  "specifications": [
    "Material: [Extracted or professionally estimated from item]",
    "Craft Technique: [Specific traditional Indian technique inferred from item]",
    "Dimensions & Fit: [Realistic artisan sizing]",
    "Care & Preservation: [Authentic artisanal care instructions]"
  ],
  "cost_breakdown": {
    "material_cost": 280,
    "labour_cost": 450,
    "packaging_cost": 60,
    "logistics_cost": 120
  },
  "market_benchmarks": {
    "amazon_avg": 1650,
    "flipkart_avg": 1499,
    "ondc_avg": 1250,
    "market_verdict": "Sweet Spot",
    "advice": "Actionable 1-line commercial advice on why this handmade item can command premium pricing on Amazon Karigar & ONDC."
  },
  "ondc_tags": [
    "Specific Tag 1",
    "Specific Tag 2",
    "Specific Tag 3",
    "Specific Tag 4"
  ]
}`;

  // Prepare multimodal content parts
  const parts = [{ text: prompt }];

  // Extract base64 image if available
  let b64 = imageBase64;
  if (!b64 && imageDataUrl && imageDataUrl.startsWith('data:')) {
    b64 = imageDataUrl.split(',')[1];
  }

  if (b64) {
    const cleanB64 = b64.includes(',') ? b64.split(',')[1] : b64;
    parts.push({
      inlineData: {
        mimeType: imageMimeType || 'image/jpeg',
        data: cleanB64,
      },
    });
  }

  let lastError = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[KariDoot AI] Invoking Gemini model: ${modelName}...`);
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(rawKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const response = await model.generateContent(parts);
      const responseText = response.response.text();
      const sanitized = responseText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(sanitized);

      const normalized = normalizeCatalogResponse(parsed, cleanDescription);
      console.log(`[KariDoot AI] Successfully generated catalog with ${modelName}:`, normalized.title_en);
      return {
        success: true,
        data: normalized,
        source: 'gemini',
        model: modelName,
      };
    } catch (err) {
      console.warn(`[KariDoot AI] Model ${modelName} call failed:`, err.message);
      lastError = err;
    }
  }

  console.error('[KariDoot AI] All Gemini models failed. Engaging dynamic fallback:', lastError?.message);
  const fallback = await simulateDynamicFallback(cleanDescription, targetLanguage);
  return {
    ...fallback,
    source: 'dynamic-fallback',
    error: lastError?.message,
  };
}

/**
 * Backward-compatible adapter for existing calls.
 */
export async function analyzeArtisanCraft({
  imageBase64,
  imageMimeType,
  voiceText,
  dialect = 'hi',
}) {
  return processCraftListing({
    userDescription: voiceText,
    imageBase64,
    imageMimeType,
    language: dialect,
  });
}

// ─────────────────────────────────────────────────────────────
// REAL-WORLD MARKET INTELLIGENCE (AMAZON KARIGAR & FLIPKART)
// Calls Gemini Flash to identify realistic Indian market pricing
// ─────────────────────────────────────────────────────────────
export async function fetchLiveMarketBenchmarks({ title, craftCategory, baseCost = 300 }) {
  const rawKey = getGeminiKey();
  if (!rawKey) {
    return {
      amazon_avg: Math.round(baseCost * 2.1),
      flipkart_avg: Math.round(baseCost * 1.85),
      market_average: Math.round(baseCost * 1.95),
      advice: 'Highlight direct artisan lineage to command healthy D2C margins.',
    };
  }

  const prompt = `You are an Indian handicraft market intelligence analyst for Amazon Karigar and Flipkart Samarth.
Given this authentic Indian craft product:
Product Title: "${title || 'Handcrafted Artisan Craft'}"
Craft Category: "${craftCategory || 'Handicrafts'}"
Base Cost: ₹${baseCost}

Estimate current realistic average selling prices in INR for genuine handmade versions on Amazon India and Flipkart.
Return ONLY a valid JSON object matching this schema:
{
  "amazon_avg": number,
  "flipkart_avg": number,
  "market_average": number,
  "advice": "1 concise sentence explaining market range and margin opportunity"
}`;

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(rawKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const res = await model.generateContent(prompt);
    const text = res.response.text();
    const sanitized = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(sanitized);

    const amazonAvg = parsePrice(data.amazon_avg, Math.round(baseCost * 2.1));
    const flipkartAvg = parsePrice(data.flipkart_avg, Math.round(baseCost * 1.85));
    const marketAvg = parsePrice(data.market_average, Math.round((amazonAvg + flipkartAvg) / 2));

    return {
      amazon_avg: amazonAvg,
      flipkart_avg: flipkartAvg,
      market_average: marketAvg,
      advice: data.advice || 'Fair trade handmade provenance justifies healthy premium margins on Amazon Karigar.',
    };
  } catch (err) {
    console.warn('[KariDoot AI] Market benchmark fetch error:', err.message);
    return {
      amazon_avg: Math.round(baseCost * 2.1),
      flipkart_avg: Math.round(baseCost * 1.85),
      market_average: Math.round(baseCost * 1.95),
      advice: 'Fair trade handmade provenance justifies healthy premium margins on Amazon Karigar.',
    };
  }
}

// ─────────────────────────────────────────────────────────────
// DYNAMIC FALLBACK ENGINE
// Dynamically constructs title, category, story, and 4 specific tags from user's words
// NEVER returns hardcoded blanket or pot text.
// ─────────────────────────────────────────────────────────────
export function simulateDynamicFallback(userDescription = '', language = 'Hindi') {
  const text = (userDescription || '').trim();
  const lower = text.toLowerCase();

  // Keyword-based craft classifier
  let category = 'Artisanal Handicraft';
  let craftType = 'Heritage Creation';
  let material = 'Natural Authentic Raw Materials';
  let technique = 'Ancestral Manual Handcrafting';

  if (lower.includes('saree') || lower.includes('silk') || lower.includes('zari')) {
    category = 'Handloom & Traditional Textiles';
    craftType = 'Pure Handwoven Saree';
    material = 'Pure Mulberry Silk with Hand-Twisted Zari';
    technique = 'Traditional Jacquard Pitloom Hand-Weaving';
  } else if (lower.includes('blanket') || lower.includes('wool') || lower.includes('quilt') || lower.includes('stole') || lower.includes('shawl')) {
    category = 'Handloom & Woolen Textiles';
    craftType = 'Handwoven Thermal Blanket Throw';
    material = 'Natural Organic Wool & Cotton Blend';
    technique = 'Manual Loom Weaving with Hand-Stitched Selvedge';
  } else if (lower.includes('pot') || lower.includes('clay') || lower.includes('terracotta') || lower.includes('ceramic') || lower.includes('vase')) {
    category = 'Terracotta & Studio Ceramics';
    craftType = 'Handcrafted Terracotta Ceramic Piece';
    material = 'High-Grade Mineral Clay & Natural Glaze';
    technique = 'Potter Wheel-Thrown & Kiln Fired';
  } else if (lower.includes('brass') || lower.includes('metal') || lower.includes('diya') || lower.includes('copper') || lower.includes('bronze')) {
    category = 'Traditional Metalcraft';
    craftType = 'Hand-Cast Bell Brass Creation';
    material = 'Pure Bell Brass & Virgin Bronze Alloy';
    technique = 'Ancient Lost-Wax and Sand-Casting';
  } else if (lower.includes('wood') || lower.includes('toy') || lower.includes('carv') || lower.includes('teak')) {
    category = 'Artisan Woodcraft';
    craftType = 'Hand-Carved Natural Woodwork';
    material = 'Sustainably Sourced Hardwood & Natural Lacquer';
    technique = 'Hand-Chiseled Carving & Lathe Turning';
  } else if (lower.includes('leather') || lower.includes('bag') || lower.includes('shoe') || lower.includes('wallet')) {
    category = 'Artisan Leathercraft';
    craftType = 'Hand-Stitched Vegetable Tanned Leather Item';
    material = 'Full Grain Vegetable-Tanned Genuine Leather';
    technique = 'Hand-Saddle Stitching & Natural Oil Burnishing';
  } else if (lower.includes('jewel') || lower.includes('silver') || lower.includes('bead') || lower.includes('necklace')) {
    category = 'Tribal & Heritage Jewelry';
    craftType = 'Handcrafted Heritage Jewelry';
    material = 'Hypoallergenic Artisan Silver & Semiprecious Stones';
    technique = 'Traditional Filigree & Hand-Setting';
  }

  // Generate dynamic title from user's actual text
  const cleanTitleWord = text.length > 3 ? text.slice(0, 50).replace(/[^\w\s-]/g, '') : craftType;
  const title_en = `Artisanal ${cleanTitleWord.charAt(0).toUpperCase() + cleanTitleWord.slice(1)}`;

  const story_en = `Rooted in generations of Indian artisanal expertise, this ${craftType.toLowerCase()} is meticulously crafted from ${material.toLowerCase()}. Every contour reflects hours of patient handwork using ${technique.toLowerCase()}, ensuring remarkable durability and authentic cultural identity. Bringing this creation into your home supports the livelihood of master artisans under the PM Vishwakarma initiative.`;

  const ondc_tags = [
    `Handcrafted ${category.split(' ')[0]}`,
    `${craftType}`,
    'Indian Artisan Heritage',
    'Sustainable Handcrafted Decor',
  ];

  const craft = {
    title_en,
    title_local: `हस्तनिर्मित पारंपरिक ${craftType}`,
    craft_category: category,
    story_en,
    story_local: `पीढ़ियों की समृद्ध भारतीय विरासत से प्रेरित, यह उत्कृष्ट हस्तशिल्प पारंपरिक तकनीक और प्राकृतिक सामग्रियों से तैयार किया गया है।`,
    specifications: [
      `Material: ${material}`,
      `Craft Technique: ${technique}`,
      `Dimensions & Fit: Standard Artisan Size`,
      `Care & Preservation: Handle with care, clean with soft dry cloth`,
    ],
    cost_breakdown: {
      material_cost: 260,
      labour_cost: 400,
      packaging_cost: 50,
      logistics_cost: 110,
    },
    market_benchmarks: {
      amazon_avg: 1550,
      flipkart_avg: 1390,
      ondc_avg: 1180,
      market_verdict: 'Sweet Spot',
      advice: 'Direct artisan storytelling commands healthy consumer interest over mass-produced alternatives.',
    },
    ondc_tags,
  };

  const normalized = normalizeCatalogResponse(craft, userDescription);
  return Promise.resolve({ success: true, data: normalized, source: 'dynamic-synthesized' });
}

// ─────────────────────────────────────────────────────────────
// ONDC BECKN JSON
// ─────────────────────────────────────────────────────────────
export function generateOndcBecknJson(catalogData, pricingData, artisanProfile) {
  const sellingPrice = pricingData?.sellingPrice || 0;

  return {
    context: {
      domain: 'ONDC:RET10',
      country: 'IND',
      city: 'std:011',
      action: 'on_search',
      core_version: '1.2.0',
      bap_id: 'karidoot.ondc.network',
      bpp_id: `karidoot-artisan-${artisanProfile?.artisanId || 'kd001'}`,
      transaction_id: `kd-${Date.now()}`,
      message_id: `kd-msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    },
    message: {
      catalog: {
        'bpp/descriptor': {
          name: 'KariDoot AI Artisan Network',
          short_desc: 'Authentic Indian Handicrafts — Direct from Artisan',
          long_desc: catalogData?.story_en || '',
        },
        'bpp/providers': [
          {
            id: artisanProfile?.artisanId || 'kd-001',
            descriptor: { name: artisanProfile?.name || 'Artisan', short_desc: `${catalogData?.craft_category || 'Handicrafts'} Artisan` },
            items: [
              {
                id: `item-${Date.now()}`,
                descriptor: {
                  name: catalogData?.title_en || 'Artisan Craft',
                  short_desc: catalogData?.story_en?.substring(0, 120) || '',
                  long_desc: catalogData?.story_en || '',
                },
                price: { currency: 'INR', value: String(sellingPrice), maximum_value: String(Math.round(sellingPrice * 1.1)) },
                category_id: catalogData?.craft_category?.toLowerCase() || 'handicrafts',
                matched: true,
                tags: (catalogData?.ondc_tags || []).map((t) => ({ code: 'search_keyword', value: t })),
                '@ondc/org/returnable': false,
                '@ondc/org/cancellable': true,
                '@ondc/org/time_to_ship': 'PT72H',
              },
            ],
          },
        ],
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// CSV EXPORT
// ─────────────────────────────────────────────────────────────
export function generateEcommerceCsv(catalogData, pricingData, artisanProfile) {
  const sellingPrice = pricingData?.sellingPrice || 0;
  const mrp = Math.round(sellingPrice * 1.15);

  const headers = [
    'Item Name',
    'Brand',
    'Category',
    'Short Description',
    'Full Description',
    'MRP (INR)',
    'Selling Price (INR)',
    'Material',
    'Dimensions',
    'Technique',
    'Carbon Footprint',
    'Search Keywords',
    'Seller Name',
    'Seller Location',
    'Craft Category',
    'GI Tag',
    'ONDC Ready',
  ];
  const specs = catalogData?.specifications || [];
  const get = (label) => specs.find((s) => s.label?.toLowerCase().includes(label.toLowerCase()))?.value || '';
  const row = [
    catalogData?.title_en || 'Handcrafted Craft',
    'KariDoot Artisans',
    catalogData?.craft_category || 'Handicrafts',
    catalogData?.story_en?.substring(0, 150) || '',
    catalogData?.story_en || '',
    mrp,
    sellingPrice,
    get('Material'),
    get('Dimensions') || get('Fit'),
    get('Technique'),
    get('Carbon') || get('Care'),
    (catalogData?.ondc_tags || []).join(', '),
    artisanProfile?.name || 'Artisan',
    artisanProfile?.village || 'India',
    catalogData?.craft_category || 'Handicrafts',
    'Yes',
    'Yes',
  ];
  return [headers.join(','), row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')].join('\n');
}

// ─────────────────────────────────────────────────────────────
// WHATSAPP EXPORT
// ─────────────────────────────────────────────────────────────
export function generateWhatsAppMessage(catalogData, pricingData, artisanProfile, storeUrl) {
  const price = pricingData?.sellingPrice || 0;
  return encodeURIComponent(
    `🏺 *${catalogData?.title_en || 'Artisan Craft'}*\n` +
      `₹${price} · ${catalogData?.craft_category || 'Handmade'} Craft · Direct from Artisan\n\n` +
      `${catalogData?.story_en?.substring(0, 120) || ''}...\n\n` +
      `🛒 Order: ${storeUrl}\n` +
      `📞 ${artisanProfile?.name || 'Artisan'}: ${artisanProfile?.phone || ''}\n` +
      `💳 UPI: ${artisanProfile?.upi || ''}\n\n` +
      `_KariDoot AI · PM Vishwakarma Certified · Zero Middlemen_ 🌿`
  );
}
