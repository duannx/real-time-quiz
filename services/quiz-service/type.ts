export interface Question {
  question_id: string;
  title: string;
  choices: string[];
  type: string;
  correct_choice: number;
  score: number;
}

export interface QuizQuestion {
  question_id: string;
  score: number;
}

export interface UserScore {
  userId: string;
  score: number;
  name: string;
  avatar: string;
}

export interface Quiz {
  quizId: string;
  title: string;
  questions: Question[];
}

export interface UserScoreData {
  total_score: number;
}

export interface UserData {
  name: string;
  avatar: string;
  created_at?: string;
  updated_at?: string;
}
export interface UserDataWithId extends UserData {
  id: string;
}

export interface QuizBackendStrategy {
  createUser(name: string, avatar: string): Promise<UserDataWithId>;
  joinQuiz(quizId: string, userId: string): Promise<Quiz>;
  answer(
    quizId: string,
    userId: string,
    questionId: string,
    answer: number,
    score: number
  ): Promise<number>;
  viewLeaderboard(
    quizId: string,
    callback: (leaderboard: UserScore[]) => void
  ): () => void;
}
