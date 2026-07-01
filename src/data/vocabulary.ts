/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VocabularyItem } from '../types';

export const PRESET_VOCABULARY: VocabularyItem[] = [
  // --- PRINCIPIANTE (BEGINNER) ---
  {
    id: 'b1',
    word: '안녕하세요',
    pronunciation: 'An-nyeong-ha-se-yo',
    translation: 'Ciao / Buongiorno (formale)',
    example: '안녕하세요! 저는 마르코입니다.',
    examplePron: 'An-nyeong-ha-se-yo! Jeo-neun Ma-reu-ko-im-ni-da.',
    exampleTrans: 'Ciao! Io sono Marco.',
    category: 'Saluti',
    level: 'beginner'
  },
  {
    id: 'b2',
    word: '감사합니다',
    pronunciation: 'Gam-sa-ham-ni-da',
    translation: 'Grazie',
    example: '도와주셔서 정말 감사합니다.',
    examplePron: 'Do-wa-ju-syeo-seo jeong-mal gam-sa-ham-ni-da.',
    exampleTrans: 'Grazie mille per avermi aiutato.',
    category: 'Saluti',
    level: 'beginner'
  },
  {
    id: 'b3',
    word: '죄송합니다',
    pronunciation: 'Joe-song-ham-ni-da',
    translation: 'Scusa / Mi dispiace',
    example: '늦어서 정말 죄송합니다.',
    examplePron: 'Neu-jeo-seo jeong-mal joe-song-ham-ni-da.',
    exampleTrans: 'Mi dispiace davvero molto per il ritardo.',
    category: 'Saluti',
    level: 'beginner'
  },
  {
    id: 'b4',
    word: '친구',
    pronunciation: 'Chin-gu',
    translation: 'Amico / Amica',
    example: '제 친구는 이탈리아 사람입니다.',
    examplePron: 'Je chin-gu-neun I-tal-li-a sa-ram-im-ni-da.',
    exampleTrans: 'Il mio amico è italiano.',
    category: 'Relazioni',
    level: 'beginner'
  },
  {
    id: 'b5',
    word: '가족',
    pronunciation: 'Ga-jok',
    translation: 'Famiglia',
    example: '우리 가족은 서울에 살고 있습니다.',
    examplePron: 'U-ri ga-jo-geun Seo-ul-e sal-go it-seum-ni-da.',
    exampleTrans: 'La mia famiglia vive a Seoul.',
    category: 'Relazioni',
    level: 'beginner'
  },
  {
    id: 'b6',
    word: '학교',
    pronunciation: 'Hak-gyo',
    translation: 'Scuola',
    example: '저는 매일 아침 학교에 갑니다.',
    examplePron: 'Jeo-neun mae-il a-chim hak-gyo-e gap-ni-da.',
    exampleTrans: 'Vado a scuola ogni mattina.',
    category: 'Luoghi',
    level: 'beginner'
  },
  {
    id: 'b7',
    word: '한국어',
    pronunciation: 'Han-gug-eo',
    translation: 'Lingua Coreana',
    example: '한국어 공부는 아주 재미있습니다.',
    examplePron: 'Han-gug-eo gong-bu-neun a-ju jae-mi-it-seum-ni-da.',
    exampleTrans: 'Studiare il coreano è molto divertente.',
    category: 'Studio',
    level: 'beginner'
  },
  {
    id: 'b8',
    word: '물',
    pronunciation: 'Mul',
    translation: 'Acqua',
    example: '시원한 물 한 잔 주세요.',
    examplePron: 'Si-won-han mul han jan ju-se-yo.',
    exampleTrans: 'Per favore, mi dia un bicchiere d\'acqua fresca.',
    category: 'Cibo & Bevande',
    level: 'beginner'
  },
  {
    id: 'b9',
    word: '맛있다',
    pronunciation: 'Mat-it-da',
    translation: 'Essere delizioso',
    example: '이 비빔밥은 정말 맛있어요.',
    examplePron: 'I bi-bim-ba-beun jeong-mal mat-is-seo-yo.',
    exampleTrans: 'Questo bibimbap è davvero squisito.',
    category: 'Cibo & Bevande',
    level: 'beginner'
  },
  {
    id: 'b10',
    word: '사랑하다',
    pronunciation: 'Sa-rang-ha-da',
    translation: 'Amare',
    example: '나는 한국 문화를 사랑해요.',
    examplePron: 'Na-neun Han-guk mun-hwa-reul sa-rang-hae-yo.',
    exampleTrans: 'Amo la cultura coreana.',
    category: 'Sentimenti',
    level: 'beginner'
  },

  // --- INTERMEDIO (INTERMEDIATE) ---
  {
    id: 'i1',
    word: '공부하다',
    pronunciation: 'Gong-bu-ha-da',
    translation: 'Studiare',
    example: '도서관에서 한국어를 공부하고 있습니다.',
    examplePron: 'Do-seo-gwan-e-seo han-gug-eo-reul gong-bu-ha-go it-seum-ni-da.',
    exampleTrans: 'Sto studiando coreano in biblioteca.',
    category: 'Verbi quotidiani',
    level: 'intermediate'
  },
  {
    id: 'i2',
    word: '행복하다',
    pronunciation: 'Haeng-bok-ha-da',
    translation: 'Essere felice',
    example: '가족과 함께 시간을 보낼 때 가장 행복해요.',
    examplePron: 'Ga-jok-gwa ham-kke si-gan-eul bo-nael ttae ga-jang haeng-bok-hae-yo.',
    exampleTrans: 'Sono più felice quando passo del tempo con la mia famiglia.',
    category: 'Sentimenti',
    level: 'intermediate'
  },
  {
    id: 'i3',
    word: '약속',
    pronunciation: 'Yak-sok',
    translation: 'Appuntamento / Promessa',
    example: '오늘 저녁에 친구와 약속이 있습니다.',
    examplePron: 'O-neul jeo-nyeog-e chin-gu-wa yak-so-gi it-seum-ni-da.',
    exampleTrans: 'Ho un appuntamento con un amico stasera.',
    category: 'Vita sociale',
    level: 'intermediate'
  },
  {
    id: 'i4',
    word: '여행하다',
    pronunciation: 'Yeo-haeng-ha-da',
    translation: 'Viaggiare',
    example: '내년 여름에 제주도를 여행하고 싶습니다.',
    examplePron: 'Nae-nyeon yeo-reum-e Je-ju-do-reul yeo-haeng-ha-go sip-seum-ni-da.',
    exampleTrans: 'Vorrei viaggiare nell\'isola di Jeju la prossima estate.',
    category: 'Viaggio',
    level: 'intermediate'
  },
  {
    id: 'i5',
    word: '병원',
    pronunciation: 'Byeong-won',
    translation: 'Ospedale',
    example: '감기에 걸려서 병원에 다녀왔습니다.',
    examplePron: 'Gam-gi-e geol-lyeo-seo byeong-won-e da-nyeo-wat-seum-ni-da.',
    exampleTrans: 'Ho preso il raffreddore, quindi sono andato in ospedale.',
    category: 'Luoghi',
    level: 'intermediate'
  },
  {
    id: 'i6',
    word: '도서관',
    pronunciation: 'Do-seo-gwan',
    translation: 'Biblioteca',
    example: '도서관에서 책을 두 권 빌렸습니다.',
    examplePron: 'Do-seo-gwan-e-seo chae-geul du gwon bil-lyeot-seum-ni-da.',
    exampleTrans: 'Ho preso in prestito due libri dalla biblioteca.',
    category: 'Luoghi',
    level: 'intermediate'
  },
  {
    id: 'i7',
    word: '직업',
    pronunciation: 'Jig-eop',
    translation: 'Professione / Lavoro',
    example: '당신의 꿈꾸는 직업은 무엇입니까?',
    examplePron: 'Dang-sin-ui kkum-kku-neun jig-eo-beun mu-eot-im-ni-da-kka?',
    exampleTrans: 'Qual è il lavoro dei tuoi sogni?',
    category: 'Lavoro',
    level: 'intermediate'
  },
  {
    id: 'i8',
    word: '건강',
    pronunciation: 'Geon-gang',
    translation: 'Salute',
    example: '매일 운동하는 것이 건강에 좋습니다.',
    examplePron: 'Mae-il un-dong-ha-neun geo-si geon-gang-e jot-seum-ni-da.',
    exampleTrans: 'Fare esercizio ogni giorno fa bene alla salute.',
    category: 'Benessere',
    level: 'intermediate'
  },
  {
    id: 'i9',
    word: '날씨',
    pronunciation: 'Nal-ssi',
    translation: 'Tempo atmosferico',
    example: '오늘 날씨가 맑고 따뜻합니다.',
    examplePron: 'O-neul nal-ssi-ga malg-go tta-tteut-ham-ni-da.',
    exampleTrans: 'Il tempo oggi è sereno e caldo.',
    category: 'Natura',
    level: 'intermediate'
  },
  {
    id: 'i10',
    word: '선물',
    pronunciation: 'Seon-mul',
    translation: 'Regalo',
    example: '어머니의 생신 선물로 꽃을 샀습니다.',
    examplePron: 'Eo-meo-ni-ui saeng-sin seon-mul-lo kko-cheul sat-seum-ni-da.',
    exampleTrans: 'Ho comprato dei fiori come regalo di compleanno per mia madre.',
    category: 'Vita sociale',
    level: 'intermediate'
  },

  // --- AVANZATO (ADVANCED) ---
  {
    id: 'a1',
    word: '작심삼일',
    pronunciation: 'Jak-sim-sam-il',
    translation: 'Risoluzione di tre giorni (costanza debole)',
    example: '새해 계획이 작심삼일로 끝나지 않도록 합시다.',
    examplePron: 'Sae-hae gye-hoe-gi jak-sim-sam-il-lo kkeun-na-ji an-to-rok hap-si-da.',
    exampleTrans: 'Facciamo in modo che i propositi del nuovo anno non finiscano in una bolla di sapone (letteralmente: non durino solo tre giorni).',
    category: 'Proverbi (Four-character Idioms)',
    level: 'advanced'
  },
  {
    id: 'a2',
    word: '사필귀정',
    pronunciation: 'Sa-pil-gwi-jeong',
    translation: 'La giustizia trionferà sempre alla fine',
    example: '어려운 상황에서도 진실은 결국 밝혀지는 법이니 사필귀정이다.',
    examplePron: 'Eo-ryeo-un sang-hwang-e-seo-do jin-si-leun gyeol-guk bal-khyeo-ji-neun beop-i-ni sa-pil-gwi-jeong-i-da.',
    exampleTrans: 'Anche nelle situazioni difficili la verità viene sempre a galla, quindi la giustizia trionfa alla fine.',
    category: 'Proverbi (Four-character Idioms)',
    level: 'advanced'
  },
  {
    id: 'a3',
    word: '천고마비',
    pronunciation: 'Cheon-go-ma-bi',
    translation: 'Cielo alto e cavalli grassi (l\'autunno splendido)',
    example: '천고마비의 계절인 가을에는 마음이 풍성해집니다.',
    examplePron: 'Cheon-go-ma-bi-ui gye-jeol-in ga-eu-re-neun ma-eu-mi pung-seong-hae-jim-ni-da.',
    exampleTrans: 'In autunno, la stagione del cielo alto e dei cavalli grassi, il cuore si arricchisce.',
    category: 'Proverbi (Four-character Idioms)',
    level: 'advanced'
  },
  {
    id: 'a4',
    word: '유비무환',
    pronunciation: 'Yu-bi-mu-hwan',
    translation: 'Prevenire è meglio che curare (essendo pronti non ci sono preoccupazioni)',
    example: '재난에 대비해 비상식량을 준비하는 것은 유비무환의 자세이다.',
    examplePron: 'Jae-nan-e dae-bi-hae bi-sang-sik-ryang-eul jun-bi-ha-neun geo-seun yu-bi-mu-hwan-ui ja-se-i-da.',
    exampleTrans: 'Preparare cibo d\'emergenza in vista di disastri è l\'atteggiamento di chi previene per non avere preoccupazioni.',
    category: 'Proverbi (Four-character Idioms)',
    level: 'advanced'
  },
  {
    id: 'a5',
    word: '지속가능성',
    pronunciation: 'Ji-sok-ga-neung-seong',
    translation: 'Sostenibilità',
    example: '정부는 친환경 에너지를 통한 지속가능한 개발을 목표로 하고 있다.',
    examplePron: 'Jeong-bu-neun chin-hwan-gyeong e-neo-ji-reul thong-han ji-sok-ga-neung-han gae-bal-eul mok-pyo-ro ha-go it-da.',
    exampleTrans: 'Il governo punta a uno sviluppo sostenibile attraverso l\'energia eco-friendly.',
    category: 'Società & Politica',
    level: 'advanced'
  },
  {
    id: 'a6',
    word: '다양성',
    pronunciation: 'Da-yang-seong',
    translation: 'Diversità',
    example: '글로벌 사회에서는 문화적 다양성을 존중하는 것이 매우 중요합니다.',
    examplePron: 'Geul-lo-beol sa-hoe-e-seo-neun mun-hwa-jeok da-yang-seong-eul jon-jung-ha-neun geo-si mae-u jung-yo-ham-ni-da.',
    exampleTrans: 'Rispettare la diversità culturale è estremamente importante nella società globale.',
    category: 'Società & Politica',
    level: 'advanced'
  },
  {
    id: 'a7',
    word: '고정관념',
    pronunciation: 'Go-jeong-gwan-nyeom',
    translation: 'Stereotipo / Pregiudizio / Idea fissa',
    example: '우리는 나이에 대한 고정관념에서 벗어날 필요가 있습니다.',
    examplePron: 'U-ri-neun na-i-e dae-han go-jeong-gwan-nyeom-e-seo beot-eo-nal phil-yo-ga it-seum-ni-da.',
    exampleTrans: 'Dobbiamo liberarci dagli stereotipi legati all\'età.',
    category: 'Psicologia & Mente',
    level: 'advanced'
  },
  {
    id: 'a8',
    word: '성취감',
    pronunciation: 'Seong-chwi-gam',
    translation: 'Senso di realizzazione / Successo',
    example: '어려운 프로젝트를 끝마쳤을 때 큰 성취감을 느꼈습니다.',
    examplePron: 'Eo-ryeo-un pheu-ro-jec-theu-reul kkeun-ma-chyeot-seul ttae kheun seong-chwi-ga-meul neu-kyeot-seum-ni-da.',
    exampleTrans: 'Ho provato un forte senso di realizzazione quando ho portato a termine quel progetto difficile.',
    category: 'Psicologia & Mente',
    level: 'advanced'
  }
];
