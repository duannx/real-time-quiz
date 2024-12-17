import { Quiz, QuizBackendStrategy, UserScore } from "./type";

class QuizApp {
  private backend: QuizBackendStrategy | null = null;
  private currentQuiz: Quiz | null = null;

  constructor() {}

  setBackend(backend: QuizBackendStrategy) {
    this.backend = backend;
  }

  setCurrentQuiz(quiz: Quiz) {
    this.currentQuiz = quiz;
  }

  getCurrentQuiz() {
    return this.currentQuiz;
  }

  async createUser(name: string, avatar: string): Promise<string> {
    return this.backend!.createUser(name, avatar);
  }

  async joinQuiz(quizId: string, userId: string): Promise<Quiz> {
    return this.backend!.joinQuiz(quizId, userId);
  }

  async answer(
    quizId: string,
    userId: string,
    questionId: string,
    answer: number,
    score: number
  ): Promise<number> {
    return this.backend!.answer(quizId, userId, questionId, answer, score);
  }

  viewLeaderboard(
    quizId: string,
    callback: (leaderboard: UserScore[]) => void
  ): () => void {
    return this.backend!.viewLeaderboard(quizId, callback);
  }
}

const quizAppBackend = new QuizApp();
export default quizAppBackend;
