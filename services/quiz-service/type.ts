export interface Question {
  question_id: string;
  text: string;
  type: string;
  correct_choice: number;
  score: number;
}

export interface QuizBackendStrategy {
  createUser(name: string, avatar: string): Promise<string>;
  joinQuiz(quizId: string, userId: string): Promise<{ quizId: string; questions: Question[] }>;
  answer(quizId: string, userId: string, questionId: string, answer: number, score: number): Promise<number>;
  viewLeaderboard(quizId: string): Promise<{ userId: string; score: number }[]>;
}
