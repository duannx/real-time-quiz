import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  Firestore,
  getDoc,
} from "firebase/firestore";
import { QuizBackendStrategy } from "./type";

class FirebaseQuizBackend implements QuizBackendStrategy {
  private db: Firestore;

  constructor(firebaseDb: Firestore) {
    this.db = firebaseDb;
  }

  async createUser(name: string, avatar: string): Promise<string> {
    const userDoc = doc(this.db, "users", crypto.randomUUID());
    await setDoc(userDoc, {
      name,
      avatar,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return userDoc.id;
  }

  async joinQuiz(
    quizId: string,
    userId: string
  ): Promise<{
    quizId: string;
    questions: {
      question_id: string;
      text: string;
      type: string;
      correct_choice: number;
      score: number;
    }[];
  }> {
    const quizDoc = doc(this.db, "quizzes", quizId);
    const quizSnapshot = await getDoc(quizDoc);

    if (!quizSnapshot.exists()) {
      throw new Error("Quiz not found");
    }

    const questionsDoc = doc(this.db, "questions_in_quiz", quizId);
    const questionsSnapshot = await getDoc(questionsDoc);
    if (!questionsSnapshot.exists()) {
      throw new Error("Questions for this quiz not found");
    }

    const answersDoc = doc(this.db, "answers", quizId);
    await setDoc(answersDoc, { [userId]: {} }, { merge: true });

    return { quizId, questions: questionsSnapshot.data()?.questions || [] };
  }

  async answer(
    quizId: string,
    userId: string,
    questionId: string,
    answer: number,
    score: number
  ): Promise<number> {
    const answersDoc = doc(this.db, "answers", quizId);
    const answersSnapshot = await getDoc(answersDoc);

    if (!answersSnapshot.exists()) {
      throw new Error("Answers not initialized for this quiz");
    }

    const userAnswers = answersSnapshot.data()?.[userId] || {};
    userAnswers[questionId] = { question_id: questionId, score, answer };

    await setDoc(answersDoc, { [userId]: userAnswers }, { merge: true });

    return score;
  }

  async viewLeaderboard(
    quizId: string
  ): Promise<{ userId: string; score: number }[]> {
    const answersDoc = doc(this.db, "answers", quizId);
    const answersSnapshot = await getDoc(answersDoc);

    if (!answersSnapshot.exists()) {
      throw new Error("Answers not found for this quiz");
    }

    const answersData = answersSnapshot.data() || {};
    const leaderboard: { userId: string; score: number }[] = Object.entries(
      answersData
    ).map(([userId, answers]: [string, Record<string, any>]) => {
      const totalScore = Object.values(answers).reduce(
        (sum: number, entry: any) => sum + (entry.score || 0),
        0
      );
      return { userId, score: totalScore };
    });

    return leaderboard.sort((a, b) => b.score - a.score);
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyA9OhbagRNWEqvHbvyEtfny4IDHIbAP9CQ",
  authDomain: "vocabulary-quiz-ee7dc.firebaseapp.com",
  databaseURL: "https://vocabulary-quiz-ee7dc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vocabulary-quiz-ee7dc",
  storageBucket: "vocabulary-quiz-ee7dc.firebasestorage.app",
  messagingSenderId: "6380316040",
  appId: "1:6380316040:web:f64efb3d62f1bf9440463d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firebaseQuizBackend = new FirebaseQuizBackend(db)
export default firebaseQuizBackend
