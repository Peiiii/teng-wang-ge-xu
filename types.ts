
export interface Paragraph {
  id: number;
  content: string;
  translation: string;
  annotations: Annotation[];
}

export interface Annotation {
  word: string;
  meaning: string;
  origin?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export enum Section {
  Reading = 'reading',
  Analysis = 'analysis',
  Quiz = 'quiz',
  AITutor = 'aitutor'
}
