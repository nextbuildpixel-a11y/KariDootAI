// KariDoot AI — Mock Artisan Data for Offline/Demo Mode
// Realistic pre-loaded handicraft data for Terracotta Pot, Channapatna Toy, Handloom Stole

export const MOCK_PRODUCTS = {
  terracottaPot: {
    title_en: "Terracotta Clay Water Pot",
    title_local: "मिट्टी का सुराही",
    craft_category: "Terracotta",
    story_en:
      "Crafted by skilled potters of Rajasthan, this hand-thrown terracotta surai embodies centuries of Bhavani tradition. Each pot is shaped on a spinning wheel from locally sourced red clay, sun-dried for three days, then fired in a wood kiln at 900°C. The natural mineral deposits in the clay give it a unique cooling property, keeping water 8–10°C cooler than ambient temperature — a timeless desert wisdom.",
    story_local:
      "राजस्थान के कुशल कुम्हारों द्वारा निर्मित यह हस्तनिर्मित मिट्टी की सुराही भवानी परंपरा की सदियों पुरानी धरोहर को दर्शाती है। स्थानीय लाल मिट्टी से बनाई गई इस सुराही को तीन दिन धूप में सुखाया जाता है और फिर 900°C पर लकड़ी के भट्टे में पकाया जाता है।",
    specifications: [
      { label: "Material", label_local: "सामग्री", value: "Red Alluvial Clay, Natural Mineral Glaze", icon: "layers" },
      { label: "Dimensions", label_local: "आकार", value: "Height 28cm × Diameter 18cm, Capacity 2L", icon: "maximize-2" },
      { label: "Technique", label_local: "तकनीक", value: "Wheel-Thrown, Wood-Kiln Fired at 900°C", icon: "settings" },
      { label: "Care", label_local: "देखभाल", value: "Rinse before first use. Do not freeze. Hand wash only.", icon: "shield" },
    ],
    cost_breakdown: {
      material_cost: 45,
      labour_cost: 80,
      packaging_cost: 15,
      logistics_cost: 25,
    },
    market_benchmarks: {
      amazon_avg: 320,
      flipkart_avg: 285,
      ondc_avg: 260,
      market_verdict: "Sweet Spot",
      advice: "Price at ₹249–₹279 for fast ONDC orders. Your authentic story adds premium value on Amazon Karigar.",
    },
    ondc_tags: ["terracotta pot", "clay surai", "handmade rajasthan", "natural water cooler", "eco pottery"],
    artisanId: "artisan-rajasthan-001",
  },

  channapatnaToy: {
    title_en: "Channapatna Wooden Spinning Top",
    title_local: "ಚನ್ನಪಟ್ಟಣ ಬೊಂಬೆ ಲಾಟು",
    craft_category: "Woodcraft",
    story_en:
      "The Channapatna toy tradition, known as 'Gombe Ramanagara', dates back to the reign of Tipu Sultan who brought Persian craftsmen to Karnataka in the 18th century. These spinning tops are hand-turned on traditional lathes from soft Ivory Wood (Hale Mara), then lacquered with plant-based dyes — non-toxic and BIS-certified safe for children. Each toy carries the GI Tag of Karnataka.",
    story_local:
      "ಚನ್ನಪಟ್ಟಣದ ಬೊಂಬೆ ಪರಂಪರೆ, 'ಗೊಂಬೆ ರಾಮನಗರ' ಎಂದು ಕರೆಯಲ್ಪಡುತ್ತದೆ, ಇದು 18ನೇ ಶತಮಾನದಲ್ಲಿ ಟಿಪ್ಪು ಸುಲ್ತಾನ್ ಕಾಲದಿಂದ ಬಂದಿದೆ. ಸಾಂಪ್ರದಾಯಿಕ ಮರಗೆಲಸದ ಮೂಲಕ ತಯಾರಿಸಿದ ಈ ಲಾಟು ಸಸ್ಯ-ಆಧಾರಿತ ಬಣ್ಣಗಳಿಂದ ಲ್ಯಾಕರ್ ಮಾಡಲಾಗಿದೆ.",
    specifications: [
      { label: "Material", label_local: "ಸಾಮಗ್ರಿ", value: "Ivory Wood (Wrightia tinctoria), Plant-Based Lacquer", icon: "layers" },
      { label: "Dimensions", label_local: "ಗಾತ್ರ", value: "Height 6cm × Diameter 5cm, Weight 45g", icon: "maximize-2" },
      { label: "Technique", label_local: "ತಂತ್ರ", value: "Hand-Turned Lathe, Traditional Lacquerware", icon: "settings" },
      { label: "Care", label_local: "ಆರೈಕೆ", value: "BIS Certified. Non-toxic. Age 3+. Wipe with dry cloth.", icon: "shield" },
    ],
    cost_breakdown: {
      material_cost: 30,
      labour_cost: 60,
      packaging_cost: 20,
      logistics_cost: 15,
    },
    market_benchmarks: {
      amazon_avg: 199,
      flipkart_avg: 179,
      ondc_avg: 159,
      market_verdict: "Premium Viable",
      advice: "Your GI Tag is a strong differentiator. Price at ₹189–₹219 and highlight BIS certification for parent buyers.",
    },
    ondc_tags: ["channapatna toy", "wooden top", "GI tag karnataka", "eco child toy", "lathe craft"],
    artisanId: "artisan-karnataka-002",
  },

  handloomStole: {
    title_en: "Handloom Kantha Embroidery Silk Stole",
    title_local: "হাতে বোনা কাঁথা রেশমের শাল",
    craft_category: "Handloom",
    story_en:
      "Woven by the women weavers of Murshidabad, West Bengal, this Kantha stole embodies the 'running stitch' tradition passed down through generations of Bengali artisans. Pure Murshidabad silk threads are handwoven on pit looms, then embroidered with the iconic Kantha motifs — lotus, peacock, and paisley — using natural indigo and madder dyes. Each stole takes 4–6 days to complete.",
    story_local:
      "মুর্শিদাবাদের মহিলা তাঁতিদের দ্বারা বোনা এই কাঁথার শাল বাংলার ঐতিহ্যবাহী 'রানিং স্টিচ' শিল্পকলার প্রতীক। বিশুদ্ধ মুর্শিদাবাদ রেশমের সুতো দিয়ে গর্তের তাঁতে হাতে বোনা এবং প্রাকৃতিক নীল ও মজ্ঞিষ্ঠা রঞ্জক দিয়ে সূচিকর্ম করা।",
    specifications: [
      { label: "Material", label_local: "উপাদান", value: "100% Pure Murshidabad Silk, Natural Dyes", icon: "layers" },
      { label: "Dimensions", label_local: "মাপ", value: "200cm × 60cm, Weight 180g", icon: "maximize-2" },
      { label: "Technique", label_local: "কৌশল", value: "Pit Loom Handwoven + Kantha Running Stitch Embroidery", icon: "settings" },
      { label: "Care", label_local: "যত্ন", value: "Dry clean only. Store in muslin. Avoid direct sunlight.", icon: "shield" },
    ],
    cost_breakdown: {
      material_cost: 280,
      labour_cost: 350,
      packaging_cost: 40,
      logistics_cost: 50,
    },
    market_benchmarks: {
      amazon_avg: 1800,
      flipkart_avg: 1600,
      ondc_avg: 1450,
      market_verdict: "Premium Segment",
      advice: "Price at ₹1599–₹1799. Emphasize 4–6 day handcraft time and natural dyes for premium Etsy-style buyers.",
    },
    ondc_tags: ["kantha stole", "handloom silk", "murshidabad weave", "natural dye dupatta", "GI bengal craft"],
    artisanId: "artisan-westbengal-003",
  },
};

