// KariDoot AI · Agentic AI Co-Pilot ("AI Sahayak")
// Features:
// 1. Floating trigger button ("🎙️ AI Sahayak / Assistant") accessible on all 5 wizard steps.
// 2. Interactive Voice (Web Speech API STT) + Text Dual Input (English + Regional Dialects).
// 3. Informational Q&A: PM Vishwakarma benefits, Win-Win pricing logic, ONDC onboarding.
// 4. Agentic Action Execution with Mandatory User Consent Cards:
//    - NAVIGATE_STEP(stepNumber)
//    - UPDATE_COST(field, amount)
//    - SET_MARGIN(percentage)
//    - REGENERATE_CATALOG()

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  X,
  Check,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Sliders,
  DollarSign,
  Layers,
  ArrowRight,
  RotateCcw,
  Volume2,
  Bot,
  User,
} from 'lucide-react';
import { getGeminiKey } from '../services/aiService';

const SUGGESTED_QUERIES = [
  'Change my labour cost to 600 rupees',
  'Set profit margin to 70%',
  'What are PM Vishwakarma scheme benefits?',
  'How does Win-Win fair pricing work?',
  'Take me to the photo step',
  'Take me to Step 4 (Pricing)',
];

export default function AIAssistant({
  currentStep = 1,
  dialect = 'hi',
  pricingData,
  catalogData,
  onNavigateStep,
  onUpdateCost,
  onSetMargin,
  onRegenerateCatalog,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Namaste! I am your KariDoot AI Sahayak. Speak or type to ask about PM Vishwakarma scheme benefits, fair pricing logic, or give me direct instructions like "Change labour cost to ₹600" or "Go to photo step".',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const appendMessage = (text, sender = 'ai') => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${sender}-${Date.now()}`,
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = dialect === 'hi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('');
        setInputVal(transcript);
      };

      rec.onerror = (e) => {
        console.warn('[AI Sahayak Voice]', e.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, [dialect]);

  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = dialect === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (err) {
        console.warn('[AI Sahayak] Speech start error:', err);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // INTENT & ACTION DETECTION ENGINE
  // ─────────────────────────────────────────────────────────────
  const analyzeQuery = (query) => {
    const q = query.trim().toLowerCase();

    // 1. Action: Labour Cost Update
    const labourMatch =
      q.match(/labou?r.*?(?:to|as|is|cost)?\s*₹?\s*(\d+)/i) ||
      q.match(/(\d+)\s*(?:rupees?|rs|₹)?\s*(?:for|in)?\s*labou?r/i) ||
      q.match(/(?:मजदूरी|लेबर).*?(?:₹)?\s*(\d+)/i);
    if (labourMatch) {
      const amt = Number(labourMatch[1]);
      return {
        type: 'action',
        actionType: 'UPDATE_COST',
        field: 'labour',
        amount: amt,
        fieldLabel: 'Artisan Labour Cost',
        description: `Update Artisan Labour Cost to ₹${amt}`,
        confirmText: `I can update your Artisan Labour cost to ₹${amt}. Would you like me to apply this?`,
      };
    }

    // 2. Action: Material Cost Update
    const materialMatch =
      q.match(/material.*?(?:to|as|is|cost)?\s*₹?\s*(\d+)/i) ||
      q.match(/(\d+)\s*(?:rupees?|rs|₹)?\s*(?:for|in)?\s*material/i) ||
      q.match(/(?:सामग्री|कच्चा माल).*?(?:₹)?\s*(\d+)/i);
    if (materialMatch) {
      const amt = Number(materialMatch[1]);
      return {
        type: 'action',
        actionType: 'UPDATE_COST',
        field: 'material',
        amount: amt,
        fieldLabel: 'Raw Material Cost',
        description: `Update Raw Material Cost to ₹${amt}`,
        confirmText: `I can update your Raw Material cost to ₹${amt}. Would you like me to apply this?`,
      };
    }

    // 3. Action: Packaging Cost Update
    const packMatch =
      q.match(/packag(?:ing|e).*?(?:to|as|is|cost)?\s*₹?\s*(\d+)/i) ||
      q.match(/(\d+)\s*(?:rupees?|rs|₹)?\s*(?:for|in)?\s*packag/i) ||
      q.match(/(?:पैकिंग|पैकेजिंग).*?(?:₹)?\s*(\d+)/i);
    if (packMatch) {
      const amt = Number(packMatch[1]);
      return {
        type: 'action',
        actionType: 'UPDATE_COST',
        field: 'packaging',
        amount: amt,
        fieldLabel: 'Eco-Packaging Cost',
        description: `Update Eco-Packaging Cost to ₹${amt}`,
        confirmText: `I can update your Eco-Packaging cost to ₹${amt}. Would you like me to apply this?`,
      };
    }

    // 4. Action: Logistics / Shipping Cost Update
    const logMatch =
      q.match(/(?:logistic|shipping|delivery|transport).*?(?:to|as|is|cost)?\s*₹?\s*(\d+)/i) ||
      q.match(/(\d+)\s*(?:rupees?|rs|₹)?\s*(?:for|in)?\s*(?:logistic|shipping)/i) ||
      q.match(/(?:लॉजिस्टिक्स|डिलीवरी|शिपिंग).*?(?:₹)?\s*(\d+)/i);
    if (logMatch) {
      const amt = Number(logMatch[1]);
      return {
        type: 'action',
        actionType: 'UPDATE_COST',
        field: 'logistics',
        amount: amt,
        fieldLabel: 'Safe Logistics Cost',
        description: `Update Logistics & Shipping Cost to ₹${amt}`,
        confirmText: `I can update your Safe Logistics cost to ₹${amt}. Would you like me to apply this?`,
      };
    }

    // 5. Action: Profit Margin Slider Update
    const marginMatch =
      q.match(/margin.*?(?:to|as|is)?\s*(\d+)\s*%?/i) ||
      q.match(/(\d+)\s*%\s*margin/i) ||
      q.match(/(?:मार्जिन|मुनाफा).*?(\d+)/i);
    if (marginMatch) {
      const pct = Number(marginMatch[1]);
      return {
        type: 'action',
        actionType: 'SET_MARGIN',
        percentage: pct,
        description: `Adjust Artisan Profit Margin slider to ${pct}%`,
        confirmText: `I can set your guaranteed Artisan Profit Margin to ${pct}%. Would you like me to apply this?`,
      };
    }

    // 6. Action: Navigation to Step 1 (Photo Studio)
    if (
      q.includes('photo') ||
      q.includes('studio') ||
      q.includes('step 1') ||
      q.includes('camera') ||
      q.includes('फोटो')
    ) {
      return {
        type: 'action',
        actionType: 'NAVIGATE_STEP',
        step: 1,
        description: 'Navigate to Step 1: E-Commerce AI Photo Studio',
        confirmText: 'I can navigate you directly to Step 1 (E-Commerce AI Photo Studio). Shall I take you there?',
      };
    }

    // 7. Action: Navigation to Step 2 (Voice Catalog)
    if (
      (q.includes('catalog') && !q.includes('regenerate')) ||
      q.includes('voice') ||
      q.includes('step 2') ||
      q.includes('कैटलॉग')
    ) {
      return {
        type: 'action',
        actionType: 'NAVIGATE_STEP',
        step: 2,
        description: 'Navigate to Step 2: Voice-First Story & Catalog',
        confirmText: 'I can navigate you to Step 2 (Voice-First Craft Storytelling). Would you like to go there?',
      };
    }

    // 8. Action: Navigation to Step 3 (Spec HUD)
    if (
      q.includes('spec') ||
      q.includes('review') ||
      q.includes('step 3') ||
      q.includes('refine')
    ) {
      return {
        type: 'action',
        actionType: 'NAVIGATE_STEP',
        step: 3,
        description: 'Navigate to Step 3: Spec & Story HUD',
        confirmText: 'I can jump to Step 3 (Specification Review & Refine HUD). Would you like me to proceed?',
      };
    }

    // 9. Action: Navigation to Step 4 (Pricing)
    if (
      q.includes('pricing') ||
      q.includes('price') ||
      q.includes('step 4') ||
      q.includes('मूल्य')
    ) {
      return {
        type: 'action',
        actionType: 'NAVIGATE_STEP',
        step: 4,
        description: 'Navigate to Step 4: Win-Win Fair Pricing Engine',
        confirmText: 'I can take you to Step 4 (Win-Win Fair Pricing Engine). Would you like me to proceed?',
      };
    }

    // 10. Action: Navigation to Step 5 (Launchpad)
    if (
      q.includes('omnichannel') ||
      q.includes('launch') ||
      q.includes('step 5') ||
      q.includes('hub') ||
      q.includes('export')
    ) {
      return {
        type: 'action',
        actionType: 'NAVIGATE_STEP',
        step: 5,
        description: 'Navigate to Step 5: Omnichannel Marketplace Hub',
        confirmText: 'I can take you to Step 5 (Omnichannel Marketplace Launchpad). Shall I open it?',
      };
    }

    // 11. Action: Regenerate Catalog
    if (
      q.includes('regenerate') ||
      q.includes('re-run') ||
      q.includes('recreate') ||
      q.includes('re-generate') ||
      q.includes('दोबारा')
    ) {
      return {
        type: 'action',
        actionType: 'REGENERATE_CATALOG',
        description: 'Re-run AI craft copywriting & storytelling generation',
        confirmText: 'I can trigger a fresh AI craft analysis and regenerate your catalog. Would you like me to run this?',
      };
    }

    // 12. Knowledge Base: PM Vishwakarma Scheme
    if (
      q.includes('vishwakarma') ||
      q.includes('scheme') ||
      q.includes('yojana') ||
      q.includes('योजना') ||
      q.includes('benefit')
    ) {
      return {
        type: 'answer',
        text: `🏛️ **PM Vishwakarma Scheme Overview for Artisans:**\n\n• **Collateral-Free Credit**: Up to ₹3 Lakh in two tranches (₹1 Lakh in Tranche 1, ₹2 Lakh in Tranche 2) at a concessional interest rate of just 5% (with 8% government interest subvention).\n• **Toolkit Incentive**: ₹15,000 digital e-voucher to purchase modern specialized artisanal tools.\n• **Skill Training**: 5–7 days Basic Skill Training + 15 days Advanced Training with ₹500/day stipend during training.\n• **Marketing Support**: Quality certification, brand promotion, and direct onboarding onto government e-commerce (GeM, ONDC, and KariDoot).\n• **Artisan ID**: Recognized Digital ID & Certificate verifying your craft heritage.`,
      };
    }

    // 13. Knowledge Base: Win-Win Pricing Logic
    if (
      q.includes('win-win') ||
      q.includes('win win') ||
      q.includes('how pricing works') ||
      q.includes('calculation') ||
      q.includes('logic') ||
      q.includes('middleman')
    ) {
      return {
        type: 'answer',
        text: `⚖️ **KariDoot Win-Win Pricing Logic:**\n\n1. **Direct Cost Base**: We calculate exact craft inputs: *Material + Labour + Eco-Packaging + Safe Logistics*.\n2. **Eliminate Middlemen Parasites**: Conventional middlemen take 35%–45% commissions, squeezing artisan earnings.\n3. **Artisan Profit Guarantee**: You pick your desired margin (e.g. 50% = +₹190 profit direct in your bank account).\n4. **Customer Savings**: Because commission bloat is stripped out, end buyers still save 25%–35% compared to commercial retail or typical Amazon Karigar rates!\n\nBoth sides win: the artisan earns fair living wages, and buyers get authentic handcrafted heritage at honest direct prices.`,
      };
    }

    // 14. Knowledge Base: KariDoot 5-Step Process
    if (
      q.includes('how to use') ||
      q.includes('steps') ||
      q.includes('how does karidoot work') ||
      q.includes('process')
    ) {
      return {
        type: 'answer',
        text: `🚀 **How KariDoot Works in 5 Simple Steps:**\n\n1. **E-Commerce AI Photo Studio**: Upload any workshop snapshot. The AI strips background clutter and stages your craft on luxury linen bedding, teak surface, or pure white.\n2. **Voice-First Storytelling**: Speak naturally in Hindi or your mother tongue. The AI extracts technical dimensions, material heritage, and catalog copy.\n3. **Intelligent Spec HUD**: Review and refine title, narrative, tags, and artisan origin.\n4. **Win-Win Pricing**: Set direct costs and margin. See instant artisan profit in green and buyer savings in saffron.\n5. **Omnichannel Launchpad**: 1-click sync to ONDC, Amazon, Shopify, and WhatsApp Business!`,
      };
    }

    // Default Fallback: Delegate general questions to dynamic Gemini 1.5 Flash API
    return {
      type: 'gemini',
      query,
    };
  };

  // Handle Send Message
  const handleSend = async () => {
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Analyze query for action vs Q&A vs general question
    const analysis = analyzeQuery(userText);

    if (analysis.type === 'action') {
      setTimeout(() => {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: analysis.confirmText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: {
            ...analysis,
            status: 'pending', // 'pending' | 'applied' | 'cancelled'
          },
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 350);
    } else if (analysis.type === 'answer') {
      setTimeout(() => {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: analysis.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 350);
    } else {
      setIsTyping(true);
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || getGeminiKey();
        
        const promptText = `You are KariDoot AI Sahayak, a helpful business assistant for Indian artisans and weavers. The user is asking: "${userText}". Provide a short, helpful, step-by-step answer in 2-3 sentences. Do not use markdown, keep it plain text.`;

        // Attempt gemini-1.5-flash as specified, seamlessly falling back to available flash models if 1.5-flash is deprecated
        const candidateModels = ['gemini-1.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];
        let aiReply = null;

        for (const model of candidateModels) {
          try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
              })
            });
            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
              aiReply = data.candidates[0].content.parts[0].text;
              break;
            }
          } catch (modelErr) {
            console.warn(`Model ${model} request failed:`, modelErr);
          }
        }

        if (aiReply) {
          appendMessage(aiReply);
        } else {
          throw new Error("No response from Gemini");
        }
      } catch (error) {
        console.error("Gemini API Error:", error);
        appendMessage("I'm having trouble connecting to the network right now. Please try again.");
      } finally {
        setIsTyping(false);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // EXECUTE AGENTIC ACTION ON USER CONSENT
  // ─────────────────────────────────────────────────────────────
  const handleExecuteAction = (msgId, action) => {
    let success = false;
    let confirmationText = 'Done! Action executed successfully.';

    try {
      if (action.actionType === 'UPDATE_COST') {
        success = onUpdateCost?.(action.field, action.amount);
        confirmationText = `Done! I've updated your ${action.fieldLabel || action.field} to ₹${action.amount}.`;
      } else if (action.actionType === 'SET_MARGIN') {
        success = onSetMargin?.(action.percentage);
        confirmationText = `Done! I've adjusted your Artisan Profit Margin slider to ${action.percentage}%.`;
      } else if (action.actionType === 'NAVIGATE_STEP') {
        onNavigateStep?.(action.step);
        success = true;
        confirmationText = `Navigated to Step 0${action.step}!`;
      } else if (action.actionType === 'REGENERATE_CATALOG') {
        onRegenerateCatalog?.();
        success = true;
        confirmationText = 'Triggered a fresh AI catalog generation. Please review the updated story notes.';
      }
    } catch (err) {
      console.error('[AI Sahayak] Error executing action:', err);
    }

    // Update message state
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, action: { ...m.action, status: 'applied' } } : m
      )
    );

    // Append AI confirmation reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-confirm-${Date.now()}`,
          sender: 'ai',
          text: confirmationText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 200);
  };

  // Handle Action Cancel
  const handleCancelAction = (msgId) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, action: { ...m.action, status: 'cancelled' } } : m
      )
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-cancel-${Date.now()}`,
          sender: 'ai',
          text: 'Cancelled. No changes were made to your listing.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 200);
  };

  return (
    <>
      {/* ── FLOATING TRIGGER BUTTON (Bottom-Right) ── */}
      <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 no-print">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full border transition-all duration-300 shadow-2xl cursor-pointer ${
            isOpen
              ? 'bg-obsidian border-saffron text-saffron shadow-[0_0_25px_rgba(245,158,11,0.35)]'
              : 'bg-gradient-to-r from-saffron via-amber-500 to-emerald-craft text-obsidian border-white/20 hover:scale-105 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
          }`}
        >
          <div className="relative">
            <Sparkles size={18} className={isOpen ? 'text-saffron' : 'text-obsidian animate-spin'} />
            {!isOpen && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider">
            {isOpen ? 'Close Sahayak' : '🎙️ AI Sahayak / Assistant'}
          </span>
        </button>
      </div>

      {/* ── SLIDE-OVER AI ASSISTANT PANEL ── */}
      {isOpen && (
        <div
          className="fixed bottom-36 sm:bottom-20 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[560px] sm:h-[620px] max-h-[80vh] rounded-3xl border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-fade-slide-up no-print"
          style={{
            background: 'rgba(11, 15, 23, 0.96)',
            backdropFilter: 'blur(28px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 158, 11, 0.15)',
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl border border-saffron/40 bg-saffron/15 flex items-center justify-center text-saffron shadow-md">
                <Bot size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-serif text-white">KariDoot AI Sahayak</h3>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-craft/20 text-emerald-craft border border-emerald-craft/30">
                    Agentic
                  </span>
                </div>
                <p className="text-[10px] text-white/50">
                  Voice &amp; Action Enabled · Step 0{currentStep} Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick suggestions bar */}
          <div className="px-4 py-2 bg-white/3 border-b border-white/5 overflow-x-auto flex items-center gap-2 no-scrollbar">
            {SUGGESTED_QUERIES.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputVal(sq);
                }}
                className="whitespace-nowrap text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 hover:bg-saffron/15 hover:text-saffron text-white/70 border border-white/10 transition-colors cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-6 h-6 rounded-full bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron shrink-0 mt-0.5">
                      <Sparkles size={12} />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2 ${isAi ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAi
                          ? 'bg-white/6 border border-white/10 text-white/90 shadow-md'
                          : 'bg-gradient-to-r from-saffron to-amber-500 text-obsidian font-semibold shadow-lg shadow-saffron/15'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>

                      {/* Interactive Consent Card */}
                      {m.action && (
                        <div className="mt-3 p-3 rounded-xl border border-saffron/40 bg-saffron/10 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-saffron uppercase tracking-wider flex items-center gap-1.5">
                              <span>⚡</span> AGENTIC ACTION
                            </span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                m.action.status === 'applied'
                                  ? 'bg-emerald-craft/20 text-emerald-craft border border-emerald-craft/40'
                                  : m.action.status === 'cancelled'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-saffron/20 text-saffron border border-saffron/40 animate-pulse'
                              }`}
                            >
                              {m.action.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-white">
                            {m.action.description}
                          </p>

                          {m.action.status === 'pending' ? (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleExecuteAction(m.id, m.action)}
                                className="flex-1 py-2 px-3 rounded-lg bg-emerald-craft hover:bg-emerald-400 text-obsidian text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Check size={13} />
                                <span>Yes, Apply</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelAction(m.id)}
                                className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <X size={13} />
                                <span>Cancel</span>
                              </button>
                            </div>
                          ) : m.action.status === 'applied' ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-craft font-bold pt-0.5">
                              <CheckCircle2 size={13} />
                              <span>Applied to listing successfully</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[11px] text-white/40 pt-0.5">
                              <X size={13} />
                              <span>Action was cancelled</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] font-mono text-white/30 px-1">
                      {m.timestamp}
                    </span>
                  </div>

                  {!isAi && (
                    <div className="w-6 h-6 rounded-full bg-emerald-craft/20 border border-emerald-craft/40 flex items-center justify-center text-emerald-craft shrink-0 mt-0.5">
                      <User size={12} />
                    </div>
                  )}
                </div>
              );
            })}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron shrink-0 mt-0.5 animate-pulse">
                  <Sparkles size={12} />
                </div>
                <div className="p-3 rounded-2xl bg-white/6 border border-white/10 text-white/60 text-xs flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-white/40 ml-1.5 font-mono">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Listening Live Indicator */}
          {isListening && (
            <div className="px-4 py-2 bg-saffron/15 border-t border-saffron/30 flex items-center justify-between text-xs text-saffron">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
                <span className="font-mono font-bold">Listening in {dialect === 'hi' ? 'Hindi / Regional' : 'English'}...</span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="text-[11px] underline hover:text-white cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 border-t border-white/10 bg-white/2 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                  : 'bg-white/5 border-white/10 text-saffron hover:bg-saffron/15 hover:border-saffron/40'
              }`}
              title={isListening ? 'Click to stop listening' : 'Speak to AI Sahayak'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={
                isListening
                  ? 'Listening... speak your request'
                  : 'Ask or type: "Change labour to 600"...'
              }
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-saffron/60 transition-colors"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!inputVal.trim()}
              className="w-10 h-10 rounded-xl bg-saffron hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-saffron text-obsidian flex items-center justify-center transition-all shadow-md cursor-pointer"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
