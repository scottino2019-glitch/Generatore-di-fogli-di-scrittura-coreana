/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VocabularyItem, WorksheetConfig, GridStyle } from '../types';

interface WorksheetPreviewProps {
  items: VocabularyItem[];
  config: WorksheetConfig;
}

// Helper component to render a single writing box
interface GridCellProps {
  key?: string;
  char: string;
  isReference?: boolean;
  isTrace?: boolean;
  gridColors: { border: string; text: string; bg: string };
  fontClass: string;
  gridStyle: GridStyle;
  showGridGuides: boolean;
}

function GridCell({
  char,
  isReference = false,
  isTrace = false,
  gridColors,
  fontClass,
  gridStyle,
  showGridGuides,
}: GridCellProps) {
  const isSpace = char === ' ' || char === '';
  
  return (
    <div
      className={`grid-cell w-11 h-11 sm:w-12 sm:h-12 border-2 ${
        gridColors.border
      } flex items-center justify-center relative select-none ${
        isReference ? 'bg-gray-50/40 print:bg-transparent' : gridColors.bg
      }`}
    >
      {/* Syllable Guidelines (Crosshairs / Diagonals) */}
      {!isSpace && showGridGuides && (
        <>
          {gridStyle === 'crosshair' && (
            <>
              <div className={`grid-guide-line-x ${gridColors.text}`} />
              <div className={`grid-guide-line-y ${gridColors.text}`} />
            </>
          )}
          {gridStyle === 'diagonal' && (
            <>
              <div className={`grid-guide-line-x ${gridColors.text}`} />
              <div className={`grid-guide-line-y ${gridColors.text}`} />
              <div className={`grid-guide-line-diag1 ${gridColors.text}`} />
              <div className={`grid-guide-line-diag2 ${gridColors.text}`} />
            </>
          )}
          {gridStyle === 'simple' && (
            <div className={`grid-guide-line-x ${gridColors.text} opacity-10`} />
          )}
        </>
      )}

      {/* The character itself */}
      {!isSpace && (
        <span
          className={`${fontClass} ${
            isReference
              ? 'text-lg sm:text-xl font-medium text-gray-850 print:text-black print:font-semibold'
              : isTrace
              ? 'text-lg sm:text-xl text-gray-300/80 print:text-gray-300/90 font-light'
              : 'hidden'
          }`}
          style={isTrace ? { color: 'rgba(203, 213, 225, 0.95)', WebkitTextFillColor: 'rgba(203, 213, 225, 0.95)' } : {}}
        >
          {char}
        </span>
      )}
    </div>
  );
}