export const DEFAULT_MOCK = MOCK_PRODUCTS.terracottaPot;

export const ARTISAN_PROFILES = {
  "artisan-rajasthan-001": {
    name: "Ramesh Kumhar",
    name_local: "रमेश कुम्हार",
    village: "Molela, Rajasthan",
    phone: "+91-9876543210",
    upi: "rameshkumhar@upi",
    whatsapp: "919876543210",
    craft: "Terracotta",
    experience_years: 23,
    certified: true,
  },
  "artisan-karnataka-002": {
    name: "Lakshmi Shilpkar",
    name_local: "ಲಕ್ಷ್ಮಿ ಶಿಲ್ಪಕಾರ್",
    village: "Channapatna, Karnataka",
    phone: "+91-9765432100",
    upi: "lakshmi.channapatna@upi",
    whatsapp: "919765432100",
    craft: "Woodcraft",
    experience_years: 18,
    certified: true,
  },
  "artisan-westbengal-003": {
    name: "Sushma Devi",
    name_local: "সুষমা দেবী",
    village: "Murshidabad, West Bengal",
    phone: "+91-9654321000",
    upi: "sushma.weaver@upi",
    whatsapp: "919654321000",
    craft: "Handloom",
    experience_years: 31,
    certified: true,
  },
};

