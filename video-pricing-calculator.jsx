import React, { useState, useEffect } from 'react';
import { ChevronDown, Copy, Download, Settings, History, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';

const VideoPricingCalculator = () => {
  // ============ STATE MANAGEMENT ============
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('calculator');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Calculator inputs
  const [projectType, setProjectType] = useState('Instagram Reel');
  const [finalDuration, setFinalDuration] = useState('15–30 sec');
  const [rawFootage, setRawFootage] = useState('15–30 min');
  const [complexity, setComplexity] = useState('Standard');
  const [selectedServices, setSelectedServices] = useState({});
  const [brollProvider, setBrollProvider] = useState('Editor sources stock B-roll');
  const [platforms, setPlatforms] = useState(['YouTube 16:9']);
  const [captions, setCaptions] = useState('No captions');
  const [languages, setLanguages] = useState(1);
  const [revisions, setRevisions] = useState('2 revisions');
  const [deadline, setDeadline] = useState('3–6 days');
  const [clientType, setClientType] = useState('Individual Creator');
  const [usageType, setUsageType] = useState('Organic social media');
  const [deliverables, setDeliverables] = useState({});
  const [requiresProjectFile, setRequiresProjectFile] = useState(false);
  const [projectManagement, setProjectManagement] = useState('Normal communication');
  const [hourlyRate, setHourlyRate] = useState(500);
  const [clientOffer, setClientOffer] = useState(null);
  const [showNegotiationMode, setShowNegotiationMode] = useState(false);

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pricingSettings');
    return saved ? JSON.parse(saved) : {
      baseHourlyRate: 500,
      minimumProjectPrice: 1500,
      complexityMultipliers: {
        Basic: 0.6,
        Standard: 1.0,
        Advanced: 1.3,
        Premium: 1.6,
        'Agency/Cinematic': 2.0
      },
      rushMultipliers: {
        '7+ days': 1.0,
        '3–6 days': 1.0,
        '2 days': 1.1,
        '24 hours': 1.25,
        'Same day': 1.5,
        '12 hours': 1.75,
        '6 hours': 2.0,
        'Emergency': 2.25
      },
      enableCommercialAdjustment: true,
      commercialMultiplier: 1.3,
      enableClientTypeAdjustment: false
    };
  });

  // Price history
  const [priceHistory, setPriceHistory] = useState(() => {
    const saved = localStorage.getItem('priceHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // ============ DATA DEFINITIONS ============
  const projectTypes = [
    'Instagram Reel', 'YouTube Short', 'YouTube Video', 'Podcast', 'Talking Head',
    'SaaS/Product Video', 'Advertisement', 'Corporate Video', 'Event Video',
    'Cinematic Video', 'Wedding/Event Highlight', 'Educational Video', 'UGC Ad', 'Other'
  ];

  const durationOptions = ['Under 15 sec', '15–30 sec', '30–60 sec', '60–90 sec', '90 sec–3 min', '3–5 min', '5–10 min', '10–20 min', '20+ min'];
  const rawFootageOptions = ['Under 5 min', '5–15 min', '15–30 min', '30–60 min', '1–2 hours', '2–5 hours', '5+ hours'];
  const complexityLevels = ['Basic', 'Standard', 'Advanced', 'Premium', 'Agency/Cinematic'];
  const deadlineOptions = ['7+ days', '3–6 days', '2 days', '24 hours', 'Same day', '12 hours', '6 hours', 'Emergency'];
  const clientTypes = ['Student', 'Individual Creator', 'Small Business', 'Startup', 'Established Brand', 'Agency', 'Corporate', 'International Client'];
  const usageTypes = ['Personal', 'Organic social media', 'Brand social media', 'Paid advertisements', 'Product marketing', 'Commercial campaign', 'TV / large campaign', 'Internal corporate use'];
  const platformOptions = ['Instagram 9:16', 'YouTube 16:9', 'YouTube Shorts', 'Instagram 4:5', 'LinkedIn', 'Square 1:1', 'Custom'];
  const captionOptions = ['No captions', 'Basic subtitles', 'Styled subtitles', 'Dynamic captions', 'Animated captions'];

  const services = {
    'Editing': ['Cutting/trimming', 'Story restructuring', 'Jump cuts', 'Multi-camera editing', 'Pacing optimization', 'Retention editing'],
    'Motion Graphics': ['Basic text animation', 'Dynamic typography', 'Kinetic typography', 'Custom motion graphics', 'Advanced motion design', 'Logo animation', 'UI/SaaS animations', '2D animation', '3D elements'],
    'Visuals': ['Stock B-roll sourcing', 'Client-provided B-roll', 'AI-generated visuals', 'Product screenshots', 'Screen recordings', 'Green-screen cleanup', 'Rotoscoping', 'Object tracking', 'Compositing', 'VFX'],
    'Audio': ['Music selection', 'Sound effects', 'Audio cleanup', 'Noise removal', 'Voice enhancement', 'Sound design', 'Audio mixing', 'Voice-over synchronization'],
    'Color': ['Basic correction', 'Professional color correction', 'Cinematic color grading', 'Shot matching'],
    'Captions': ['Basic captions', 'Dynamic captions', 'Premium animated captions', 'Multi-language captions']
  };

  const deliverableOptions = {
    'Thumbnail': 500,
    'Cover image': 300,
    'Instagram cover': 300,
    'GIF': 400,
    'Short teaser': 800,
    'Additional cutdown': 1000,
    'Social media version': 600,
    'Multiple exports': 500
  };

  // ============ UTILITY FUNCTIONS ============
  const getDurationMinutes = (duration) => {
    const map = {
      'Under 15 sec': 10,
      '15–30 sec': 22,
      '30–60 sec': 45,
      '60–90 sec': 75,
      '90 sec–3 min': 150,
      '3–5 min': 240,
      '5–10 min': 420,
      '10–20 min': 900,
      '20+ min': 1500
    };
    return map[duration] || 30;
  };

  const getRawFootageMinutes = (footage) => {
    const map = {
      'Under 5 min': 3,
      '5–15 min': 10,
      '15–30 min': 22,
      '30–60 min': 45,
      '1–2 hours': 90,
      '2–5 hours': 210,
      '5+ hours': 360
    };
    return map[footage] || 30;
  };

  const getFootageMultiplier = (footage) => {
    const ratios = {
      'Under 5 min': 1.0,
      '5–15 min': 1.1,
      '15–30 min': 1.2,
      '30–60 min': 1.4,
      '1–2 hours': 1.6,
      '2–5 hours': 1.9,
      '5+ hours': 2.2
    };
    return ratios[footage] || 1.2;
  };

  const calculateEstimatedHours = () => {
    const finalMin = getDurationMinutes(finalDuration);
    const rawMin = getRawFootageMinutes(rawFootage);
    const footageMultiplier = getFootageMultiplier(rawFootage);

    let baseHours = (finalMin / 60) * 0.5; // Base: 30 sec per minute of final video
    
    // Complexity adjustment
    const complexityHours = baseHours * settings.complexityMultipliers[complexity];

    // Footage workload
    const footageRatio = rawMin / finalMin;
    const footageAdjustment = Math.log(footageRatio + 1) * 0.8;

    // Service selections
    const serviceCount = Object.values(selectedServices).flat().length;
    const serviceHours = serviceCount * 0.15;

    // B-roll
    let brollHours = 0;
    if (brollProvider === 'Editor sources stock B-roll') brollHours = 1.0;
    else if (brollProvider === 'Editor searches extensively for specific footage') brollHours = 1.5;
    else if (brollProvider === 'Editor creates/AI-generates visuals') brollHours = 2.0;

    // Captions
    const captionHours = captions === 'No captions' ? 0 : (captions.includes('Animated') ? 1.5 : 0.5) * languages;

    // Revisions
    let revisionHours = 0;
    const revisionMap = { '0 revisions': 0, '1 revision': 0.5, '2 revisions': 1.0, '3 revisions': 1.5, '4 revisions': 2.0, 'Unlimited': 3.0 };
    revisionHours = revisionMap[revisions] || 1.0;

    // Platforms
    const platformCount = platforms.length;
    const platformHours = (platformCount - 1) * 0.3;

    // Deliverables
    const deliverableCount = Object.keys(deliverables).filter(k => deliverables[k]).length;
    const deliverableHours = deliverableCount * 0.5;

    // Project file
    const projectFileHours = requiresProjectFile ? 0.5 : 0;

    const total = Math.round(
      (complexityHours + footageAdjustment + serviceHours + brollHours + captionHours + revisionHours + platformHours + deliverableHours + projectFileHours) * 10
    ) / 10;

    return {
      base: baseHours,
      complexity: complexityHours,
      footage: footageAdjustment,
      services: serviceHours,
      broll: brollHours,
      captions: captionHours,
      revisions: revisionHours,
      platforms: platformHours,
      deliverables: deliverableHours,
      projectFile: projectFileHours,
      total: Math.max(total, 1)
    };
  };

  const calculatePricing = () => {
    const hours = calculateEstimatedHours();
    const rushMultiplier = settings.rushMultipliers[deadline] || 1.0;

    // Base workload price
    const workloadPrice = hours.total * hourlyRate;

    // Add-ons pricing
    let addOnsPrice = 0;
    Object.entries(deliverables).forEach(([item, selected]) => {
      if (selected) {
        addOnsPrice += deliverableOptions[item] || 0;
      }
    });

    // Additional platform fee
    const platformFee = Math.max(0, (platforms.length - 1) * (workloadPrice * 0.1));

    // Project file fee
    const projectFileFee = requiresProjectFile ? 2000 : 0;

    // Language multiplier
    const languageMultiplier = languages === 1 ? 1.0 : 1.0 + (languages - 1) * 0.15;

    // Commercial/Usage multiplier
    let usageMultiplier = 1.0;
    if (settings.enableCommercialAdjustment) {
      if (['Paid advertisements', 'Commercial campaign', 'TV / large campaign'].includes(usageType)) {
        usageMultiplier = settings.commercialMultiplier;
      }
    }

    // Client type adjustment (if enabled)
    let clientMultiplier = 1.0;
    if (settings.enableClientTypeAdjustment) {
      const multipliers = {
        'Student': 0.8,
        'Individual Creator': 1.0,
        'Small Business': 1.1,
        'Startup': 1.15,
        'Established Brand': 1.25,
        'Agency': 1.3,
        'Corporate': 1.4,
        'International Client': 1.2
      };
      clientMultiplier = multipliers[clientType] || 1.0;
    }

    // Calculate base with all multipliers
    const baseWithMultipliers = (workloadPrice * rushMultiplier * languageMultiplier * usageMultiplier * clientMultiplier) + addOnsPrice + platformFee + projectFileFee;

    // Apply minimum
    const basePrice = Math.max(baseWithMultipliers, settings.minimumProjectPrice);

    // Three-tier pricing
    const floorPrice = Math.round(basePrice * 0.7);
    const recommendedPrice = Math.round(basePrice);
    const premiumPrice = Math.round(basePrice * 1.35);

    return {
      hours: hours.total,
      breakdown: hours,
      workloadPrice,
      addOnsPrice,
      platformFee,
      projectFileFee,
      rushMultiplier,
      languageMultiplier,
      usageMultiplier,
      clientMultiplier,
      basePrice,
      floorPrice,
      recommendedPrice,
      premiumPrice,
      effectiveHourly: Math.round(recommendedPrice / hours.total)
    };
  };

  const pricing = calculatePricing();

  // ============ HANDLERS ============
  const toggleService = (category, service) => {
    setSelectedServices(prev => {
      const updated = { ...prev };
      if (!updated[category]) updated[category] = [];
      
      if (updated[category].includes(service)) {
        updated[category] = updated[category].filter(s => s !== service);
      } else {
        updated[category].push(service);
      }
      
      if (updated[category].length === 0) delete updated[category];
      return updated;
    });
  };

  const togglePlatform = (platform) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleDeliverable = (item) => {
    setDeliverables(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const saveToHistory = () => {
    const entry = {
      id: Date.now(),
      projectType,
      finalDuration,
      complexity,
      recommendedPrice: pricing.recommendedPrice,
      estimatedHours: pricing.hours,
      effectiveHourly: pricing.effectiveHourly,
      date: new Date().toLocaleDateString(),
      clientType
    };
    
    const updated = [entry, ...priceHistory.slice(0, 49)];
    setPriceHistory(updated);
    localStorage.setItem('priceHistory', JSON.stringify(updated));
  };

  const resetSettings = () => {
    const defaults = {
      baseHourlyRate: 500,
      minimumProjectPrice: 1500,
      complexityMultipliers: {
        Basic: 0.6,
        Standard: 1.0,
        Advanced: 1.3,
        Premium: 1.6,
        'Agency/Cinematic': 2.0
      },
      rushMultipliers: {
        '7+ days': 1.0,
        '3–6 days': 1.0,
        '2 days': 1.1,
        '24 hours': 1.25,
        'Same day': 1.5,
        '12 hours': 1.75,
        '6 hours': 2.0,
        'Emergency': 2.25
      },
      enableCommercialAdjustment: true,
      commercialMultiplier: 1.3,
      enableClientTypeAdjustment: false
    };
    setSettings(defaults);
    localStorage.setItem('pricingSettings', JSON.stringify(defaults));
  };

  const saveSettings = () => {
    localStorage.setItem('pricingSettings', JSON.stringify(settings));
    setShowSettings(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const generateQuote = () => {
    const quote = `
VIDEO EDITING QUOTATION
═════════════════════════

Project: ${projectType}
Final Duration: ${finalDuration}
Complexity: ${complexity}
Client Type: ${clientType}

SERVICES INCLUDED
─────────────────
${Object.entries(selectedServices).map(([cat, items]) => 
  `${cat}:\n${items.map(i => `  • ${i}`).join('\n')}`
).join('\n\n')}

REVISION POLICY
───────────────
Included Rounds: ${revisions}
Additional Revisions: ₹${Math.round(pricing.recommendedPrice * 0.15)}/revision

DELIVERY TIMELINE
─────────────────
Standard Deadline: ${deadline}
${pricing.rushMultiplier > 1 ? `Rush Premium Applied: ${((pricing.rushMultiplier - 1) * 100).toFixed(0)}%` : 'No rush premium'}

PRICING
═══════════════════════════════════

Base Editing Work: ₹${pricing.workloadPrice.toLocaleString()}
Add-on Services: ₹${(pricing.addOnsPrice + pricing.platformFee + pricing.projectFileFee).toLocaleString()}
${pricing.rushMultiplier > 1 ? `Rush Premium: ₹${Math.round((pricing.workloadPrice * (pricing.rushMultiplier - 1))).toLocaleString()}` : ''}

FLOOR PRICE: ₹${pricing.floorPrice.toLocaleString()}
RECOMMENDED: ₹${pricing.recommendedPrice.toLocaleString()}
PREMIUM: ₹${pricing.premiumPrice.toLocaleString()}

═════════════════════════

Estimated Work: ${pricing.hours} hours
Effective Rate: ₹${pricing.effectiveHourly}/hour

Payment Terms:
• 50% advance upon confirmation
• 50% upon final delivery
• Changes beyond scope may incur additional fees
• Unlimited revisions not included without premium agreement

Valid for 7 days from this quote.
    `;
    copyToClipboard(quote);
    alert('Quote copied to clipboard!');
  };

  const negotiationAnalysis = clientOffer ? {
    difference: pricing.recommendedPrice - clientOffer,
    percentDiscount: ((pricing.recommendedPrice - clientOffer) / pricing.recommendedPrice * 100).toFixed(1),
    effectiveRate: Math.round(clientOffer / pricing.hours),
    isReasonable: clientOffer >= pricing.floorPrice
  } : null;

  // ============ RENDER COMPONENTS ============
  const renderQuickInput = (label, value, onChange, options) => (
    <div className="space-y-2">
      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const renderCheckboxGroup = (title, items, selected, onChange) => (
    <div className="space-y-3">
      <h4 className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        {title}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {items.map(item => (
          <label key={item} className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}>
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onChange(item)}
              className="w-4 h-4"
            />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  // ============ MAIN RENDER ============
  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              VIDEO PRICING
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Know exactly what your next edit should cost
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg flex gap-2 items-center ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
            >
              <History size={18} /> History
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg flex gap-2 items-center ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 mb-8`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pricing Settings
              </h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Base Hourly Rate (₹)
                  <input
                    type="number"
                    value={settings.baseHourlyRate}
                    onChange={(e) => setSettings({...settings, baseHourlyRate: parseInt(e.target.value)})}
                    className={`w-full mt-1 px-3 py-2 rounded border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </label>

                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Minimum Project Price (₹)
                  <input
                    type="number"
                    value={settings.minimumProjectPrice}
                    onChange={(e) => setSettings({...settings, minimumProjectPrice: parseInt(e.target.value)})}
                    className={`w-full mt-1 px-3 py-2 rounded border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </label>

                <label className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={settings.enableCommercialAdjustment}
                    onChange={(e) => setSettings({...settings, enableCommercialAdjustment: e.target.checked})}
                  />
                  Enable Commercial Usage Multiplier
                </label>

                {settings.enableCommercialAdjustment && (
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Commercial Multiplier
                    <input
                      type="number"
                      step="0.1"
                      value={settings.commercialMultiplier}
                      onChange={(e) => setSettings({...settings, commercialMultiplier: parseFloat(e.target.value)})}
                      className={`w-full mt-1 px-3 py-2 rounded border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-4">
                <label className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={settings.enableClientTypeAdjustment}
                    onChange={(e) => setSettings({...settings, enableClientTypeAdjustment: e.target.checked})}
                  />
                  Enable Client Type Adjustment
                </label>

                <div className="space-y-2">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Complexity Multipliers
                  </p>
                  {Object.entries(settings.complexityMultipliers).map(([level, mult]) => (
                    <div key={level} className="flex gap-2 items-center">
                      <span className={`text-sm w-24 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{level}</span>
                      <input
                        type="number"
                        step="0.1"
                        value={mult}
                        onChange={(e) => setSettings({
                          ...settings,
                          complexityMultipliers: {...settings.complexityMultipliers, [level]: parseFloat(e.target.value)}
                        })}
                        className={`w-20 px-2 py-1 rounded border text-sm ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Settings
              </button>
              <button
                onClick={resetSettings}
                className={`px-4 py-2 rounded-lg transition ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}

        {/* History Panel */}
        {showHistory && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 mb-8`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Price History
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            {priceHistory.length === 0 ? (
              <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No pricing history yet
              </p>
            ) : (
              <div className={`overflow-x-auto ${darkMode ? '' : ''}`}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-2 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Project</th>
                      <th className={`text-left py-2 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Duration</th>
                      <th className={`text-left py-2 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price</th>
                      <th className={`text-left py-2 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hours</th>
                      <th className={`text-left py-2 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hourly</th>
                      <th className={`text-left py-2 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceHistory.map(entry => (
                      <tr key={entry.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <td className={`py-3 px-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{entry.projectType}</td>
                        <td className={`py-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{entry.finalDuration}</td>
                        <td className={`py-3 px-2 font-semibold text-green-500`}>₹{entry.recommendedPrice.toLocaleString()}</td>
                        <td className={`py-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{entry.estimatedHours}h</td>
                        <td className={`py-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>₹{entry.effectiveHourly}</td>
                        <td className={`py-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{entry.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Main Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Basic Project Info */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📹 Project Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderQuickInput('Project Type', projectType, setProjectType, projectTypes)}
                {renderQuickInput('Final Duration', finalDuration, setFinalDuration, durationOptions)}
              </div>
            </div>

            {/* Section 2: Footage & Complexity */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                🎬 Raw Material & Complexity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderQuickInput('Raw Footage Length', rawFootage, setRawFootage, rawFootageOptions)}
                {renderQuickInput('Editing Complexity', complexity, setComplexity, complexityLevels)}
              </div>
              <div className={`mt-4 p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Complexity explains the work:</strong> Basic = cuts & music | Standard = captions & B-roll | Advanced = motion graphics | Premium = high-end animations | Agency = VFX & compositing
                </p>
              </div>
            </div>

            {/* Section 3: Services */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                🛠️ Services Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(services).map(([category, items]) => (
                  <div key={category}>
                    {renderCheckboxGroup(
                      category,
                      items,
                      selectedServices[category] || [],
                      (item) => toggleService(category, item)
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: B-roll & Captions */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                🎞️ B-roll & Captions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderQuickInput('B-roll Provider', brollProvider, setBrollProvider, [
                  'Client provides everything',
                  'Editor uses provided B-roll',
                  'Editor sources stock B-roll',
                  'Editor searches extensively for specific footage',
                  'Editor creates/AI-generates visuals'
                ])}
                {renderQuickInput('Caption Style', captions, setCaptions, captionOptions)}
              </div>
              {captions !== 'No captions' && (
                <div className="mt-4">
                  {renderQuickInput('Languages', languages, (val) => setLanguages(parseInt(val)), ['1', '2', '3', '4', '5'])}
                </div>
              )}
            </div>

            {/* Section 5: Platforms & Deliverables */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📱 Platforms & Formats
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {platformOptions.map(platform => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-3 py-2 rounded text-sm font-medium transition ${
                      platforms.includes(platform)
                        ? 'bg-blue-600 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 6: Revisions & Deadline */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ⏱️ Revisions & Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderQuickInput('Revision Rounds', revisions, setRevisions, ['0 revisions', '1 revision', '2 revisions', '3 revisions', '4 revisions', 'Unlimited'])}
                {renderQuickInput('Deadline', deadline, setDeadline, deadlineOptions)}
              </div>
              {pricing.rushMultiplier > 1 && (
                <div className={`mt-4 p-3 rounded flex gap-2 ${darkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <AlertCircle size={16} className={darkMode ? 'text-yellow-500' : 'text-yellow-600'} />
                  <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    <strong>Rush premium:</strong> {((pricing.rushMultiplier - 1) * 100).toFixed(0)}% surcharge applied
                  </p>
                </div>
              )}
            </div>

            {/* Section 7: Client & Usage */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                🏢 Client & Usage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderQuickInput('Client Type', clientType, setClientType, clientTypes)}
                {renderQuickInput('Video Usage', usageType, setUsageType, usageTypes)}
              </div>
            </div>

            {/* Section 8: Add-ons */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ✨ Deliverables & Add-ons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {Object.entries(deliverableOptions).map(([item, price]) => (
                  <label key={item} className={`flex items-center gap-3 p-3 rounded cursor-pointer ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    <input
                      type="checkbox"
                      checked={deliverables[item] || false}
                      onChange={() => toggleDeliverable(item)}
                    />
                    <div className="flex-1">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item}
                      </span>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        +₹{price.toLocaleString()}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <label className={`flex items-center gap-3 p-3 rounded cursor-pointer ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <input
                  type="checkbox"
                  checked={requiresProjectFile}
                  onChange={() => setRequiresProjectFile(!requiresProjectFile)}
                />
                <div className="flex-1">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Editable Project File
                  </span>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    +₹2,000
                  </p>
                </div>
              </label>
            </div>

            {/* Section 9: Hourly Rate */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                💰 Your Rate
              </h2>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Target Hourly Rate (₹/hour)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className={`flex-1 px-4 py-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <span className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  ₹{hourlyRate.toLocaleString()}/h
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel - Pricing Display */}
          <div className="space-y-6">
            {/* Main Price Card */}
            <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} border rounded-lg p-8 sticky top-24`}>
              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                YOUR RECOMMENDED QUOTE
              </p>
              <h3 className={`text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                ₹{pricing.recommendedPrice.toLocaleString()}
              </h3>

              <div className="space-y-3 mb-6">
                <div className={`flex justify-between py-2 border-b ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>
                  <span className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>Floor Price</span>
                  <span className={`font-semibold ${darkMode ? 'text-blue-100' : 'text-blue-800'}`}>₹{pricing.floorPrice.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between py-2 border-b ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>
                  <span className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>Premium Price</span>
                  <span className={`font-semibold ${darkMode ? 'text-blue-100' : 'text-blue-800'}`}>₹{pricing.premiumPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className={`rounded p-3 mb-6 ${darkMode ? 'bg-blue-700/50' : 'bg-white/50'}`}>
                <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                  ESTIMATED WORK
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                  {pricing.hours}h
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  Effective: ₹{pricing.effectiveHourly}/hour
                </p>
              </div>

              <button
                onClick={saveToHistory}
                className={`w-full py-2 rounded-lg font-semibold transition mb-2 ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Plus size={16} className="inline mr-2" /> Save This Quote
              </button>

              <button
                onClick={generateQuote}
                className={`w-full py-2 rounded-lg font-semibold transition ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Copy size={16} className="inline mr-2" /> Copy Quote
              </button>
            </div>

            {/* Breakdown Card */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 Price Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Base Workload</span>
                  <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{Math.round(pricing.workloadPrice).toLocaleString()}</span>
                </div>
                {pricing.addOnsPrice > 0 && (
                  <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Add-on Services</span>
                    <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{pricing.addOnsPrice.toLocaleString()}</span>
                  </div>
                )}
                {pricing.platformFee > 0 && (
                  <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Additional Formats</span>
                    <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{Math.round(pricing.platformFee).toLocaleString()}</span>
                  </div>
                )}
                {pricing.projectFileFee > 0 && (
                  <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Project Files</span>
                    <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{pricing.projectFileFee.toLocaleString()}</span>
                  </div>
                )}
                {pricing.rushMultiplier > 1 && (
                  <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Rush Premium</span>
                    <span className={`font-semibold text-orange-500`}>₹{Math.round(pricing.workloadPrice * (pricing.rushMultiplier - 1)).toLocaleString()}</span>
                  </div>
                )}
                {pricing.usageMultiplier > 1 && (
                  <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Commercial Use</span>
                    <span className={`font-semibold text-green-500`}>+{((pricing.usageMultiplier - 1) * 100).toFixed(0)}%</span>
                  </div>
                )}
                <div className={`flex justify-between py-3 mt-3 font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span>TOTAL</span>
                  <span>₹{pricing.recommendedPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Hours Breakdown */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ⏱️ Work Estimate
              </h3>
              <div className="space-y-2 text-sm">
                <div className={`flex justify-between py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Editing Base</span>
                  <span className="font-medium">{pricing.breakdown.base.toFixed(1)}h</span>
                </div>
                <div className={`flex justify-between py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Complexity Factor</span>
                  <span className="font-medium">{pricing.breakdown.complexity.toFixed(1)}h</span>
                </div>
                {pricing.breakdown.footage > 0 && (
                  <div className={`flex justify-between py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span>Footage Selection</span>
                    <span className="font-medium">+{pricing.breakdown.footage.toFixed(1)}h</span>
                  </div>
                )}
                {pricing.breakdown.broll > 0 && (
                  <div className={`flex justify-between py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span>B-roll Work</span>
                    <span className="font-medium">+{pricing.breakdown.broll.toFixed(1)}h</span>
                  </div>
                )}
                {pricing.breakdown.captions > 0 && (
                  <div className={`flex justify-between py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span>Captions</span>
                    <span className="font-medium">+{pricing.breakdown.captions.toFixed(1)}h</span>
                  </div>
                )}
                {pricing.breakdown.revisions > 0 && (
                  <div className={`flex justify-between py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span>Revisions</span>
                    <span className="font-medium">+{pricing.breakdown.revisions.toFixed(1)}h</span>
                  </div>
                )}
              </div>
            </div>

            {/* Negotiation Mode */}
            {!showNegotiationMode ? (
              <button
                onClick={() => setShowNegotiationMode(true)}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                💬 Client Negotiated Price
              </button>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Negotiation Analysis
                  </h3>
                  <button onClick={() => setShowNegotiationMode(false)} className="text-gray-500">
                    <X size={16} />
                  </button>
                </div>

                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Client's Offer (₹)
                </label>
                <input
                  type="number"
                  value={clientOffer || ''}
                  onChange={(e) => setClientOffer(e.target.value ? parseInt(e.target.value) : null)}
                  className={`w-full px-4 py-2 rounded border mb-4 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter offer amount"
                />

                {negotiationAnalysis && (
                  <div className="space-y-3">
                    <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your Quote</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{pricing.recommendedPrice.toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Their Offer</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{clientOffer.toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Discount</span>
                      <span className={`font-semibold ${negotiationAnalysis.difference < 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {negotiationAnalysis.difference < 0 ? '+' : '-'}₹{Math.abs(negotiationAnalysis.difference).toLocaleString()} ({negotiationAnalysis.percentDiscount}%)
                      </span>
                    </div>
                    <div className={`flex justify-between py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Effective Rate</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{negotiationAnalysis.effectiveRate}/hour</span>
                    </div>

                    <div className={`mt-4 p-3 rounded flex gap-2 ${
                      negotiationAnalysis.isReasonable
                        ? (darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200')
                        : (darkMode ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200')
                    }`}>
                      {negotiationAnalysis.isReasonable ? (
                        <CheckCircle2 size={16} className={darkMode ? 'text-green-500' : 'text-green-600'} />
                      ) : (
                        <AlertCircle size={16} className={darkMode ? 'text-red-500' : 'text-red-600'} />
                      )}
                      <p className={`text-sm ${
                        negotiationAnalysis.isReasonable
                          ? (darkMode ? 'text-green-300' : 'text-green-700')
                          : (darkMode ? 'text-red-300' : 'text-red-700')
                      }`}>
                        {negotiationAnalysis.isReasonable
                          ? `This offer is within your floor price. It's negotiable.`
                          : `This is below your floor price (₹${pricing.floorPrice}). Consider pushing back.`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPricingCalculator;
