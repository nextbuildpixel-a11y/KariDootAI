// KariDoot AI — AI Service (Craft-Tech Studio)
// Unified Multimodal Context Pipeline (AI Vision + Voice Transcript)
// Google Search Grounding for Amazon India, Flipkart & Etsy Market Intelligence
// Multilingual Translation Integrity (Hindi, Telugu, Tamil, Bengali, English)

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
// ─────────────────────────────────────────────────────────────
export function parsePrice(val, defaultVal = 0) {
  if (typeof val === 'number') return Math.round(val);
  if (!val) return defaultVal;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return !isNaN(num) && num > 0 ? Math.round(num) : defaultVal;
}

// ─────────────────────────────────────────────────────────────
// REALISTIC CATEGORY-AWARE BENCHMARK PRESETS (INDIAN MARKET)
// ─────────────────────────────────────────────────────────────
export const CATEGORY_COST_PRESETS = {
  pen: {
    category: 'Woodcraft & Stationery',
    keywords: ['pen', 'pens', 'stationery', 'ballpoint', 'fountain', 'quill', 'nib', 'writing'],
    material: 40,
    labour: 60,
    packaging: 15,
    logistics: 25,
    baseCost: 140,
    fairPrice: 210,
    retailBenchmark: 350,
  },
  blanket: {
    category: 'Handloom & Textiles',
    keywords: ['blanket', 'blankets', 'shawl', 'throw', 'wool', 'quilt', 'stole', 'handloom', 'knitted', 'bedding', 'textile', 'fabric', 'linen'],
    material: 800,
    labour: 600,
    packaging: 50,
    logistics: 150,
    baseCost: 1600,
    fairPrice: 2400,
    retailBenchmark: 3500,
  },
  pot: {
    category: 'Pottery & Clay (Terracotta Craft)',
    keywords: ['pot', 'pots', 'clay', 'terracotta', 'vase', 'surahi', 'ceramic', 'earthen', 'matka', 'pottery'],
    material: 50,
    labour: 90,
    packaging: 30,
    logistics: 50,
    baseCost: 220,
    fairPrice: 330,
    retailBenchmark: 500,
  },
  saree: {
    category: 'Handloom & Textiles',
    keywords: ['saree', 'silk', 'zari', 'dupatta', 'kantha', 'ikat'],
    material: 950,
    labour: 850,
    packaging: 60,
    logistics: 120,
    baseCost: 1980,
    fairPrice: 3000,
    retailBenchmark: 4500,
  },
  brass: {
    category: 'Traditional Metalcraft',
    keywords: ['brass', 'bronze', 'copper', 'diya', 'bell', 'dhokra', 'metal', 'sculpture'],
    material: 220,
    labour: 280,
    packaging: 40,
    logistics: 80,
    baseCost: 620,
    fairPrice: 950,
    retailBenchmark: 1450,
  },
  toy: {
    category: 'Woodcraft & Toys',
    keywords: ['toy', 'channapatna', 'spinning', 'lathe', 'doll', 'wooden toy'],
    material: 35,
    labour: 65,
    packaging: 20,
    logistics: 20,
    baseCost: 140,
    fairPrice: 220,
    retailBenchmark: 340,
  },
  jewelry: {
    category: 'Heritage Jewelry',
    keywords: ['jewel', 'silver', 'bead', 'filigree', 'necklace', 'earring'],
    material: 180,
    labour: 250,
    packaging: 30,
    logistics: 40,
    baseCost: 500,
    fairPrice: 780,
    retailBenchmark: 1200,
  },
  leather: {
    category: 'Artisan Leathercraft',
    keywords: ['leather', 'wallet', 'bag', 'tanned', 'saddle'],
    material: 240,
    labour: 320,
    packaging: 35,
    logistics: 65,
    baseCost: 660,
    fairPrice: 1020,
    retailBenchmark: 1600,
  },
};

export function getCategoryPreset(text = '') {
  const lower = String(text || '').toLowerCase();
  for (const key of Object.keys(CATEGORY_COST_PRESETS)) {
    const preset = CATEGORY_COST_PRESETS[key];
    if (preset.keywords.some((k) => lower.includes(k))) {
      return preset;
    }
  }
  // Default to Terracotta Craft baseline (Material: 50, Labour: 90, Packaging: 30, Logistics: 50 -> 220)
  return CATEGORY_COST_PRESETS.pot;
}

