export interface VocabularyItem {
  en: string;
  es: string;
  category?: string;
  exampleEn?: string;
  exampleEs?: string;
}

export interface DialogueLine {
  speaker: string;
  role: 'staff' | 'guest' | 'guide';
  en: string;
  es: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'listening'
  | 'fill_blank'
  | 'translate_es_en'
  | 'translate_en_es'
  | 'word_scramble'
  | 'error_correction';

export interface QuestionItem {
  id: string;
  type: QuestionType;
  prompt: string;
  audioText?: string; // Text to be spoken for listening questions
  context?: string;
  options?: string[]; // Multiple choice options (will be shuffled)
  correctAnswer: string;
  acceptableAnswers?: string[]; // Synonyms or variations
  explanation: string;
  points: number;
  sourceUnitId?: number; // Origin unit 1..12
  skillCategory?: 'listening' | 'transcription' | 'translation' | 'vocabulary' | 'grammar';
}

export interface UnitData {
  id: number;
  blockId: number;
  blockTitle: string;
  blockProduct: string;
  title: string;
  learningOutcome: string;
  vocabulary: VocabularyItem[];
  grammarTitle: string;
  grammarPoints: { rule: string; exampleEn: string; exampleEs: string }[];
  dialogue: DialogueLine[];
  speakingChallenge: string;
  questionBank: QuestionItem[]; // At least 20-25 questions per unit
}

export interface StudentProfile {
  name: string;
  group: string;
  email?: string;
  registeredAt: string;
}

export interface ExamAttempt {
  id: string;
  studentName: string;
  group: string;
  unitId: number;
  unitTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  livesRemaining: number;
  timeSpentSeconds: number;
  fraudAlertsCount: number;
  fraudLog: string[];
  timestamp: string;
  teacherEmail: string;
  answers: {
    questionText: string;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    sourceUnitId?: number;
    skillCategory?: string;
  }[];
  diagnosticWeaknesses?: {
    unitId: number;
    unitTitle: string;
    mistakesCount: number;
    skillsFailed: string[];
  }[];
  assignedRemedialUnitId?: number | null;
}

export interface UserStats {
  profile: StudentProfile | null;
  unlockedUnits: number[]; // e.g. [1]
  completedUnits: number[];
  unitScores: Record<number, { bestScore: number; attempts: number; passed: boolean; date?: string }>;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  badges: string[];
  midtermPassed?: boolean;
  remedialUnitId?: number | null; // Unit student was sent back to
  midtermWeaknesses?: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
}