export const DIALECTS = [
  { code: "hi", label: "हिन्दी", name: "Hindi" },
  { code: "te", label: "తెలుగు", name: "Telugu" },
  { code: "ta", label: "தமிழ்", name: "Tamil" },
  { code: "bn", label: "বাংলা", name: "Bengali" },
  { code: "en", label: "English", name: "English" },
];

export const VOICE_INSTRUCTIONS = {
  hi: {
    step1: "नमस्ते! अपने सामान की फ़ोटो लेने के लिए इस कैमरे के बटन को दबाएं।",
    step2: "अब माइक्रोफोन दबाएं और अपने हस्तशिल्प की कहानी बताएं।",
    step3: "आपका कैटलॉग तैयार है! जांचें और ज़रूरी बदलाव करें।",
    step4: "अपनी सामग्री की लागत भरें और उचित मुनाफ़ा तय करें।",
    step5: "बधाई हो! अपना सामान ऑनलाइन बाज़ार में बेचने के लिए तैयार है।",
  },
  te: {
    step1: "నమస్కారం! మీ వస్తువు ఫోటో తీయడానికి కెమెరా బటన్ను నొక్కండి.",
    step2: "ఇప్పుడు మైక్రోఫోన్ నొక్కి మీ హస్తకళ కథను చెప్పండి.",
    step3: "మీ కేటలాగ్ సిద్ధంగా ఉంది! తనిఖీ చేసి అవసరమైన మార్పులు చేయండి.",
    step4: "మీ సామగ్రి ఖర్చు నమోదు చేసి న్యాయమైన లాభాన్ని నిర్ణయించండి.",
    step5: "అభినందనలు! మీ వస్తువు ఆన్‌లైన్ మార్కెట్‌లో అమ్మడానికి సిద్ధంగా ఉంది.",
  },
  ta: {
    step1: "வணக்கம்! உங்கள் பொருளின் புகைப்படம் எடுக்க கேமரா பொத்தானை அழுத்தவும்.",
    step2: "இப்போது மைக்ரோஃபோன் அழுத்தி உங்கள் கைவினைப் கதையை சொல்லுங்கள்.",
    step3: "உங்கள் கேட்டலாக் தயார்! சரிபார்த்து தேவையான மாற்றங்கள் செய்யுங்கள்.",
    step4: "உங்கள் பொருட்கள் செலவை பதிவு செய்து நியாயமான லாபத்தை தீர்மானிக்கவும்.",
    step5: "வாழ்த்துக்கள்! உங்கள் பொருள் ஆன்லைன் சந்தையில் விற்க தயாராகிவிட்டது.",
  },
  bn: {
    step1: "নমস্কার! আপনার পণ্যের ছবি তুলতে ক্যামেরা বোতামটি চাপুন।",
    step2: "এখন মাইক্রোফোন চাপুন এবং আপনার হস্তশিল্পের গল্প বলুন।",
    step3: "আপনার ক্যাটালগ প্রস্তুত! পরীক্ষা করুন এবং প্রয়োজনীয় পরিবর্তন করুন।",
    step4: "আপনার উপকরণের খরচ লিখুন এবং ন্যায্য মুনাফা নির্ধারণ করুন।",
    step5: "অভিনন্দন! আপনার পণ্য অনলাইন বাজারে বিক্রির জন্য প্রস্তুত।",
  },
  en: {
    step1: "Hello! Press the camera button to take a photo of your craft item.",
    step2: "Now press the microphone and tell the story of your handicraft.",
    step3: "Your catalog is ready! Review and make any necessary changes.",
    step4: "Enter your material costs and set a fair profit margin.",
    step5: "Congratulations! Your product is ready to sell in the online marketplace.",
  },
};