// ─────────────────────────────────────────────────────────────
// REGIONAL LANGUAGE MAP
// ─────────────────────────────────────────────────────────────
export const LANG_MAP = {
  hi: 'Hindi',
  te: 'Telugu',
  ta: 'Tamil',
  bn: 'Bengali',
  en: 'English',
  mr: 'Marathi',
  gu: 'Gujarati',
  kn: 'Kannada',
  ml: 'Malayalam',
  hindi: 'Hindi',
  telugu: 'Telugu',
  tamil: 'Tamil',
  bengali: 'Bengali',
  english: 'English',
};

// ─────────────────────────────────────────────────────────────
// ACCURATE MULTI-LANGUAGE SCRIPT DICTIONARY & FALLBACKS
// ─────────────────────────────────────────────────────────────
export const FALLBACK_TRANSLATIONS = {
  blanket: {
    hindi: {
      title: 'पारंपरिक हथकरघा कारीगर विरासत कंबल',
      story: 'हमारे पारंपरिक बुनकरों द्वारा पीढ़ियों की विरासत और कौशल से बुना गया यह प्रामाणिक हथकरघा कंबल अद्वितीय आराम और गर्मी प्रदान करता है। प्राकृतिक धागों से तैयार, यह उत्पाद भारतीय शिल्प कौशल का जीवंत उदाहरण है।',
    },
    telugu: {
      title: 'చేనేత పారంపర్య హస్తకళా దుప్పటి',
      story: 'మన సాంప్రదాయ చేనేత కార్మికులు ఎంతో నైపుణ్యంతో నేసిన అద్భుతమైన పారంపర్య దుప్పటి ఇది. సహజ దారాలతో తయారు చేయబడిన ఈ ఉత్పత్తి భారతీయ హస్తకళా వైభవానికి నిదర్శనం.',
    },
    tamil: {
      title: 'பாரம்பரிய கைத்தறி கைவினைப் போர்வை',
      story: 'எங்கள் பாரம்பரிய நெசவாளர்களால் தலைமுறை தலைமுறையாக வந்த கைவினைத் திறனோடு நெய்யப்பட்ட இந்த உண்மையான கைத்தறி போர்வை இணையற்ற கதகதப்பையும் ஆறுதலையும் தருகிறது. இயற்கை நூல்களால் உருவாக்கப்பட்ட இது இந்திய கைவினை பாரம்பரியத்தின் சிறந்த அடையாளம்.',
    },
    bengali: {
      title: 'ঐতিহ্যবাহী তাঁতের হস্তশিল্প কম্বল',
      story: 'আমাদের ঐতিহ্যবাহী তাঁতিদের দ্বারা প্রজন্মের পর প্রজন্ম ধরে চলে আসা দক্ষতায় বোনা এই খাঁটি তাঁতের কম্বল অতুলনীয় আরাম ও উষ্ণতা প্রদান করে। প্রাকৃতিক সুতো দিয়ে তৈরি এই পণ্যটি ভারতীয় হস্তশিল্পের এক অনন্য নিদর্শন।',
    },
    english: {
      title: 'Handwoven Traditional Artisan Heritage Blanket',
      story: 'Woven with generational mastery by our traditional master weavers, this authentic handloom heritage blanket offers unmatched warmth, tactile comfort, and organic luxury. Spun from pure natural fibers, it stands as a living celebration of authentic Indian artisanal excellence.',
    },
  },
  pen: {
    hindi: {
      title: 'हस्तनिर्मित शीशम व पीतल का लग्जरी पेन',
      story: 'कुशल कारीगरों द्वारा शीशम की पुनः प्राप्त लकड़ी और पीतल से खराद पर तैयार किया गया यह पेन भारतीय पारंपरिक काष्ठकला और आधुनिक सुंदरता का अनुपम संगम है।',
    },
    telugu: {
      title: 'చేతితో తయారుచేసిన రోజ్‌వుడ్ మరియు ఇత్తడి పెన్',
      story: 'శిక్షణ పొందిన కళాకారులు ఎంతో నేర్పుతో రోజ్‌వుడ్ చెక్క మరియు ఇత్తడితో మలిచిన అద్భుతమైన కలం ఇది. సున్నితమైన స్పర్శతో సహజ అందాన్ని అందిస్తుంది.',
    },
    tamil: {
      title: 'கைவினை ரோஸ்வுட் மற்றும் பித்தளை பேனா',
      story: 'பாரம்பரிய மரவேலைப்பாட்டு கலைஞர்களால் நேர்த்தியாக செதுக்கப்பட்ட ரோஸ்வுட் மற்றும் பித்தளை பேனா, எழுதும் அனுபவத்தை ஒரு கலையாக மாற்றுகிறது.',
    },
    bengali: {
      title: 'হস্তনির্মিত শীশম ও পিতলের রাজকীয় কলম',
      story: 'দক্ষ কারিগরদের হাতে নিখুঁতভাবে তৈরি এই কাঠের কলম ঐতিহ্যবাহী ভারতীয় কারুশিল্পের এক অনন্য নিদর্শন।',
    },
    english: {
      title: 'Handcrafted Rosewood & Brass Ballpoint Pen',
      story: 'Turned by hand on traditional lathes from reclaimed Indian rosewood and solid brass accents, this heirloom pen brings ancestral woodworking elegance to modern desks.',
    },
  },
  pot: {
    hindi: {
      title: 'पारंपरिक हस्तनिर्मित मिट्टी का सुराही घड़ा',
      story: 'राजस्थान के कुशल कुम्हारों द्वारा चाक पर ढली यह हस्तनिर्मित मिट्टी की सुराही प्राकृतिक रूप से पानी को शीतल और ताज़ा रखती है।',
    },
    telugu: {
      title: 'చేతితో చేసిన మట్టి సురాహి కుండ',
      story: 'నైపుణ్యం కలిగిన కుమ్మరులు చక్రంపై చేతితో రూపొందించిన ఈ సహజ మట్టి కుండ నీటిని సహజ సిద్ధంగా చల్లగా మరియు రుచికరంగా ఉంచుతుంది.',
    },
    tamil: {
      title: 'பாரம்பரிய சுடுமண் மண்பானை',
      story: 'பாரம்பரிய குயவர்களால் சக்கரத்தின் மீது வடிவமைக்கப்பட்ட இந்த சுடுமண் குவளை, தண்ணீரை இயற்கையாகவே குளிர்ச்சியாகவும் ஆரோக்கியமாகவும் வைத்திருக்கிறது.',
    },
    bengali: {
      title: 'ঐতিহ্যবাহী মাটির সুরাহি পাত্র',
      story: 'দক্ষ কুমোরদের হাতে চাকার ওপর তৈরি এই মাটির সুরাহি জলকে স্বাভাবিকভাবেই ঠান্ডা ও স্বাস্থ্যকর রাখে।',
    },
    english: {
      title: 'Hand-Thrown Terracotta Clay Water Pot',
      story: 'Shaped by hand on traditional potter\'s wheels from nutrient-rich alluvial red clay and kiln-fired, this terracotta pot cools water naturally through desert evaporative wisdom.',
    },
  },
};

