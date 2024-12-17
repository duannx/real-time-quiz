import { QuizBackendStrategy } from "./type";
import firebaseQuizBackend from "./firebase";

class QuizApp {
  private backend: QuizBackendStrategy;

  constructor(backend: QuizBackendStrategy) {
      this.backend = backend;
  }

  async createUser(name: string, avatar: string): Promise<string> {
      return this.backend.createUser(name, avatar);
  }

  async joinQuiz(quizId: string, userId: string): Promise<{ quizId: string; questions: { question_id: string; text: string; type: string; correct_choice: number; score: number }[] }> {
      return this.backend.joinQuiz(quizId, userId);
  }

  async answer(quizId: string, userId: string, questionId: string, answer: number, score: number): Promise<number> {
      return this.backend.answer(quizId, userId, questionId, answer, score);
  }

  async viewLeaderboard(quizId: string): Promise<{ userId: string; score: number }[]> {
      return this.backend.viewLeaderboard(quizId);
  }
}

const quizAppBackend = new QuizApp(firebaseQuizBackend);
export default quizAppBackend