export default function WorksheetPreview({ items, config }: WorksheetPreviewProps) {
  // Map font selections to their Tailwind classes or inline styles
  const getFontFamily = () => {
    switch (config.koreanFont) {
      case 'Nanum Gothic':
        return 'font-gothic';
      case 'Nanum Myeongjo':
        return 'font-myeongjo';
      case 'Gowun Batang':
        return 'font-gowun-batang';
      case 'Gowun Dodum':
        return 'font-gowun-dodum';
      case 'Noto Sans KR':
      default:
        return 'font-noto';
    }
  };

  // Map grid colors to Tailwind color classes
  const getGridColorClasses = () => {
    switch (config.gridColor) {
      case 'green':
        return {
          border: 'border-emerald-250 print:border-emerald-300',
          text: 'text-emerald-500/30 print:text-emerald-500/40',
          bg: 'bg-emerald-50/20 print:bg-transparent',
        };
      case 'blue':
        return {
          border: 'border-sky-250 print:border-sky-300',
          text: 'text-sky-500/30 print:text-sky-500/40',
          bg: 'bg-sky-50/20 print:bg-transparent',
        };
      case 'red':
        return {
          border: 'border-rose-250 print:border-rose-300',
          text: 'text-rose-500/30 print:text-rose-500/40',
          bg: 'bg-rose-50/20 print:bg-transparent',
        };
      case 'gray':
      default:
        return {
          border: 'border-gray-300 print:border-gray-450',
          text: 'text-gray-400/35 print:text-gray-400/40',
          bg: 'bg-gray-50/10 print:bg-transparent',
        };
    }
  };

  const gridColors = getGridColorClasses();
  const fontClass = getFontFamily();

  return (
    <div
      id="print-container"
      className={`print-area w-full mx-auto bg-white p-6 sm:p-10 text-gray-900 rounded-lg sheet-shadow border border-gray-100 ${
        config.paperSize === 'a4' ? 'max-w-[210mm]' : 'max-w-[8.5in]'
      }`}
      style={{ minHeight: config.paperSize === 'a4' ? '297mm' : '11in' }}
    >
      {/* Printable Sheet Header */}
      <div className="border-b-4 border-gray-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            {config.title || 'FOGLIO DI SCRITTURA COREANA'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {config.subtitle || 'Esercizi di scrittura Hangul personalizzati'}
          </p>
        </div>
        
        {/* Student metadata box */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs border border-gray-300 p-2 rounded bg-gray-50/50 min-w-[220px]">
          <div>
            <span className="text-gray-500 font-sans">Nome:</span>
            <div className="border-b border-gray-350 w-full h-4 mt-1" />
          </div>
          <div>
            <span className="text-gray-500 font-sans">Data:</span>
            <div className="border-b border-gray-350 w-full h-4 mt-1" />
          </div>
          <div className="col-span-2 mt-1">
            <span className="text-gray-500 font-sans">Valutazione:</span>
            <div className="flex gap-1 mt-1 text-gray-300">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i} className="text-base leading-none">☆</span>
              ))}
              <span className="text-[10px] text-gray-400 ml-2 self-center font-sans">(Stelle)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom instructions / teacher note */}
      {config.customInstructions && (
        <div className="mb-6 p-3 bg-gray-50 border-l-4 border-gray-400 text-xs text-gray-700 italic font-sans">
          <span className="font-semibold not-italic block mb-1 text-gray-850">Istruzioni:</span>
          {config.customInstructions}
        </div>
      )}

      {/* Words list */}
      <div className="space-y-8">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-lg font-sans">
            Nessun vocabolo selezionato per il foglio di esercizi. Aggiungi vocaboli dalla barra laterale!
          </div>
        ) : (
          items.map((item, index) => {
            const syllables = Array.from(item.word);

            return (
              <div
                key={`${item.id}-${index}`}
                id={`exercise-${item.id}`}
                className="print-item-avoid border-b border-gray-100 pb-6 last:border-b-0"
              >
                {/* Word Header Block */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3 gap-2">
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className={`${fontClass} text-2xl font-bold text-gray-900 tracking-wide`}>
                      {item.word}
                    </h2>
                    
                    {config.showPronunciation && (
                      <span className="text-sm font-medium text-gray-500 font-sans italic">
                        [{item.pronunciation}]
                      </span>
                    )}

                    {config.showTranslation && (
                      <span className="text-sm text-gray-600 font-sans bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        {item.translation}
                      </span>
                    )}
                  </div>

                  {item.category && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 font-sans">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Example sentence block (if requested) */}
                {config.showExample && item.example && (
                  <div className="mb-3 pl-6 border-l-2 border-gray-200 text-xs sm:text-sm space-y-0.5 font-sans">
                    <p className={`${fontClass} text-gray-800 font-medium tracking-wide text-sm`}>
                      <span className="text-gray-400 text-[10px] mr-1 uppercase font-sans">Esempio:</span>
                      {item.example}
                    </p>
                    {config.showExamplePron && item.examplePron && (
                      <p className="text-gray-500 text-xs italic">
                        Pronuncia: {item.examplePron}
                      </p>
                    )}
                    {config.showExampleTrans && item.exampleTrans && (
                      <p className="text-gray-600 text-xs">
                        Traduzione: {item.exampleTrans}
                      </p>
                    )}
                  </div>
                )}

                {/* Grid Writing Section */}
                <div className="mt-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                  {config.layoutMode === 'word' ? (
                    // --- WORD LAYOUT ---
                    <div className="flex flex-nowrap gap-1">
                      {(() => {
                        const totalBoxes = config.practiceBoxesCount;
                        const wordLen = syllables.length;
                        const cells = [];

                        // 1. Reference
                        for (let i = 0; i < wordLen; i++) {
                          if (cells.length < totalBoxes) {
                            cells.push(
                              <GridCell
                                key={`ref-${i}`}
                                char={syllables[i]}
                                isReference={true}
                                gridColors={gridColors}
                                fontClass={fontClass}
                                gridStyle={config.gridStyle}
                                showGridGuides={config.showGridGuides}
                              />
                            );
                          }
                        }

                        // 2. Tracing copies
                        const traceCopies = config.traceBoxesCount;
                        for (let t = 0; t < traceCopies; t++) {
                          for (let i = 0; i < wordLen; i++) {
                            if (cells.length < totalBoxes) {
                              cells.push(
                                <GridCell
                                  key={`trace-${t}-${i}`}
                                  char={syllables[i]}
                                  isTrace={true}
                                  gridColors={gridColors}
                                  fontClass={fontClass}
                                  gridStyle={config.gridStyle}
                                  showGridGuides={config.showGridGuides}
                                />
                              );
                            }
                          }
                        }

                        // 3. Empties to fill the row
                        let emptyCount = 0;
                        while (cells.length < totalBoxes) {
                          cells.push(
                            <GridCell
                              key={`empty-${emptyCount++}`}
                              char=""
                              gridColors={gridColors}
                              fontClass={fontClass}
                              gridStyle={config.gridStyle}
                              showGridGuides={config.showGridGuides}
                            />
                          );
                        }

                        return cells;
                      })()}
                    </div>
                  ) : (
                    // --- SYLLABLE LAYOUT ---
                    <div className="space-y-2">
                      {syllables
                        .filter((char) => char !== ' ') // Skip pure spaces for dedicated rows
                        .map((char, charIdx) => (
                          <div key={charIdx} className="flex items-center gap-3">
                            {/* Marker showing which syllable is being practiced */}
                            <div className="w-10 text-right pr-2">
                              <span className={`${fontClass} text-lg font-bold text-gray-450`}>
                                {char}
                              </span>
                            </div>
                            
                            {/* Practice row for this syllable */}
                            <div className="flex flex-nowrap gap-1">
                              {(() => {
                                const totalBoxes = config.practiceBoxesCount;
                                const cells = [];

                                // 1. Reference
                                cells.push(
                                  <GridCell
                                    key={`ref-${charIdx}`}
                                    char={char}
                                    isReference={true}
                                    gridColors={gridColors}
                                    fontClass={fontClass}
                                    gridStyle={config.gridStyle}
                                    showGridGuides={config.showGridGuides}
                                  />
                                );

                                // 2. Tracing cells
                                for (let t = 0; t < config.traceBoxesCount; t++) {
                                  if (cells.length < totalBoxes) {
                                    cells.push(
                                      <GridCell
                                        key={`trace-${charIdx}-${t}`}
                                        char={char}
                                        isTrace={true}
                                        gridColors={gridColors}
                                        fontClass={fontClass}
                                        gridStyle={config.gridStyle}
                                        showGridGuides={config.showGridGuides}
                                      />
                                    );
                                  }
                                }

                                // 3. Empty cells
                                let emptyCount = 0;
                                while (cells.length < totalBoxes) {
                                  cells.push(
                                    <GridCell
                                      key={`empty-${charIdx}-${emptyCount++}`}
                                      char=""
                                      gridColors={gridColors}
                                      fontClass={fontClass}
                                      gridStyle={config.gridStyle}
                                      showGridGuides={config.showGridGuides}
                                    />
                                  );
                                }

                                return cells;
                              })()}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sheet Footer */}
      <div className="mt-12 pt-4 border-t border-gray-200 text-center text-[10px] text-gray-400 flex justify-between items-center font-sans">
        <span>Fatto con il Generatore di Scrittura Coreana</span>
        <span>Pagina 1 di 1</span>
      </div>
    </div>
  );
}