/**
 * Generates an instant, complete multi-language translations dictionary
 * covering hindi, telugu, tamil, bengali, and english (with short & long keys).
 */
export function generateCatalogTranslations(
  itemContext = '',
  customTitleEn = '',
  customStoryEn = '',
  providedTranslations = null
) {
  const lower = String(itemContext || '').toLowerCase();

  let base = FALLBACK_TRANSLATIONS.blanket;
  if (/\b(pen|pens|ballpoint|fountain|quill|nib|stationery|woodcraft)\b/i.test(lower)) {
    base = FALLBACK_TRANSLATIONS.pen;
  } else if (/\b(pot|pots|clay|terracotta|vase|surahi|ceramic|earthen|matka|pottery)\b/i.test(lower)) {
    base = FALLBACK_TRANSLATIONS.pot;
  } else if (
    lower.includes('blanket') ||
    lower.includes('wool') ||
    lower.includes('quilt') ||
    lower.includes('shawl') ||
    lower.includes('stole') ||
    lower.includes('textile') ||
    lower.includes('fabric') ||
    lower.includes('handloom') ||
    lower.includes('bedding')
  ) {
    base = FALLBACK_TRANSLATIONS.blanket;
  }

  const result = {
    hindi: { ...base.hindi },
    hi: { ...base.hindi },
    telugu: { ...base.telugu },
    te: { ...base.telugu },
    tamil: { ...base.tamil },
    ta: { ...base.tamil },
    bengali: { ...base.bengali },
    bn: { ...base.bengali },
    english: {
      title: customTitleEn || base.english.title,
      story: customStoryEn || base.english.story,
    },
    en: {
      title: customTitleEn || base.english.title,
      story: customStoryEn || base.english.story,
    },
  };

  // Merge any provided translation overrides from Gemini API or user edits
  if (providedTranslations && typeof providedTranslations === 'object') {
    const pairs = [
      ['hindi', 'hi'],
      ['telugu', 'te'],
      ['tamil', 'ta'],
      ['bengali', 'bn'],
      ['english', 'en'],
    ];
    for (const [full, code] of pairs) {
      const src = providedTranslations[full] || providedTranslations[code];
      if (src && (src.title || src.story)) {
        const title = src.title || result[full].title;
        const story = src.story || result[full].story;
        result[full] = { title, story };
        result[code] = { title, story };
      }
    }
  }

  return result;
}

