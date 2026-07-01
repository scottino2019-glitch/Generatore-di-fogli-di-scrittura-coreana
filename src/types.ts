/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VocabularyItem {
  id: string;
  word: string;          // Korean word, e.g., "안녕하세요"
  pronunciation: string; // Romanized pronunciation, e.g., "An-nyeong-ha-se-yo"
  translation: string;   // Italian translation, e.g., "Ciao / Buongiorno"
  example: string;       // Example sentence in Korean, e.g., "안녕하세요, 만나서 반갑습니다."
  examplePron: string;   // Example pronunciation, e.g., "An-nyeong-ha-se-yo, man-na-seo ban-gap-seum-ni-da."
  exampleTrans: string;  // Example translation, e.g., "Ciao, piacere di conoscerti."
  category?: string;     // e.g., "Saluti", "Cibo", "Viaggio"
  level: 'beginner' | 'intermediate' | 'advanced' | 'custom';
}

export interface CustomSet {
  id: string;
  name: string;
  items: VocabularyItem[];
  createdAt: number;
}

export type GridStyle = 'crosshair' | 'diagonal' | 'simple' | 'empty';
export type GridLineColor = 'green' | 'blue' | 'gray' | 'red';
export type PaperSize = 'a4' | 'letter';

export interface WorksheetConfig {
  title: string;
  subtitle: string;
  layoutMode: 'word' | 'syllable'; // 'word' = whole word in one row, 'syllable' = each syllable in a row
  showPronunciation: boolean;
  showTranslation: boolean;
  showExample: boolean;
  showExamplePron: boolean;
  showExampleTrans: boolean;
  traceBoxesCount: number; // Number of boxes to pre-fill with faded trace text (0-3)
  practiceBoxesCount: number; // Total boxes per row (including tracing) (typically 8-12)
  gridStyle: GridStyle;
  gridColor: GridLineColor;
  paperSize: PaperSize;
  koreanFont: 'Noto Sans KR' | 'Nanum Gothic' | 'Nanum Myeongjo' | 'Gowun Batang' | 'Gowun Dodum';
  customInstructions: string;
  showGridGuides: boolean; // Show guidelines inside empty boxes
}
