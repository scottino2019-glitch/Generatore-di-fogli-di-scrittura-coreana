/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Plus,
  Trash2,
  Settings,
  Download,
  Upload,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Check,
  BookOpen,
  FileText,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  Undo
} from 'lucide-react';
import { VocabularyItem, WorksheetConfig, GridStyle, GridLineColor, PaperSize } from './types';
import { PRESET_VOCABULARY } from './data/vocabulary';
import WorksheetPreview from './components/WorksheetPreview';

const DEFAULT_CONFIG: WorksheetConfig = {
  title: 'ESERCIZI DI SCRITTURA COREANA',
  subtitle: 'Pratica di scrittura Hangul per studenti di lingua',
  layoutMode: 'word',
  showPronunciation: true,
  showTranslation: true,
  showExample: true,
  showExamplePron: true,
  showExampleTrans: true,
  traceBoxesCount: 2,
  practiceBoxesCount: 11,
  gridStyle: 'crosshair',
  gridColor: 'green',
  paperSize: 'a4',
  koreanFont: 'Gowun Batang',
  customInstructions: 'Esercitati a ricalcare le lettere grigie e poi riempi le caselle vuote scrivendo in modo ordinato da sinistra a destra.',
  showGridGuides: true
};

export default function App() {
  // --- STATE ---
  const [config, setConfig] = useState<WorksheetConfig>(DEFAULT_CONFIG);
  const [selectedItems, setSelectedItems] = useState<VocabularyItem[]>([]);
  const [customItems, setCustomItems] = useState<VocabularyItem[]>([]);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'config'>('presets');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  
  // Custom word form state
  const [newWord, setNewWord] = useState('');
  const [newPron, setNewPron] = useState('');
  const [newTrans, setNewTrans] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newExamplePron, setNewExamplePron] = useState('');
  const [newExampleTrans, setNewExampleTrans] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [formError, setFormError] = useState('');
  
  // Import/Export panel state
  const [jsonText, setJsonText] = useState('');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonError, setJsonError] = useState('');

  // --- LOCAL STORAGE EFFECTS ---
  // Load custom vocabulary items on mount
  useEffect(() => {
    const savedCustom = localStorage.getItem('korean_custom_vocab');
    if (savedCustom) {
      try {
        setCustomItems(JSON.parse(savedCustom));
      } catch (e) {
        console.error('Failed to load custom vocabularies', e);
      }
    }

    // Initialize with a few default selected items so the worksheet has content immediately
    const defaultSelection = PRESET_VOCABULARY.slice(0, 3); // Ciao, Grazie, Scusa
    setSelectedItems(defaultSelection);
  }, []);

  // Save custom vocabulary items when they change
  useEffect(() => {
    if (customItems.length > 0) {
      localStorage.setItem('korean_custom_vocab', JSON.stringify(customItems));
    } else {
      localStorage.removeItem('korean_custom_vocab');
    }
  }, [customItems]);

  // --- HANDLERS ---
  
  // Toggle a word in the worksheet
  const handleToggleItem = (item: VocabularyItem) => {
    const exists = selectedItems.find(i => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Add all filtered words
  const handleSelectAllFiltered = (filtered: VocabularyItem[]) => {
    // Add only those not already selected
    const toAdd = filtered.filter(f => !selectedItems.some(s => s.id === f.id));
    setSelectedItems([...selectedItems, ...toAdd]);
  };

  // Deselect all filtered words
  const handleDeselectAllFiltered = (filtered: VocabularyItem[]) => {
    setSelectedItems(selectedItems.filter(s => !filtered.some(f => f.id === s.id)));
  };

  // Move item up in worksheet order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...selectedItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setSelectedItems(newItems);
  };

  // Move item down in worksheet order
  const handleMoveDown = (index: number) => {
    if (index === selectedItems.length - 1) return;
    const newItems = [...selectedItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setSelectedItems(newItems);
  };

  // Remove item from worksheet
  const handleRemoveFromWorksheet = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  // Clear entire worksheet selection
  const handleClearWorksheet = () => {
    setSelectedItems([]);
  };

  // Preset quick-loading sets
  const loadPresetTheme = (theme: 'greetings' | 'food' | 'verbs' | 'idioms') => {
    let ids: string[] = [];
    if (theme === 'greetings') {
      ids = ['b1', 'b2', 'b3'];
      setConfig(prev => ({
        ...prev,
        title: 'ESERCIZI DI SCRITTURA: SALUTI',
        subtitle: 'Impara le formule di cortesia coreane più importanti'
      }));
    } else if (theme === 'food') {
      ids = ['b8', 'b9', 'i10']; // 물 (Acqua), 맛있어요 (Essere delizioso), 선물 (Regalo/Fiori)
      setConfig(prev => ({
        ...prev,
        title: 'ESERCIZI DI SCRITTURA: CIBO & VITA',
        subtitle: 'Pratica con i vocaboli alimentari e sociali di base'
      }));
    } else if (theme === 'verbs') {
      ids = ['i1', 'i4', 'i8']; // 공부하다 (Studiare), 여행하다 (Viaggiare), 건강 (Salute)
      setConfig(prev => ({
        ...prev,
        title: 'ESERCIZI DI SCRITTURA: VERBI & BENESSERE',
        subtitle: 'Espandere il vocabolario con azioni e salute quotidiana'
      }));
    } else if (theme === 'idioms') {
      ids = ['a1', 'a2', 'a3', 'a4']; // 작심삼일, 사필귀정, 천고마비, 유비무환
      setConfig(prev => ({
        ...prev,
        title: '고사성어: ESPRESSIONI IDIOMATICHE',
        subtitle: 'Pratica di scrittura avanzata con proverbi coreani di quattro caratteri (Sajaseong-eo)'
      }));
    }

    const itemsToLoad = PRESET_VOCABULARY.filter(item => ids.includes(item.id));
    setSelectedItems(itemsToLoad);
  };

  // Create custom word
  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newWord.trim()) {
      setFormError('La parola in coreano è obbligatoria.');
      return;
    }
    if (!newTrans.trim()) {
      setFormError('La traduzione in italiano è obbligatoria.');
      return;
    }

    const newItem: VocabularyItem = {
      id: `custom-${Date.now()}`,
      word: newWord.trim(),
      pronunciation: newPron.trim() || 'Non specificata',
      translation: newTrans.trim(),
      example: newExample.trim(),
      examplePron: newExamplePron.trim(),
      exampleTrans: newExampleTrans.trim(),
      category: newCategory.trim() || 'Personalizzato',
      level: 'custom'
    };

    setCustomItems([newItem, ...customItems]);
    setSelectedItems([...selectedItems, newItem]);

    // Reset form fields
    setNewWord('');
    setNewPron('');
    setNewTrans('');
    setNewExample('');
    setNewExamplePron('');
    setNewExampleTrans('');
    setNewCategory('');
  };

  // Delete custom word permanently
  const handleDeleteCustomWord = (id: string) => {
    setCustomItems(customItems.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  // Trigger print
  const handlePrint = () => {
    window.print();
  };

  // Handle Export JSON
  const handleExportJson = () => {
    const dataStr = JSON.stringify(selectedItems, null, 2);
    setJsonText(dataStr);
    setJsonError('');
    setShowJsonModal(true);
  };

  // Handle Import JSON
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setJsonError('Il formato deve essere un array di vocaboli.');
        return;
      }
      
      // Basic validation of fields
      const validated = parsed.map((item: any, idx: number) => {
        if (!item.word || !item.translation) {
          throw new Error(`L'elemento all'indice ${idx} non ha i campi obbligatori "word" o "translation".`);
        }
        return {
          id: item.id || `imported-${Date.now()}-${idx}`,
          word: String(item.word),
          pronunciation: String(item.pronunciation || ''),
          translation: String(item.translation),
          example: String(item.example || ''),
          examplePron: String(item.examplePron || ''),
          exampleTrans: String(item.exampleTrans || ''),
          category: String(item.category || 'Importato'),
          level: (item.level as any) || 'custom'
        };
      });

      setSelectedItems([...selectedItems, ...validated]);
      setShowJsonModal(false);
      setJsonText('');
      setJsonError('');
    } catch (e: any) {
      setJsonError(`Errore di analisi: ${e.message}`);
    }
  };

  // --- DOWNLOAD STANDALONE HTML APP ---
  const handleDownloadHtmlApp = () => {
    const embeddedConfig = JSON.stringify(config);
    const embeddedSelected = JSON.stringify(selectedItems);
    const embeddedCustom = JSON.stringify(customItems);
    const embeddedPresets = JSON.stringify(PRESET_VOCABULARY);

    const htmlContent = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generatore Fogli Scrittura Coreano (Hangul) - Standalone</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Gowun+Dodum&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Nanum+Gothic:wght@400;700&family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet" />
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ["Inter", "sans-serif"],
              noto: ["Noto Sans KR", "sans-serif"],
              gothic: ["Nanum Gothic", "sans-serif"],
              myeongjo: ["Nanum Myeongjo", "serif"],
              "gowun-batang": ["Gowun Batang", "serif"],
              "gowun-dodum": ["Gowun Dodum", "sans-serif"],
            }
          }
        }
      }
    </script>

    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
      @media print {
        body {
          background-color: white !important;
          color: black !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          background: transparent !important;
        }
        .print-item-avoid {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      }

      .font-noto {
        font-family: 'Noto Sans KR', sans-serif !important;
      }
      .font-gothic {
        font-family: 'Nanum Gothic', sans-serif !important;
      }
      .font-myeongjo {
        font-family: 'Nanum Myeongjo', serif !important;
      }
      .font-gowun-batang {
        font-family: 'Gowun Batang', serif !important;
      }
      .font-gowun-dodum {
        font-family: 'Gowun Dodum', sans-serif !important;
      }

      .sheet-shadow {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
      }
      .grid-cell {
        position: relative;
        box-sizing: border-box;
      }
      .grid-guide-line-x {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        border-top: 1px dashed currentColor;
        opacity: 0.25;
        pointer-events: none;
      }
      .grid-guide-line-y {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        border-left: 1px dashed currentColor;
        opacity: 0.25;
        pointer-events: none;
      }
      .grid-guide-line-diag1 {
        position: absolute;
        top: 0;
        left: 0;
        width: 141.4%;
        height: 1px;
        border-top: 1px dotted currentColor;
        opacity: 0.15;
        transform: rotate(45deg);
        transform-origin: top left;
        pointer-events: none;
      }
      .grid-guide-line-diag2 {
        position: absolute;
        top: 0;
        right: 0;
        width: 141.4%;
        height: 1px;
        border-top: 1px dotted currentColor;
        opacity: 0.15;
        transform: rotate(135deg);
        transform-origin: top right;
        pointer-events: none;
      }
    </style>
  </head>
  <body class="bg-slate-50 min-h-screen flex flex-col font-sans text-gray-900" x-data="appState()">
    
    <!-- HEADER -->
    <header class="no-print bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-white/10 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <span class="text-xl font-bold text-rose-500 font-mono tracking-wider flex items-center">
              한<span class="text-sky-400">국</span>
            </span>
          </div>
          <div>
            <h1 class="text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-2">
              Generatore Fogli Scrittura Coreano (Standalone)
              <span class="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full font-medium">
                Singolo File / Offline
              </span>
            </h1>
            <p class="text-xs text-slate-400">
              Esegui ovunque senza installazione. Salva le tue impostazioni nel browser.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            @click="printSheet"
            :disabled="selectedItems.length === 0"
            class="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg shadow transition-all cursor-pointer bg-rose-500 hover:bg-rose-600 text-white hover:shadow-rose-500/20 active:scale-[0.98] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <!-- Printer Icon SVG -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Esporta in PDF / Stampa</span>
          </button>
        </div>
      </div>
    </header>

    <!-- MAIN CONTAINER -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- LEFT COLUMN: CONTROLS (HIDDEN ON PRINT) -->
      <section class="no-print lg:col-span-5 space-y-6 flex flex-col h-full lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
        
        <!-- Quick Themes Selector -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-150">
          <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-sans">
            <svg class="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" /></svg>
            Carica Set di Pratica Rapidi
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <button @click="loadPresetTheme('greetings')" class="py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition-all cursor-pointer text-left flex items-center justify-between">
              <span>Saluti Comuni</span>
              <span class="text-[10px] bg-sky-100 text-sky-800 px-1 rounded font-bold">A1</span>
            </button>
            <button @click="loadPresetTheme('food')" class="py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition-all cursor-pointer text-left flex items-center justify-between">
              <span>Cibo & Vita</span>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">A2</span>
            </button>
            <button @click="loadPresetTheme('verbs')" class="py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition-all cursor-pointer text-left flex items-center justify-between">
              <span>Verbi & Azioni</span>
              <span class="text-[10px] bg-orange-100 text-orange-800 px-1 rounded font-bold">B1</span>
            </button>
            <button @click="loadPresetTheme('idioms')" class="py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition-all cursor-pointer text-left flex items-center justify-between">
              <span>Proverbi (고사성어)</span>
              <span class="text-[10px] bg-purple-100 text-purple-800 px-1 rounded font-bold">B2+</span>
            </button>
          </div>
        </div>

        <!-- Sidebar Navigation Tabs -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-150 overflow-hidden flex flex-col">
          <div class="flex border-b border-slate-150 bg-slate-50">
            <button
              @click="activeTab = 'presets'"
              :class="activeTab === 'presets' ? 'border-rose-500 text-rose-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'"
              class="flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all cursor-pointer"
            >
              Vocaboli
            </button>
            <button
              @click="activeTab = 'custom'"
              :class="activeTab === 'custom' ? 'border-rose-500 text-rose-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'"
              class="flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all cursor-pointer"
            >
              Personalizzati
            </button>
            <button
              @click="activeTab = 'config'"
              :class="activeTab === 'config' ? 'border-rose-500 text-rose-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'"
              class="flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all cursor-pointer"
            >
              Config. Foglio
            </button>
          </div>

          <div class="p-4 overflow-y-auto max-h-[500px]">
            
            <!-- TAB 1: PRESET VOCABULARY -->
            <div x-show="activeTab === 'presets'" class="space-y-4">
              <!-- Search & Filter Row -->
              <div class="flex flex-col gap-2">
                <input
                  type="text"
                  x-model="searchTerm"
                  placeholder="Cerca per vocabolo, traduzione..."
                  class="w-full px-3 py-2 text-xs border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                
                <select
                  x-model="levelFilter"
                  class="w-full px-3 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="all">Tutti i livelli</option>
                  <option value="beginner">Principiante (A1-A2)</option>
                  <option value="intermediate">Intermedio (B1-B2)</option>
                  <option value="advanced">Avanzato (C1)</option>
                </select>
              </div>

              <!-- Preset List -->
              <div class="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                <template x-for="item in filteredVocabulary" :key="item.id">
                  <div
                    @click="toggleItem(item)"
                    class="flex items-center justify-between p-2 rounded-lg border text-left cursor-pointer transition-all hover:bg-slate-50"
                    :class="isSelected(item.id) ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-150'"
                  >
                    <div>
                      <div class="flex items-baseline gap-2">
                        <span class="font-bold text-slate-900" x-text="item.word"></span>
                        <span class="text-[10px] text-slate-500 italic" x-text="'['+item.pronunciation+']'"></span>
                      </div>
                      <div class="text-xs text-slate-600 truncate max-w-[240px]" x-text="item.translation"></div>
                    </div>
                    <div>
                      <span
                        class="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        :class="item.level === 'beginner' ? 'bg-sky-50 text-sky-700' : item.level === 'intermediate' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'"
                        x-text="item.level === 'beginner' ? 'PRIN' : item.level === 'intermediate' ? 'INTE' : 'AVAN'"
                      ></span>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- TAB 2: CUSTOM VOCABULARY -->
            <div x-show="activeTab === 'custom'" class="space-y-4">
              <form @submit.prevent="addCustomWord" class="space-y-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h3 class="text-xs font-bold text-slate-700">Aggiungi Vocabolo Personalizzato</h3>
                
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-[10px] font-medium text-slate-500 mb-0.5">Parola (Coreano) *</label>
                    <input type="text" x-model="newWord" placeholder="예: 친구" class="w-full px-2 py-1 text-xs border border-slate-250 rounded focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-medium text-slate-500 mb-0.5">Traduzione *</label>
                    <input type="text" x-model="newTrans" placeholder="es: Amico" class="w-full px-2 py-1 text-xs border border-slate-250 rounded focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-medium text-slate-500 mb-0.5">Pronuncia (Opzionale)</label>
                  <input type="text" x-model="newPron" placeholder="es: Chin-gu" class="w-full px-2 py-1 text-xs border border-slate-250 rounded focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>

                <div class="border-t border-slate-200 pt-2 mt-1 space-y-1.5">
                  <label class="block text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Frase di esempio (Opzionale)</label>
                  <input type="text" x-model="newExample" placeholder="Frase in Coreano" class="w-full px-2 py-1 text-xs border border-slate-250 rounded focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  <div class="grid grid-cols-2 gap-2">
                    <input type="text" x-model="newExamplePron" placeholder="Pronuncia frase" class="w-full px-2 py-1 text-[11px] border border-slate-250 rounded focus:outline-none focus:ring-1 focus:ring-rose-500" />
                    <input type="text" x-model="newExampleTrans" placeholder="Traduzione frase" class="w-full px-2 py-1 text-[11px] border border-slate-250 rounded focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 items-end pt-1">
                  <div>
                    <label class="block text-[10px] font-medium text-slate-500 mb-0.5">Categoria</label>
                    <input type="text" x-model="newCategory" placeholder="es: Nomi" class="w-full px-2 py-1 text-xs border border-slate-250 rounded focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                  <button type="submit" class="w-full py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded transition-all cursor-pointer">
                    Aggiungi
                  </button>
                </div>

                <template x-if="formError">
                  <div class="text-[10px] text-rose-500 font-medium" x-text="formError"></div>
                </template>
              </form>

              <!-- Custom vocabulary list -->
              <div class="space-y-1 max-h-[220px] overflow-y-auto">
                <template x-for="item in customItems" :key="item.id">
                  <div class="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-white">
                    <div @click="toggleItem(item)" class="flex-1 text-left cursor-pointer">
                      <div class="flex items-baseline gap-1.5">
                        <span class="font-bold text-slate-900" x-text="item.word"></span>
                        <span class="text-[10px] text-slate-500 italic" x-text="'['+item.pronunciation+']'"></span>
                      </div>
                      <div class="text-xs text-slate-600" x-text="item.translation"></div>
                    </div>
                    <button @click.stop="deleteCustomWord(item.id)" class="p-1 text-slate-400 hover:text-rose-500 transition-all cursor-pointer">
                      <!-- Trash SVG -->
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </template>
              </div>
            </div>

            <!-- TAB 3: SHEET SETTINGS -->
            <div x-show="activeTab === 'config'" class="space-y-4">
              <!-- Textual info -->
              <div class="space-y-2.5">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Titolo Foglio</label>
                  <input type="text" x-model="config.title" @input="saveLocal" class="w-full px-3 py-1.5 text-xs border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Sottotitolo</label>
                  <input type="text" x-model="config.subtitle" @input="saveLocal" class="w-full px-3 py-1.5 text-xs border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Istruzioni Personalizzate</label>
                  <textarea x-model="config.customInstructions" @input="saveLocal" rows="2" class="w-full px-3 py-1.5 text-xs border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"></textarea>
                </div>
              </div>

              <hr class="border-slate-100" />

              <!-- Layout & Font Selectors -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Font Coreano</label>
                  <select x-model="config.koreanFont" @change="saveLocal" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500">
                    <option value="Noto Sans KR">Noto Sans KR</option>
                    <option value="Nanum Gothic">Nanum Gothic</option>
                    <option value="Nanum Myeongjo">Nanum Myeongjo</option>
                    <option value="Gowun Batang">Gowun Batang</option>
                    <option value="Gowun Dodum">Gowun Dodum</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Colore Griglia</label>
                  <select x-model="config.gridColor" @change="saveLocal" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500">
                    <option value="green">Verde Smeraldo</option>
                    <option value="blue">Blu Cielo</option>
                    <option value="red">Rosso Rosa</option>
                    <option value="gray">Grigio Classico</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo di Griglia</label>
                  <select x-model="config.gridStyle" @change="saveLocal" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500">
                    <option value="crosshair">Croce centrale (+)</option>
                    <option value="diagonal">Diagonali (x+)</option>
                    <option value="simple">Minimalista</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Formato Carta</label>
                  <select x-model="config.paperSize" @change="saveLocal" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500">
                    <option value="a4">A4 (Standard)</option>
                    <option value="letter">Letter (US)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Modalità Layout</label>
                  <select x-model="config.layoutMode" @change="saveLocal" class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500">
                    <option value="word">Pratica Vocabolo</option>
                    <option value="syllable">Pratica per Sillabe</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Caselle Totali</label>
                  <input type="number" min="5" max="25" x-model="config.practiceBoxesCount" @change="saveLocal" class="w-full px-3 py-1.5 text-xs border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Caselle Guida (Trace)</label>
                  <input type="number" min="0" max="10" x-model="config.traceBoxesCount" @change="saveLocal" class="w-full px-3 py-1.5 text-xs border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
              </div>

              <hr class="border-slate-100" />

              <!-- Toggles -->
              <div class="space-y-2 pt-1">
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" x-model="config.showGridGuides" @change="saveLocal" class="rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
                  Mostra Guide tratteggiate (+)
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" x-model="config.showPronunciation" @change="saveLocal" class="rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
                  Mostra Pronuncia vocabolo
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" x-model="config.showTranslation" @change="saveLocal" class="rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
                  Mostra Traduzione vocabolo
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" x-model="config.showExample" @change="saveLocal" class="rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
                  Mostra Frase di esempio
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" x-model="config.showExamplePron" @change="saveLocal" class="rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
                  Mostra Pronuncia frase d'esempio
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" x-model="config.showExampleTrans" @change="saveLocal" class="rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
                  Mostra Traduzione frase d'esempio
                </label>
              </div>
            </div>

          </div>
        </div>

        <!-- Selected Vocabularies order & clear panel -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-150">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              Fogli di Esercizi Correnti (<span x-text="selectedItems.length"></span>)
            </h2>
            <button @click="clearWorksheet" x-show="selectedItems.length > 0" class="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 transition-all cursor-pointer">
              Svuota
            </button>
          </div>

          <div class="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            <template x-for="(item, idx) in selectedItems" :key="item.id">
              <div class="flex items-center justify-between p-2 rounded-lg border border-slate-150 bg-slate-50/50 hover:bg-slate-50 transition-all text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[10px] text-slate-400" x-text="String(idx + 1).padStart(2, '0')"></span>
                  <span class="font-bold text-slate-900" x-text="item.word"></span>
                  <span class="text-slate-500 truncate max-w-[130px]" x-text="'[' + item.translation + ']'"></span>
                </div>
                <div class="flex items-center gap-1">
                  <button @click="moveUp(idx)" :disabled="idx === 0" class="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer">
                    ▲
                  </button>
                  <button @click="moveDown(idx)" :disabled="idx === selectedItems.length - 1" class="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer">
                    ▼
                  </button>
                  <button @click="removeItem(item.id)" class="p-1 text-slate-400 hover:text-rose-500 cursor-pointer">
                    ✕
                  </button>
                </div>
              </div>
            </template>
            <template x-if="selectedItems.length === 0">
              <div class="text-center py-6 text-xs text-slate-400 font-medium">
                Nessun vocabolo selezionato. Clicca su un vocabolo per aggiungerlo!
              </div>
            </template>
          </div>
        </div>

      </section>

      <!-- RIGHT COLUMN: SHEET PREVIEW -->
      <section class="lg:col-span-7 flex flex-col items-center">
        <!-- Floating header controls -->
        <div class="no-print w-full max-w-[210mm] mb-3 flex items-center justify-between text-xs px-2 text-slate-500 font-medium">
          <div class="flex items-center gap-1">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Anteprima di Stampa</span>
          </div>
          <span x-text="config.paperSize === 'a4' ? 'A4 - 210mm x 297mm' : 'Letter - 8.5in x 11in'"></span>
        </div>

        <div
          id="print-container"
          class="print-area w-full mx-auto bg-white p-6 sm:p-10 text-gray-900 rounded-lg sheet-shadow border border-gray-100"
          :class="config.paperSize === 'a4' ? 'max-w-[210mm]' : 'max-w-[8.5in]'"
          :style="{ minHeight: config.paperSize === 'a4' ? '297mm' : '11in' }"
        >
          <!-- Sheet Printable Header -->
          <div class="border-b-4 border-gray-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900" x-text="config.title || 'FOGLIO DI SCRITTURA COREANA'"></h1>
              <p class="text-sm text-gray-600 mt-1" x-text="config.subtitle || 'Esercizi di scrittura Hangul'"></p>
            </div>
            
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs border border-gray-300 p-2 rounded bg-gray-50/50 min-w-[220px]">
              <div>
                <span class="text-gray-500">Nome:</span>
                <div class="border-b border-gray-350 w-full h-4 mt-1"></div>
              </div>
              <div>
                <span class="text-gray-500">Data:</span>
                <div class="border-b border-gray-350 w-full h-4 mt-1"></div>
              </div>
              <div class="col-span-2 mt-1">
                <span class="text-gray-500">Valutazione:</span>
                <div class="flex gap-1 mt-1 text-gray-300">
                  <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                  <span class="text-[10px] text-gray-400 ml-2 self-center font-sans">(Stelle)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="mb-6 p-3 bg-gray-50 border-l-4 border-gray-400 text-xs text-gray-700 italic font-sans" x-show="config.customInstructions">
            <span class="font-semibold not-italic block mb-1 text-gray-850">Istruzioni:</span>
            <span x-text="config.customInstructions"></span>
          </div>

          <!-- Printable Items List -->
          <div class="space-y-8">
            <template x-if="selectedItems.length === 0">
              <div class="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                Nessun vocabolo selezionato per il foglio di esercizi. Aggiungi vocaboli dalla barra laterale!
              </div>
            </template>

            <template x-for="(item, index) in selectedItems" :key="item.id">
              <div class="print-item-avoid border-b border-gray-100 pb-6 last:border-b-0">
                
                <!-- Word Row Header -->
                <div class="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3 gap-2">
                  <div class="flex flex-wrap items-baseline gap-2 sm:gap-3">
                    <span class="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded" x-text="String(index + 1).padStart(2, '0')"></span>
                    <h2 class="text-2xl font-bold text-gray-900 tracking-wide" :class="getFontClass()" x-text="item.word"></h2>
                    
                    <span class="text-sm font-medium text-gray-500 italic" x-show="config.showPronunciation" x-text="'[' + item.pronunciation + ']'"></span>
                    <span class="text-sm text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100" x-show="config.showTranslation" x-text="item.translation"></span>
                  </div>
                  <span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400 font-sans" x-text="item.category"></span>
                </div>

                <!-- Word Example Sentence -->
                <div class="mb-3 pl-6 border-l-2 border-gray-200 text-xs sm:text-sm space-y-0.5 font-sans" x-show="config.showExample && item.example">
                  <p class="text-gray-800 font-medium tracking-wide text-sm" :class="getFontClass()">
                    <span class="text-gray-400 text-[10px] mr-1 uppercase font-sans">Esempio:</span>
                    <span x-text="item.example"></span>
                  </p>
                  <p class="text-gray-500 text-xs italic" x-show="config.showExamplePron && item.examplePron">
                    Pronuncia: <span x-text="item.examplePron"></span>
                  </p>
                  <p class="text-gray-600 text-xs" x-show="config.showExampleTrans && item.exampleTrans">
                    Traduzione: <span x-text="item.exampleTrans"></span>
                  </p>
                </div>

                <!-- Grid Writing Boxes -->
                <div class="mt-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                  
                  <!-- WORD LAYOUT MODE -->
                  <template x-if="config.layoutMode === 'word'">
                    <div class="flex flex-nowrap gap-1">
                      <template x-for="(box, bIdx) in getWordBoxes(item)" :key="bIdx">
                        <div
                          class="grid-cell w-11 h-11 sm:w-12 sm:h-12 border-2 flex items-center justify-center relative select-none"
                          :class="getGridBorderAndBg(box.isReference)"
                        >
                          <!-- Guides -->
                          <template x-if="box.char !== '' && config.showGridGuides">
                            <div>
                              <template x-if="config.gridStyle === 'crosshair' || config.gridStyle === 'diagonal'">
                                <div>
                                  <div class="grid-guide-line-x" :class="getGridGuideTextClass()"></div>
                                  <div class="grid-guide-line-y" :class="getGridGuideTextClass()"></div>
                                </div>
                              </template>
                              <template x-if="config.gridStyle === 'diagonal'">
                                <div>
                                  <div class="grid-guide-line-diag1" :class="getGridGuideTextClass()"></div>
                                  <div class="grid-guide-line-diag2" :class="getGridGuideTextClass()"></div>
                                </div>
                              </template>
                              <template x-if="config.gridStyle === 'simple'">
                                <div class="grid-guide-line-x opacity-10" :class="getGridGuideTextClass()"></div>
                              </template>
                            </div>
                          </template>

                          <!-- Character -->
                          <template x-if="box.char !== ''">
                            <span
                              :class="getFontClass()"
                              class="text-lg sm:text-xl font-medium"
                              :style="box.isReference ? 'color: #1f2937;' : box.isTrace ? 'color: rgba(203, 213, 225, 0.95);' : 'display: none;'"
                              x-text="box.char"
                            ></span>
                          </template>
                        </div>
                      </template>
                    </div>
                  </template>

                  <!-- SYLLABLE LAYOUT MODE -->
                  <template x-if="config.layoutMode === 'syllable'">
                    <div class="space-y-2">
                      <template x-for="(char, charIdx) in Array.from(item.word).filter(c => c !== ' ')" :key="charIdx">
                        <div class="flex items-center gap-3">
                          <div class="w-10 text-right pr-2">
                            <span class="text-lg font-bold text-slate-400" :class="getFontClass()" x-text="char"></span>
                          </div>
                          
                          <div class="flex flex-nowrap gap-1">
                            <template x-for="(box, bIdx) in getSyllableBoxes(char)" :key="bIdx">
                              <div
                                class="grid-cell w-11 h-11 sm:w-12 sm:h-12 border-2 flex items-center justify-center relative select-none"
                                :class="getGridBorderAndBg(box.isReference)"
                              >
                                <!-- Guides -->
                                <template x-if="box.char !== '' && config.showGridGuides">
                                  <div>
                                    <template x-if="config.gridStyle === 'crosshair' || config.gridStyle === 'diagonal'">
                                      <div>
                                        <div class="grid-guide-line-x" :class="getGridGuideTextClass()"></div>
                                        <div class="grid-guide-line-y" :class="getGridGuideTextClass()"></div>
                                      </div>
                                    </template>
                                    <template x-if="config.gridStyle === 'diagonal'">
                                      <div>
                                        <div class="grid-guide-line-diag1" :class="getGridGuideTextClass()"></div>
                                        <div class="grid-guide-line-diag2" :class="getGridGuideTextClass()"></div>
                                      </div>
                                    </template>
                                    <template x-if="config.gridStyle === 'simple'">
                                      <div class="grid-guide-line-x opacity-10" :class="getGridGuideTextClass()"></div>
                                    </template>
                                  </div>
                                </template>

                                <!-- Character -->
                                <template x-if="box.char !== ''">
                                  <span
                                    :class="getFontClass()"
                                    class="text-lg sm:text-xl font-medium"
                                    :style="box.isReference ? 'color: #1f2937;' : box.isTrace ? 'color: rgba(203, 213, 225, 0.95);' : 'display: none;'"
                                    x-text="box.char"
                                  ></span>
                                </template>
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>

                </div>
              </div>
            </template>
          </div>

          <!-- Printable Footer -->
          <div class="mt-12 pt-4 border-t border-gray-200 text-center text-[10px] text-gray-400 flex justify-between items-center font-sans">
            <span>Fatto con il Generatore di Scrittura Coreana</span>
            <span>Pagina 1 di 1</span>
          </div>
        </div>

      </section>
    </main>

    <!-- Alpine State Setup Script -->
    <script>
      function appState() {
        return {
          config: ${embeddedConfig},
          selectedItems: ${embeddedSelected},
          customItems: ${embeddedCustom},
          presets: ${embeddedPresets},
          activeTab: 'presets',
          searchTerm: '',
          levelFilter: 'all',

          newWord: '',
          newPron: '',
          newTrans: '',
          newExample: '',
          newExamplePron: '',
          newExampleTrans: '',
          newCategory: '',
          formError: '',

          init() {
            const savedCustom = localStorage.getItem('korean_custom_vocab_html');
            if (savedCustom) {
              try { this.customItems = JSON.parse(savedCustom); } catch(e){}
            }
            const savedConfig = localStorage.getItem('korean_config_html');
            if (savedConfig) {
              try { this.config = JSON.parse(savedConfig); } catch(e){}
            }
            if (this.selectedItems.length === 0) {
              this.selectedItems = this.presets.slice(0, 3);
            }
          },

          saveLocal() {
            localStorage.setItem('korean_custom_vocab_html', JSON.stringify(this.customItems));
            localStorage.setItem('korean_config_html', JSON.stringify(this.config));
          },

          get allAvailableItems() {
            return [...this.presets, ...this.customItems];
          },

          get filteredVocabulary() {
            return this.allAvailableItems.filter(item => {
              const term = this.searchTerm.toLowerCase();
              const matchesSearch = 
                item.word.toLowerCase().includes(term) ||
                item.translation.toLowerCase().includes(term) ||
                (item.pronunciation && item.pronunciation.toLowerCase().includes(term)) ||
                (item.category && item.category.toLowerCase().includes(term));
                
              const matchesLevel = 
                this.levelFilter === 'all' || 
                item.level === this.levelFilter;

              return matchesSearch && matchesLevel;
            });
          },

          toggleItem(item) {
            const idx = this.selectedItems.findIndex(i => i.id === item.id);
            if (idx !== -1) {
              this.selectedItems.splice(idx, 1);
            } else {
              this.selectedItems.push(item);
            }
          },

          isSelected(id) {
            return this.selectedItems.some(i => i.id === id);
          },

          removeItem(id) {
            this.selectedItems = this.selectedItems.filter(item => item.id !== id);
          },

          moveUp(index) {
            if (index === 0) return;
            const temp = this.selectedItems[index];
            this.selectedItems[index] = this.selectedItems[index - 1];
            this.selectedItems[index - 1] = temp;
          },

          moveDown(index) {
            if (index === this.selectedItems.length - 1) return;
            const temp = this.selectedItems[index];
            this.selectedItems[index] = this.selectedItems[index + 1];
            this.selectedItems[index + 1] = temp;
          },

          clearWorksheet() {
            this.selectedItems = [];
          },

          loadPresetTheme(theme) {
            let ids = [];
            if (theme === 'greetings') {
              ids = ['b1', 'b2', 'b3'];
              this.config.title = 'ESERCIZI DI SCRITTURA: SALUTI';
              this.config.subtitle = 'Impara le formule di cortesia coreane più importanti';
            } else if (theme === 'food') {
              ids = ['b8', 'b9', 'i10'];
              this.config.title = 'ESERCIZI DI SCRITTURA: CIBO & VITA';
              this.config.subtitle = 'Pratica con i vocaboli alimentari e sociali di base';
            } else if (theme === 'verbs') {
              ids = ['i1', 'i4', 'i8'];
              this.config.title = 'ESERCIZI DI SCRITTURA: VERBI & BENESSERE';
              this.config.subtitle = 'Espandere il vocabolario con azioni e salute quotidiana';
            } else if (theme === 'idioms') {
              ids = ['a1', 'a2', 'a3', 'a4'];
              this.config.title = '고사성어: ESPRESSIONI IDIOMATICHE';
              this.config.subtitle = 'Pratica di scrittura avanzata con proverbi coreani di quattro caratteri';
            }
            this.selectedItems = this.presets.filter(item => ids.includes(item.id));
            this.saveLocal();
          },

          addCustomWord() {
            this.formError = '';
            if (!this.newWord.trim()) {
              this.formError = 'La parola in coreano è obbligatoria.';
              return;
            }
            if (!this.newTrans.trim()) {
              this.formError = 'La traduzione in italiano è obbligatoria.';
              return;
            }

            const newItem = {
              id: 'custom-' + Date.now(),
              word: this.newWord.trim(),
              pronunciation: this.newPron.trim() || 'Non specificata',
              translation: this.newTrans.trim(),
              example: this.newExample.trim(),
              examplePron: this.newExamplePron.trim(),
              exampleTrans: this.newExampleTrans.trim(),
              category: this.newCategory.trim() || 'Personalizzato',
              level: 'custom'
            };

            this.customItems.unshift(newItem);
            this.selectedItems.push(newItem);
            this.saveLocal();

            this.newWord = '';
            this.newPron = '';
            this.newTrans = '';
            this.newExample = '';
            this.newExamplePron = '';
            this.newExampleTrans = '';
            this.newCategory = '';
          },

          deleteCustomWord(id) {
            this.customItems = this.customItems.filter(item => item.id !== id);
            this.selectedItems = this.selectedItems.filter(item => item.id !== id);
            this.saveLocal();
          },

          printSheet() {
            window.print();
          },

          getWordBoxes(item) {
            const syllables = Array.from(item.word);
            const totalBoxes = parseInt(this.config.practiceBoxesCount);
            const traceCopies = parseInt(this.config.traceBoxesCount);
            const wordLen = syllables.length;
            const cells = [];

            for (let i = 0; i < wordLen; i++) {
              if (cells.length < totalBoxes) {
                cells.push({ char: syllables[i], isReference: true, isTrace: false });
              }
            }

            for (let t = 0; t < traceCopies; t++) {
              for (let i = 0; i < wordLen; i++) {
                if (cells.length < totalBoxes) {
                  cells.push({ char: syllables[i], isReference: false, isTrace: true });
                }
              }
            }

            while (cells.length < totalBoxes) {
              cells.push({ char: '', isReference: false, isTrace: false });
            }

            return cells;
          },

          getSyllableBoxes(char) {
            const totalBoxes = parseInt(this.config.practiceBoxesCount);
            const traceCopies = parseInt(this.config.traceBoxesCount);
            const cells = [];

            cells.push({ char: char, isReference: true, isTrace: false });

            for (let t = 0; t < traceCopies; t++) {
              if (cells.length < totalBoxes) {
                cells.push({ char: char, isReference: false, isTrace: true });
              }
            }

            while (cells.length < totalBoxes) {
              cells.push({ char: '', isReference: false, isTrace: false });
            }

            return cells;
          },

          getGridBorderAndBg(isRef) {
            const c = this.config.gridColor;
            let border = '';
            let bg = '';
            if (c === 'green') {
              border = 'border-emerald-250 print:border-emerald-300';
              bg = isRef ? 'bg-gray-50/40' : 'bg-emerald-50/20';
            } else if (c === 'blue') {
              border = 'border-sky-250 print:border-sky-300';
              bg = isRef ? 'bg-gray-50/40' : 'bg-sky-50/20';
            } else if (c === 'red') {
              border = 'border-rose-250 print:border-rose-300';
              bg = isRef ? 'bg-gray-50/40' : 'bg-rose-50/20';
            } else {
              border = 'border-gray-300 print:border-gray-450';
              bg = isRef ? 'bg-gray-50/40' : 'bg-gray-50/10';
            }
            return border + ' ' + bg;
          },

          getGridGuideTextClass() {
            const c = this.config.gridColor;
            if (c === 'green') return 'text-emerald-500/30';
            if (c === 'blue') return 'text-sky-500/30';
            if (c === 'red') return 'text-rose-500/30';
            return 'text-gray-400/35';
          },

          getFontClass() {
            const f = this.config.koreanFont;
            if (f === 'Nanum Gothic') return 'font-gothic';
            if (f === 'Nanum Myeongjo') return 'font-myeongjo';
            if (f === 'Gowun Batang') return 'font-gowun-batang';
            if (f === 'Gowun Dodum') return 'font-gowun-dodum';
            return 'font-noto';
          }
        }
      }
    </script>
  </body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generatore-fogli-scrittura-coreano.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const allAvailableItems = [...PRESET_VOCABULARY, ...customItems];
  
  const filteredVocabulary = allAvailableItems.filter(item => {
    const matchesSearch = 
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.pronunciation && item.pronunciation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesLevel = 
      selectedLevelFilter === 'all' || 
      item.level === selectedLevelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER SECTION (HIDDEN ON PRINT) */}
      <header className="no-print bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
              <span className="text-xl font-bold text-rose-500 font-mono tracking-wider flex items-center">
                한<span className="text-sky-400">국</span>
              </span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-2">
                Generatore Fogli Scrittura Coreano
                <span className="text-[10px] px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full font-medium hidden sm:inline-block">
                  No IA / Offline
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Disegna e scarica fogli PDF personalizzati per la scrittura Hangul
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleDownloadHtmlApp}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-lg border border-emerald-600/50 transition-all cursor-pointer"
              title="Scarica l'applicazione completa come singolo file HTML autonomo (funziona anche offline)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Scarica App HTML</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600/50 transition-all cursor-pointer"
              title="Esporta o Importa vocaboli in formato JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importa / Esporta</span>
            </button>
            
            <button
              onClick={handlePrint}
              disabled={selectedItems.length === 0}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg shadow transition-all cursor-pointer ${
                selectedItems.length === 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-rose-500/20 active:scale-[0.98]'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Esporta in PDF / Stampa</span>
            </button>
          </div>
          
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CONTROLS & SIDEBAR (HIDDEN ON PRINT) */}
        <section className="no-print lg:col-span-5 space-y-6 flex flex-col h-full lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
          
          {/* Quick theme loader */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Modelli Pronti all'Uso (Quick Presets)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loadPresetTheme('greetings')}
                className="text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 transition-all text-xs cursor-pointer group"
              >
                <span className="font-bold text-slate-700 group-hover:text-rose-600 block">👋 Saluti e Basi</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">안녕하세요, 감사합니다...</span>
              </button>
              <button
                onClick={() => loadPresetTheme('food')}
                className="text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 transition-all text-xs cursor-pointer group"
              >
                <span className="font-bold text-slate-700 group-hover:text-amber-600 block">🍚 Cibo & Vita</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">물, 맛있어요, 선물...</span>
              </button>
              <button
                onClick={() => loadPresetTheme('verbs')}
                className="text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 transition-all text-xs cursor-pointer group"
              >
                <span className="font-bold text-slate-700 group-hover:text-sky-600 block">✏️ Verbi Quotidiani</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">공부하다, 여행하다...</span>
              </button>
              <button
                onClick={() => loadPresetTheme('idioms')}
                className="text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-xs cursor-pointer group"
              >
                <span className="font-bold text-slate-700 group-hover:text-emerald-600 block">🀄 Proverbi Sajaseong-eo</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">작심삼일, 사필귀정...</span>
              </button>
            </div>
          </div>

          {/* Configuration / Vocab Selection Workspace */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            
            {/* Tab navigation */}
            <div className="flex border-b border-slate-150 bg-slate-50/50">
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex justify-center items-center gap-1.5 ${
                  activeTab === 'presets'
                    ? 'border-rose-500 text-rose-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Dizionario
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex justify-center items-center gap-1.5 ${
                  activeTab === 'custom'
                    ? 'border-rose-500 text-rose-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Crea Vocaboli
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex justify-center items-center gap-1.5 ${
                  activeTab === 'config'
                    ? 'border-rose-500 text-rose-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Layout Foglio
              </button>
            </div>

            {/* TAB CONTENT 1: PRESET DICTIONARY SELECTION */}
            {activeTab === 'presets' && (
              <div className="p-4 flex flex-col overflow-hidden max-h-[420px]">
                
                {/* Search and Filters */}
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    placeholder="Cerca vocabolo, significato, pronuncia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-50"
                  />
                  
                  <div className="flex gap-1 overflow-x-auto pb-1">
                    {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => {
                      const label = 
                        level === 'all' ? 'Tutti' :
                        level === 'beginner' ? 'Principiante' :
                        level === 'intermediate' ? 'Intermedio' : 'Avanzato';
                      return (
                        <button
                          key={level}
                          onClick={() => setSelectedLevelFilter(level)}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                            selectedLevelFilter === level
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bulk selections */}
                <div className="flex justify-between items-center text-xs text-slate-500 pb-2 mb-2 border-b border-slate-100">
                  <span>Trovati {filteredVocabulary.length} vocaboli</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectAllFiltered(filteredVocabulary)}
                      className="text-rose-600 hover:text-rose-700 font-bold transition-all cursor-pointer"
                    >
                      Seleziona Tutti
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => handleDeselectAllFiltered(filteredVocabulary)}
                      className="text-slate-500 hover:text-slate-700 font-bold transition-all cursor-pointer"
                    >
                      Deseleziona
                    </button>
                  </div>
                </div>

                {/* Vocabulary check list */}
                <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 min-h-[180px]">
                  {filteredVocabulary.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Nessun vocabolo corrispondente ai filtri.
                    </div>
                  ) : (
                    filteredVocabulary.map((item) => {
                      const isSelected = selectedItems.some(i => i.id === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleToggleItem(item)}
                          className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50'
                              : 'border-slate-150 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm tracking-wide flex items-baseline gap-1.5">
                                <span className="font-noto">{item.word}</span>
                                {item.pronunciation && (
                                  <span className="text-[10px] font-normal text-slate-400 italic font-sans">
                                    [{item.pronunciation}]
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">
                                {item.translation}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                              item.level === 'beginner' ? 'bg-green-100 text-green-700' :
                              item.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                              item.level === 'advanced' ? 'bg-purple-100 text-purple-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {item.level === 'beginner' ? 'Princ' :
                               item.level === 'intermediate' ? 'Inter' :
                               item.level === 'advanced' ? 'Avanz' : 'Pers'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: CUSTOM VOCABULARY CREATION */}
            {activeTab === 'custom' && (
              <div className="p-4 flex flex-col overflow-y-auto max-h-[420px]">
                
                <form onSubmit={handleAddCustomWord} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 border-b border-slate-100 pb-1.5">
                    Aggiungi Nuovo Vocabolo
                  </h4>

                  {formError && (
                    <div className="p-2 bg-rose-50 border border-rose-100 text-rose-600 rounded text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Parola Coreana (Hangul) *
                      </label>
                      <input
                        type="text"
                        placeholder="예: 친구, 가다"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50 font-noto font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Pronuncia / Romanizzazione
                      </label>
                      <input
                        type="text"
                        placeholder="예: Chin-gu, Ga-da"
                        value={newPron}
                        onChange={(e) => setNewPron(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Traduzione in Italiano *
                      </label>
                      <input
                        type="text"
                        placeholder="es: Amico, Andare"
                        value={newTrans}
                        onChange={(e) => setNewTrans(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Esempio Pratico (Opzionale)
                    </span>
                    
                    <div>
                      <label className="block text-[9px] text-slate-500 mb-0.5">Frase in Coreano</label>
                      <input
                        type="text"
                        placeholder="es: 제 친구는 이탈리아 사람입니다."
                        value={newExample}
                        onChange={(e) => setNewExample(e.target.value)}
                        className="w-full text-[11px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50 font-noto"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">Pronuncia Frase</label>
                        <input
                          type="text"
                          placeholder="es: Je chin-gu-neun..."
                          value={newExamplePron}
                          onChange={(e) => setNewExamplePron(e.target.value)}
                          className="w-full text-[10px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">Traduzione Frase</label>
                        <input
                          type="text"
                          placeholder="es: Il mio amico è italiano."
                          value={newExampleTrans}
                          onChange={(e) => setNewExampleTrans(e.target.value)}
                          className="w-full text-[10px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Categoria / Argomento (es: Verbi, Cucina, ecc.)
                    </label>
                    <input
                      type="text"
                      placeholder="es: Verbi"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Aggiungi Vocabolo Personalizzato
                  </button>
                </form>

                {/* Custom list summary */}
                {customItems.length > 0 && (
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] font-bold uppercase text-slate-400">
                        Vocaboli Personalizzati Creati ({customItems.length})
                      </h4>
                      <button
                        onClick={() => {
                          if (confirm('Sei sicuro di voler eliminare tutti i vocaboli personalizzati salvati?')) {
                            setCustomItems([]);
                          }
                        }}
                        className="text-[9px] text-rose-500 hover:underline font-bold"
                      >
                        Cancella Tutti
                      </button>
                    </div>
                    
                    <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                      {customItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-1.5 bg-slate-50 rounded text-xs border border-slate-150">
                          <div>
                            <span className="font-noto font-bold text-slate-800">{item.word}</span>
                            <span className="text-[10px] text-slate-500 ml-1.5">({item.translation})</span>
                          </div>
                          <button
                            onClick={() => handleDeleteCustomWord(item.id)}
                            className="text-slate-400 hover:text-rose-500 p-0.5 transition-all cursor-pointer"
                            title="Elimina permanentemente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT 3: WORKSHEET DESIGN PARAMETERS */}
            {activeTab === 'config' && (
              <div className="p-4 space-y-4 overflow-y-auto max-h-[420px] text-xs text-slate-600">
                
                {/* Titles */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 border-b border-slate-100 pb-1">
                    Titoli del Foglio
                  </h4>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-0.5">Titolo Principale</label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-0.5">Sottotitolo</label>
                    <input
                      type="text"
                      value={config.subtitle}
                      onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50"
                    />
                  </div>
                </div>

                {/* Layout Mode */}
                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase border-b border-slate-100 pb-1">
                    Modalità Esercizio
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, layoutMode: 'word' })}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        config.layoutMode === 'word'
                          ? 'border-rose-400 bg-rose-50/40 text-rose-700 font-bold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px]">📝 Vocabolo Intero</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 font-normal">Una riga per parola (es: 안-녕-하-세-요)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, layoutMode: 'syllable' })}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        config.layoutMode === 'syllable'
                          ? 'border-rose-400 bg-rose-50/40 text-rose-700 font-bold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px]">🔠 Singola Sillaba</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 font-normal">Una riga per ogni carattere (es: 안 / 녕 / 하...)</div>
                    </button>
                  </div>
                </div>

                {/* Grid Customization */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 pb-1">
                    Stile della Griglia Hangul
                  </h4>
                  
                  {/* Grid style picker */}
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase mb-1">Stile Guida</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['crosshair', 'diagonal', 'simple', 'empty'] as GridStyle[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => setConfig({ ...config, gridStyle: style })}
                          className={`py-1.5 px-2 rounded border text-center transition-all cursor-pointer ${
                            config.gridStyle === style
                              ? 'bg-slate-800 text-white border-slate-800 font-semibold'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {style === 'crosshair' && '➕ Croce (+)'}
                          {style === 'diagonal' && '✳️ Diagonali (X)'}
                          {style === 'simple' && '➖ Linea orizzontale'}
                          {style === 'empty' && '⬜ Quadrato vuoto'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grid Line Color */}
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase mb-1">Colore Linee Griglia</label>
                    <div className="flex gap-2">
                      {(['green', 'blue', 'red', 'gray'] as GridLineColor[]).map((color) => {
                        const bgClasses = 
                          color === 'green' ? 'bg-emerald-100 border-emerald-400' :
                          color === 'blue' ? 'bg-sky-100 border-sky-400' :
                          color === 'red' ? 'bg-rose-100 border-rose-400' : 'bg-gray-200 border-gray-400';
                        return (
                          <button
                            key={color}
                            onClick={() => setConfig({ ...config, gridColor: color })}
                            className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${bgClasses} ${
                              config.gridColor === color ? 'scale-110 shadow-sm ring-2 ring-slate-800/20' : 'opacity-70'
                            }`}
                            title={color}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tracing parameters */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 pb-1">
                    Regolazioni Tracciatura & Spazi
                  </h4>
                  
                  {/* Trace count */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase">Caselle di Ricalco Grigio</label>
                      <span className="font-bold text-slate-800">{config.traceBoxesCount}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={config.traceBoxesCount}
                      onChange={(e) => setConfig({ ...config, traceBoxesCount: parseInt(e.target.value) })}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                      <span>Nessuno</span>
                      <span>1 copia</span>
                      <span>2 copie</span>
                      <span>3 copie</span>
                    </div>
                  </div>

                  {/* Columns Count */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase">Totale caselle per riga</label>
                      <span className="font-bold text-slate-800">{config.practiceBoxesCount}</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="14"
                      value={config.practiceBoxesCount}
                      onChange={(e) => setConfig({ ...config, practiceBoxesCount: parseInt(e.target.value) })}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                      <span>6 (Più larghe)</span>
                      <span>10</span>
                      <span>14 (Più strette)</span>
                    </div>
                  </div>
                </div>

                {/* Font Choices */}
                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase border-b border-slate-100 pb-1">
                    Font per il Coreano (Stile Lettera)
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Noto Sans KR', desc: 'Moderno / Pulito (Sans-serif)' },
                      { id: 'Nanum Gothic', desc: 'Standard Chiara (Gothic)' },
                      { id: 'Nanum Myeongjo', desc: 'Classica / Tradizionale (Serif pennello)' },
                      { id: 'Gowun Batang', desc: 'Sottile ed Elegante (Warm Serif)' },
                      { id: 'Gowun Dodum', desc: 'Arrotondata / Naturale (Handwritten)' },
                    ].map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setConfig({ ...config, koreanFont: font.id as any })}
                        className={`w-full p-2 rounded border text-left flex justify-between items-center cursor-pointer transition-all ${
                          config.koreanFont === font.id
                            ? 'border-slate-800 bg-slate-800 text-white font-semibold shadow-sm'
                            : 'border-slate-250 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-[11px]">{font.id}</div>
                          <div className={`text-[9px] mt-0.5 ${config.koreanFont === font.id ? 'text-slate-300' : 'text-slate-400'}`}>
                            {font.desc}
                          </div>
                        </div>
                        <span className={`text-base font-bold ml-2 ${
                          font.id === 'Nanum Myeongjo' ? 'font-myeongjo' :
                          font.id === 'Gowun Batang' ? 'font-gowun-batang' :
                          font.id === 'Gowun Dodum' ? 'font-gowun-dodum' :
                          font.id === 'Nanum Gothic' ? 'font-gothic' : 'font-noto'
                        }`}>
                          한글
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paper settings */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase border-b border-slate-100 pb-1">
                    Dimensioni Carta & Visualizzazione
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, paperSize: 'a4' })}
                      className={`p-1.5 rounded border text-center transition-all cursor-pointer ${
                        config.paperSize === 'a4'
                          ? 'border-slate-800 bg-slate-800 text-white font-semibold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      A4 (210 × 297 mm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, paperSize: 'letter' })}
                      className={`p-1.5 rounded border text-center transition-all cursor-pointer ${
                        config.paperSize === 'letter'
                          ? 'border-slate-800 bg-slate-800 text-white font-semibold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      Letter (8.5" × 11")
                    </button>
                  </div>
                </div>

                {/* Toggle details */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 pb-1">
                    Elementi da Visualizzare
                  </h4>
                  
                  {[
                    { key: 'showPronunciation', label: 'Pronuncia Romanizzata Vocabolo' },
                    { key: 'showTranslation', label: 'Traduzione Vocabolo' },
                    { key: 'showExample', label: 'Frase di Esempio Pratico' },
                    { key: 'showExamplePron', label: 'Pronuncia dell\'Esempio' },
                    { key: 'showExampleTrans', label: 'Traduzione dell\'Esempio' },
                    { key: 'showGridGuides', label: 'Linee Guida Interne alle Caselle' },
                  ].map((toggle) => (
                    <label key={toggle.key} className="flex items-center gap-2 py-1 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(config as any)[toggle.key]}
                        onChange={(e) => setConfig({ ...config, [toggle.key]: e.target.checked })}
                        className="rounded text-rose-500 border-slate-300 focus:ring-rose-500 accent-rose-500 h-3.5 w-3.5"
                      />
                      <span>{toggle.label}</span>
                    </label>
                  ))}
                </div>

                {/* Instructions Text Area */}
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-0.5">Nota / Istruzioni in testata</label>
                  <textarea
                    rows={3}
                    value={config.customInstructions}
                    onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
                    placeholder="Scrivi qui consigli, istruzioni o un messaggio per i tuoi studenti..."
                    className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50 resize-y"
                  />
                </div>

              </div>
            )}

          </div>

          {/* ACTIVE SELECTED WORDS MANAGER */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 min-h-[220px]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  Vocaboli nel Foglio ({selectedItems.length})
                </h3>
                <p className="text-[10px] text-slate-400">Ordine di stampa sul foglio PDF</p>
              </div>
              {selectedItems.length > 0 && (
                <button
                  onClick={handleClearWorksheet}
                  className="text-[10px] text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Undo className="w-3 h-3" />
                  Svuota
                </button>
              )}
            </div>

            {selectedItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 border-2 border-dashed border-slate-150 rounded-xl bg-slate-50/50">
                <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-500">Il foglio è vuoto</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                  Fai clic sulla tab <b>"Dizionario"</b> qui sopra o usa i <b>"Modelli pronti"</b> per aggiungere vocaboli da esercitare!
                </p>
              </div>
            ) : (
              <div className="space-y-1 overflow-y-auto max-h-[260px] flex-1 pr-1">
                {selectedItems.map((item, index) => (
                  <div
                    key={`${item.id}-list-${index}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100/70 border border-slate-200 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-200 w-4.5 h-4.5 flex items-center justify-center rounded-full">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-noto font-extrabold text-slate-800">{item.word}</span>
                        <span className="text-slate-500 ml-1">[{item.pronunciation}]</span>
                        <span className="text-slate-400 ml-1">— {item.translation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move up */}
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className={`p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer ${
                          index === 0 ? 'opacity-35 cursor-not-allowed' : ''
                        }`}
                        title="Sposta su"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      
                      {/* Move down */}
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === selectedItems.length - 1}
                        className={`p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer ${
                          index === selectedItems.length - 1 ? 'opacity-35 cursor-not-allowed' : ''
                        }`}
                        title="Sposta giù"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>

                      <span className="text-slate-250 w-px h-3 bg-slate-200 mx-0.5" />

                      {/* Delete */}
                      <button
                        onClick={() => handleRemoveFromWorksheet(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Rimuovi dal foglio"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HELP INFO BOX */}
          <div className="bg-slate-800 text-slate-200 p-4 rounded-xl shadow-sm space-y-2 text-xs border border-slate-750">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Info className="w-4 h-4 text-sky-400" />
              Guida alla Stampa in PDF Perfect
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-300 text-[11px]">
              <li><b>Usa un browser moderno</b>: Chrome, Edge, Safari o Firefox offrono la migliore fedeltà per i font coreani.</li>
              <li>Clicca su <b>"Esporta in PDF / Stampa"</b> in alto per aprire la stampante del sistema.</li>
              <li>Scegli <b>"Salva come PDF"</b> come destinazione di stampa.</li>
              <li><b>MOLTO IMPORTANTE</b>: Abilita l'opzione <b>"Grafica di sfondo"</b> (Background Graphics) nelle opzioni aggiuntive, altrimenti le linee delle griglie colorate non verranno stampate!</li>
              <li>Imposta i margini su <b>"Nessuno"</b> o <b>"Predefiniti"</b> per una perfetta impaginazione.</li>
            </ul>
          </div>

        </section>

        {/* RIGHT COLUMN: INTERACTIVE LIVE PREVIEW */}
        <section className="lg:col-span-7 flex flex-col items-center">
          
          {/* Info banner above preview (hidden on print) */}
          <div className="no-print w-full bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-600 font-bold flex items-center gap-1">
                Anteprima Foglio di Lavoro
                <span className="font-normal text-slate-400">({config.paperSize.toUpperCase()})</span>
              </span>
            </div>
            
            <div className="text-slate-400 text-[10px] flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Ciò che vedi qui è esattamente ciò che verrà stampato in PDF</span>
            </div>
          </div>

          {/* Workspace Wrapper holding the paper */}
          <div className="w-full overflow-x-auto p-2 bg-slate-200/55 border border-slate-200/80 rounded-2xl flex justify-center py-6 shadow-inner sheet-preview-container">
            <WorksheetPreview items={selectedItems} config={config} />
          </div>

        </section>

      </main>

      {/* FOOTER SECTION (HIDDEN ON PRINT) */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>Generatore Fogli Scrittura Coreana — Strumento per studenti di lingua coreana ed educatori.</p>
          <p>
            Sviluppato localmente, senza l'uso di server o intelligenza artificiale per un caricamento immediato e la massima privacy.
          </p>
        </div>
      </footer>

      {/* JSON IMPORT/EXPORT MODAL (HIDDEN ON PRINT) */}
      {showJsonModal && (
        <div className="no-print fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-rose-500" />
                  Importa / Esporta Vocaboli JSON
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Copia, salva o incolla le liste di vocaboli in formato compatibile.</p>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {jsonError && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-100 text-rose-600 rounded text-xs font-medium">
                {jsonError}
              </div>
            )}

            <div className="flex-1 min-h-[220px] flex flex-col mb-4">
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Dati JSON dei Vocaboli</label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='[\n  {\n    "word": "한국",\n    "translation": "Corea",\n    "pronunciation": "Han-guk"\n  }\n]'
                className="w-full flex-1 text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50 font-mono resize-none h-[250px]"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(jsonText);
                  alert('JSON copiato negli appunti!');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-all"
              >
                Copia JSON negli Appunti
              </button>
              
              <div className="flex-1" />

              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-all"
              >
                Annulla
              </button>
              
              <button
                onClick={handleImportJson}
                className="px-4 py-1.5 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-lg cursor-pointer transition-all shadow"
              >
                Carica / Importa nel Foglio
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