// Verified active Gemini models on v1beta API
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];

/**
 * Normalizes catalog response and guarantees:
 * - title_en & title_local
 * - category (and craft_category)
 * - story_en & story_local
 * - tags: array of exactly 4 bullet points (Material, Technique, Dimensions/Weight, Care instructions)
 * - specifications: structured array with icons
 * - realistic category-aware cost_breakdown
 */
function normalizeCatalogResponse(data, rawNotes, visualContext) {
  const combinedContext = `${data.craft_category || ''} ${data.category || ''} ${data.title_en || ''} ${rawNotes || ''} ${visualContext || ''}`;
  const preset = getCategoryPreset(combinedContext);

  const costBreakdown = {
    material_cost: parsePrice(data.cost_breakdown?.material_cost, preset.material),
    labour_cost: parsePrice(data.cost_breakdown?.labour_cost, preset.labour),
    packaging_cost: parsePrice(data.cost_breakdown?.packaging_cost, preset.packaging),
    logistics_cost: parsePrice(data.cost_breakdown?.logistics_cost, preset.logistics),
  };

  const baseCost =
    costBreakdown.material_cost +
    costBreakdown.labour_cost +
    costBreakdown.packaging_cost +
    costBreakdown.logistics_cost;

  const defaultRetail = preset.retailBenchmark || Math.round(baseCost * 1.85);

  const marketBenchmarks = {
    amazon_avg: parsePrice(data.market_benchmarks?.amazon_avg, Math.round(defaultRetail * 0.95)),
    flipkart_avg: parsePrice(data.market_benchmarks?.flipkart_avg, Math.round(defaultRetail * 0.88)),
    etsy_avg: parsePrice(data.market_benchmarks?.etsy_avg, Math.round(defaultRetail * 1.25)),
    grounded_market_price: parsePrice(
      data.market_benchmarks?.grounded_market_price || data.market_benchmarks?.market_average,
      defaultRetail
    ),
    market_verdict: data.market_benchmarks?.market_verdict || 'Sweet Spot',
    advice:
      data.market_benchmarks?.advice ||
      'Direct artisan provenance and handcrafted storytelling justify healthy margins on Amazon Karigar.',
  };

  // Extract or build exactly 4 bullet points: Material, Technique, Dimensions/Weight, Care
  let tags = [];
  if (Array.isArray(data.tags) && data.tags.length >= 4) {
    tags = data.tags.slice(0, 4);
  } else if (Array.isArray(data.specifications) && data.specifications.length >= 4) {
    tags = data.specifications.map((s) => (typeof s === 'string' ? s : `${s.label}: ${s.value}`)).slice(0, 4);
  } else {
    tags = [
      'Material: Handcrafted Natural Authentic Materials',
      'Technique: Ancestral Indian Artisanal Handcrafting',
      'Dimensions/Weight: Standard Artisan Ergonomic Sizing',
      'Care: Clean gently with a soft dry cloth; avoid moisture',
    ];
  }

  // Build structured specifications array with appropriate icons
  const ICON_LOOKUP = {
    material: 'layers',
    technique: 'settings',
    craft: 'settings',
    dimension: 'maximize-2',
    weight: 'maximize-2',
    fit: 'maximize-2',
    size: 'maximize-2',
    care: 'shield',
    preservation: 'shield',
  };

  const normalizedSpecs = tags.map((t) => {
    const colonIdx = t.indexOf(':');
    let label = 'Specification';
    let value = t;
    if (colonIdx !== -1) {
      label = t.substring(0, colonIdx).trim();
      value = t.substring(colonIdx + 1).trim();
    }
    const lower = label.toLowerCase();
    let icon = 'layers';
    for (const [k, ic] of Object.entries(ICON_LOOKUP)) {
      if (lower.includes(k)) {
        icon = ic;
        break;
      }
    }
    return { label, value, rawString: t, icon };
  });

  const category = data.category || data.craft_category || preset.category;
  const translations = generateCatalogTranslations(
    combinedContext,
    data.title_en,
    data.story_en,
    data.translations
  );

  return {
    title_en: data.title_en || translations.english.title,
    title_local: data.title_local || translations.hindi.title,
    category,
    craft_category: category,
    story_en: data.story_en || translations.english.story,
    story_local: data.story_local || translations.hindi.story,
    translations,
    tags,
    specifications: normalizedSpecs,
    cost_breakdown: costBreakdown,
    market_benchmarks: marketBenchmarks,
    ondc_tags: tags.map((t) => t.split(':')[1]?.trim() || t).slice(0, 4),
    rawNotes,
    visualContext,
  };
}

