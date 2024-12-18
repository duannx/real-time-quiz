import { Quiz, QuizBackendStrategy, UserDataWithId, UserScore } from "./type";

class QuizAppBackend {
  private backend: QuizBackendStrategy | null = null;
  private currentQuiz: Quiz | null = null;
  private currentUser: UserDataWithId | null = null;

  constructor() {}

  setBackend(backend: QuizBackendStrategy) {
    this.backend = backend;
  }

  setCurrentUser(user: UserDataWithId | null) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentQuiz(quiz: Quiz | null) {
    this.currentQuiz = quiz;
  }

  getCurrentQuiz() {
    return this.currentQuiz;
  }

  async createUser(name: string, avatar: string): Promise<UserDataWithId> {
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
    callback: (leaderboard: UserScore[]) => unknown
  ): () => void {
    return this.backend!.viewLeaderboard(quizId, callback);
  }
}

const quizAppBackend = new QuizAppBackend();
export default quizAppBackend;