// ─────────────────────────────────────────────────────────────
// UNIFIED CONTEXT PIPELINE: VOICE + PHOTO VISION
// ─────────────────────────────────────────────────────────────
export async function processCraftListing({
  userDescription = '',
  visualDescription = '',
  imageBase64 = null,
  imageDataUrl = null,
  imageMimeType = 'image/jpeg',
  language = 'Hindi',
}) {
  const rawKey = getGeminiKey();
  const targetLanguage = LANG_MAP[language] || language || 'Hindi';
  const cleanDescription = (userDescription || '').trim();
  const cleanVisual = (visualDescription || '').trim();

  console.log('[KariDoot AI] Unified Context Pipeline:');
  console.log(' - User voice/notes:', cleanDescription || '(empty/brief)');
  console.log(' - AI Vision context:', cleanVisual || '(visual inspection active)');
  console.log(' - Target Language:', targetLanguage);

  if (!rawKey) {
    console.warn('[KariDoot AI] Missing Gemini API key, utilizing dynamic artisan fallback...');
    return simulateDynamicFallback(cleanDescription, cleanVisual, targetLanguage);
  }

  const prompt = `You are KariDoot AI — an expert e-commerce cataloguer, commercial copywriter, and Indian handicraft historian for traditional artisans under the PM Vishwakarma initiative.

You have TWO unified sources of multimodal context:
1. AI Vision Inspection of the uploaded photo:
"${cleanVisual || 'Handcrafted Indian artisan product'}"

2. Artisan Voice Transcript / Notes:
"${cleanDescription || 'Authentic traditional handmade craft'}"

Target Language for Translation: ${targetLanguage}

CRITICAL RULES:
1. UNIFIED CONTEXT: Combine BOTH the visual analysis of the product photo AND the artisan's voice transcript/notes. The catalog must dynamically adapt to whatever object is present (whether a pen, pot, blanket, saree, toy, brass lamp, leather wallet, jewelry, etc.).
2. NEVER use hardcoded blanket or pottery text if the photo or notes describe another item like a pen, toy, or brass piece.
3. INTELLIGENT VISION FILL-IN: If the user provides an incomplete note or brief voice greeting (e.g., "namaste", "ye pen hai"), use the AI vision inspection to intelligently fill in materials, technique, sizing, and craft story rather than defaulting to generic text.
4. RETURN ONLY VALID JSON with NO markdown wrappers or extra commentary.

SCHEMA (Valid JSON):
{
  "title_en": "Concise, commercial e-commerce product title in English (max 6-9 words)",
  "title_local": "Product title translated into natural ${targetLanguage}",
  "category": "Identified traditional craft discipline (e.g., 'Woodcraft & Stationery', 'Handloom & Textiles', 'Pottery & Clay', 'Traditional Metalcraft', 'Artisan Toys & Games')",
  "story_en": "Authentic, compelling 3-4 sentence heritage narrative: describe ancestral technique, tactile texture, artisan dedication, and modern home appeal.",
  "story_local": "The heritage narrative translated naturally into conversational ${targetLanguage}",
  "tags": [
    "Material: [Specific authentic raw materials]",
    "Technique: [Specific artisan handcrafted technique]",
    "Dimensions/Weight: [Realistic artisan sizing or weight]",
    "Care Instructions: [Authentic care instructions]"
  ],
  "cost_breakdown": {
    "material_cost": number,
    "labour_cost": number,
    "packaging_cost": number,
    "logistics_cost": number
  },
  "market_benchmarks": {
    "amazon_avg": number,
    "flipkart_avg": number,
    "etsy_avg": number,
    "grounded_market_price": number,
    "market_verdict": "Sweet Spot",
    "advice": "1 concise sentence explaining market range and margin opportunity"
  }
}`;

  const parts = [{ text: prompt }];

  // Attach base64 image if available
  let b64 = imageBase64;
  if (!b64 && imageDataUrl && imageDataUrl.startsWith('data:')) {
    b64 = imageDataUrl.split(',')[1];
  }
  if (b64) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType || 'image/jpeg',
        data: b64.includes(',') ? b64.split(',')[1] : b64,
      },
    });
  }

  let lastError = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[KariDoot AI] Invoking Gemini model ${modelName}...`);
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(rawKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const response = await model.generateContent(parts);
      const responseText = response.response.text();
      const sanitized = responseText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(sanitized);

      const normalized = normalizeCatalogResponse(parsed, cleanDescription, cleanVisual);
      console.log(`[KariDoot AI] Catalog generated successfully with ${modelName}:`, normalized.title_en);
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

  console.error('[KariDoot AI] Engaging dynamic synthesized fallback:', lastError?.message);
  const fallback = await simulateDynamicFallback(cleanDescription, cleanVisual, targetLanguage);
  return {
    ...fallback,
    source: 'dynamic-fallback',
    error: lastError?.message,
  };
}

export const analyzeArtisanCraft = processCraftListing;

// ─────────────────────────────────────────────────────────────
// REALISTIC MARKET BENCHMARK COMPARISON (AMAZON, FLIPKART, ETSY)
// Queries Gemini with Google Search Grounding with robust fallback
// ─────────────────────────────────────────────────────────────
export async function fetchLiveMarketBenchmarks({ title = '', craftCategory = '', baseCost = 240 }) {
  const rawKey = getGeminiKey();
  const preset = getCategoryPreset(`${craftCategory} ${title}`);
  const fallbackBenchmark = preset.retailBenchmark || Math.round(baseCost * 1.8);

  const defaultResult = {
    amazon_avg: Math.round(fallbackBenchmark * 0.95),
    flipkart_avg: Math.round(fallbackBenchmark * 0.88),
    etsy_avg: Math.round(fallbackBenchmark * 1.25),
    grounded_market_price: fallbackBenchmark,
    market_average: fallbackBenchmark,
    advice: 'Direct artisan storytelling commands healthy premium margins over mass-produced marketplace alternatives.',
  };

  if (!rawKey) return defaultResult;

  // 1. Attempt with Google Search Grounding via Gemini 3.6 Flash
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${rawKey}`;
    const searchPrompt = `You are an Indian handicraft market intelligence analyst for Amazon Karigar, Flipkart Samarth, and Etsy India.
Product: "${title || preset.category}"
Category: "${craftCategory || preset.category}"
Artisan Base Production Cost: ₹${baseCost}

Evaluate current realistic selling prices in INR for genuine handmade versions on Amazon India, Flipkart, and Etsy India.
Return ONLY valid JSON matching this schema:
{
  "amazon_avg": number,
  "flipkart_avg": number,
  "etsy_avg": number,
  "grounded_market_price": number,
  "advice": "1 concise sentence explaining market range and margin opportunity"
}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: searchPrompt }] }],
        tools: [{ googleSearch: {} }],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join(' ') || '';
      const cleanJson = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const amazonAvg = parsePrice(parsed.amazon_avg, defaultResult.amazon_avg);
      const flipkartAvg = parsePrice(parsed.flipkart_avg, defaultResult.flipkart_avg);
      const etsyAvg = parsePrice(parsed.etsy_avg, defaultResult.etsy_avg);
      const groundedPrice = parsePrice(
        parsed.grounded_market_price,
        Math.round((amazonAvg + flipkartAvg + etsyAvg) / 3)
      );

      return {
        amazon_avg: amazonAvg,
        flipkart_avg: flipkartAvg,
        etsy_avg: etsyAvg,
        grounded_market_price: groundedPrice,
        market_average: groundedPrice,
        advice: parsed.advice || defaultResult.advice,
      };
    }
  } catch (err) {
    console.warn('[KariDoot AI] Search Grounding note:', err.message);
  }

  // 2. Direct fast structured fallback with Gemini 3.6 Flash
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${rawKey}`;
    const directRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Return realistic Indian market selling prices in INR for genuine "${title || preset.category}": {"amazon_avg": number, "flipkart_avg": number, "etsy_avg": number, "grounded_market_price": number, "advice": string}`,
              },
            ],
          },
        ],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (directRes.ok) {
      const directData = await directRes.json();
      const directText = directData.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(directText);
      const amazonAvg = parsePrice(parsed.amazon_avg, defaultResult.amazon_avg);
      const flipkartAvg = parsePrice(parsed.flipkart_avg, defaultResult.flipkart_avg);
      const etsyAvg = parsePrice(parsed.etsy_avg, defaultResult.etsy_avg);
      const groundedPrice = parsePrice(
        parsed.grounded_market_price,
        Math.round((amazonAvg + flipkartAvg + etsyAvg) / 3)
      );

      return {
        amazon_avg: amazonAvg,
        flipkart_avg: flipkartAvg,
        etsy_avg: etsyAvg,
        grounded_market_price: groundedPrice,
        market_average: groundedPrice,
        advice: parsed.advice || defaultResult.advice,
      };
    }
  } catch (err) {
    console.warn('[KariDoot AI] Direct market query note:', err.message);
  }

  return defaultResult;
}

// ─────────────────────────────────────────────────────────────
// DYNAMIC SYNTHESIZED FALLBACK (ANY CRAFT ITEM)
// Dynamically constructs title, category, story, and 4 specific tags
// ─────────────────────────────────────────────────────────────
export function simulateDynamicFallback(userDescription = '', visualDescription = '', language = 'Hindi') {
  const combined = `${userDescription} ${visualDescription}`.trim();
  const lower = combined.toLowerCase();

  let category = 'Woodcraft & Stationery';
  let title_en = 'Handcrafted Rosewood & Brass Ballpoint Pen';
  let title_local = 'हस्तनिर्मित शीशम व पीतल का पेन';
  let material = 'Reclaimed Rosewood with Hand-Turned Brass Accents';
  let technique = 'Precision Hand-Lathe Turning & Natural Oil Burnishing';
  let dimensions = 'Length 14cm × Diameter 1.2cm, Weight 38g';
  let care = 'Wipe with soft microfiber cloth; refill with standard Parker-style cartridge';

  if (
    lower.includes('pen') ||
    lower.includes('stationery') ||
    lower.includes('ballpoint') ||
    lower.includes('quill') ||
    lower.includes('nib')
  ) {
    category = 'Woodcraft & Stationery';
    title_en = 'Handcrafted Rosewood & Brass Ballpoint Pen';
    title_local = 'हस्तनिर्मित शीशम व पीतल का पेन';
    material = 'Reclaimed Rosewood with Hand-Turned Brass Accents';
    technique = 'Precision Hand-Lathe Turning & Natural Oil Burnishing';
    dimensions = 'Length 14cm × Diameter 1.2cm, Weight 38g';
    care = 'Wipe with soft microfiber cloth; refill with standard Parker-style cartridge';
  } else if (
    lower.includes('blanket') ||
    lower.includes('wool') ||
    lower.includes('quilt') ||
    lower.includes('shawl') ||
    lower.includes('stole')
  ) {
    category = 'Handloom & Textiles';
    title_en = 'Handwoven Thermal Wool Heritage Blanket';
    title_local = 'हस्तनिर्मित कश्मीरी ऊनी कंबल';
    material = 'Organic Mountain Wool & Hand-Spun Cotton Blend';
    technique = 'Pitloom Manual Weaving with Hand-Knotted Selvedge';
    dimensions = '60 × 90 inches, Weight 1.4kg';
    care = 'Gentle hand wash in cold water with mild wool detergent. Dry flat in shade.';
  } else if (
    lower.includes('pot') ||
    lower.includes('clay') ||
    lower.includes('terracotta') ||
    lower.includes('ceramic') ||
    lower.includes('vase') ||
    lower.includes('surahi')
  ) {
    category = 'Pottery & Clay';
    title_en = 'Hand-Thrown Terracotta Clay Water Pot';
    title_local = 'हस्तनिर्मित मिट्टी का पारंपरिक सुराही घड़ा';
    material = 'Natural Alluvial River Clay & Organic Mineral Glaze';
    technique = "Traditional Potter's Wheel Hand-Throwing & Wood Kiln Firing at 850°C";
    dimensions = 'Height 26cm × Diameter 18cm, Capacity 2.2L';
    care = 'Rinse with fresh water before initial use. Hand wash without chemical detergents.';
  } else if (
    lower.includes('brass') ||
    lower.includes('metal') ||
    lower.includes('diya') ||
    lower.includes('copper') ||
    lower.includes('bronze')
  ) {
    category = 'Traditional Metalcraft';
    title_en = 'Hand-Cast Bell Brass Temple Diya';
    title_local = 'हस्तनिर्मित पीतल का पारंपरिक दीपक';
    material = 'Pure Virgin Bell Brass & Bronze Alloy';
    technique = 'Lost-Wax Dhokra Casting & Hand-Chiseled Detailing';
    dimensions = 'Height 12cm × Diameter 9cm, Weight 380g';
    care = 'Clean with natural pitambari powder or lemon rind; wipe dry to preserve luster';
  } else if (
    lower.includes('toy') ||
    lower.includes('channapatna') ||
    lower.includes('spinning')
  ) {
    category = 'Woodcraft & Toys';
    title_en = 'Channapatna Hand-Turned Natural Wooden Toy';
    title_local = 'चन्नपटना हस्तनिर्मित लकड़ी का पारंपरिक खिलौना';
    material = 'Hale Mara (Ivory Wood) & Non-Toxic Organic Vegetable Lacquer';
    technique = 'Traditional Lathe Turning & Friction Lacquer Application';
    dimensions = 'Height 10cm × Diameter 6cm, Weight 90g';
    care = 'BIS-certified child safe. Wipe clean with damp cloth; keep away from excessive moisture.';
  } else if (
    lower.includes('saree') ||
    lower.includes('silk') ||
    lower.includes('zari')
  ) {
    category = 'Handloom & Textiles';
    title_en = 'Handcrafted Pure Mulberry Silk Saree';
    title_local = 'पारंपरिक हस्तनिर्मित शुद्ध रेशम साड़ी';
    material = 'Pure Mulberry Silk with Hand-Twisted Zari';
    technique = 'Traditional Jacquard Pitloom Hand-Weaving';
    dimensions = 'Length 6.3m (including blouse piece), Weight 550g';
    care = 'Dry clean only. Store wrapped in pure cotton muslin cloth.';
  }

  const tags = [
    `Material: ${material}`,
    `Technique: ${technique}`,
    `Dimensions/Weight: ${dimensions}`,
    `Care Instructions: ${care}`,
  ];

  const story_en = `Rooted in generations of Indian artisanal mastery, this authentic ${title_en.toLowerCase()} is meticulously crafted from ${material.toLowerCase()}. Every detail reflects hours of patient handwork using ${technique.toLowerCase()}, ensuring lasting durability and authentic cultural identity. Bringing this creation into your home directly supports master artisans under the PM Vishwakarma initiative.`;

  const story_local = `पीढ़ियों की समृद्ध भारतीय विरासत से प्रेरित, यह उत्कृष्ट हस्तशिल्प पारंपरिक ${technique} तकनीक और ${material} से तैयार किया गया है। इसे अपने घर में लाना सीधे तौर पर पीएम विश्वकर्मा योजना के तहत मास्टर कारीगरों की आजीविका को सशक्त बनाता है।`;

  const craft = {
    title_en,
    title_local,
    category,
    craft_category: category,
    story_en,
    story_local,
    tags,
  };

  const normalized = normalizeCatalogResponse(craft, userDescription, visualDescription);
  return Promise.resolve({ success: true, data: normalized, source: 'dynamic-synthesized' });
}

// ─────────────────────────────────────────────────────────────
// ONDC BECKN JSON EXPORTER
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
                tags: (catalogData?.tags || []).map((t) => ({ code: 'attribute', value: t })),
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
    'Tags',
    'Seller Name',
    'Seller Location',
    'GI Tag',
    'ONDC Ready',
  ];
  const tagsStr = (catalogData?.tags || []).join('; ');
  const row = [
    catalogData?.title_en || 'Handcrafted Craft',
    'KariDoot Artisans',
    catalogData?.craft_category || catalogData?.category || 'Handicrafts',
    catalogData?.story_en?.substring(0, 150) || '',
    catalogData?.story_en || '',
    mrp,
    sellingPrice,
    tagsStr,
    artisanProfile?.name || 'Artisan',
    artisanProfile?.village || 'India',
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
      `₹${price} · ${catalogData?.craft_category || catalogData?.category || 'Handmade'} Craft · Direct from Artisan\n\n` +
      `${catalogData?.story_en?.substring(0, 120) || ''}...\n\n` +
      `🛒 Order: ${storeUrl}\n` +
      `📞 ${artisanProfile?.name || 'Artisan'}: ${artisanProfile?.phone || ''}\n` +
      `💳 UPI: ${artisanProfile?.upi || ''}\n\n` +
      `_KariDoot AI · PM Vishwakarma Certified · Zero Middlemen_ 🌿`
  );
}
