import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  push,
  update,
} from "firebase/database";
import {
  Quiz,
  QuizBackendStrategy,
  QuizQuestion,
  UserData,
  UserDataWithId,
  UserScoreData,
} from "./type";

export class FirebaseQuizBackend implements QuizBackendStrategy {
  private db: ReturnType<typeof getDatabase>;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyA9OhbagRNWEqvHbvyEtfny4IDHIbAP9CQ",
      authDomain: "vocabulary-quiz-ee7dc.firebaseapp.com",
      databaseURL:
        "https://vocabulary-quiz-ee7dc-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "vocabulary-quiz-ee7dc",
      storageBucket: "vocabulary-quiz-ee7dc.firebasestorage.app",
      messagingSenderId: "6380316040",
      appId: "1:6380316040:web:f64efb3d62f1bf9440463d",
    };

    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
  }

  async createUser(name: string, avatar: string): Promise<UserDataWithId> {
    const usersRef = ref(this.db, "users");
    const newUserRef = push(usersRef);

    const userData: UserData = {
      name,
      avatar,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await set(newUserRef, userData);

    return { id: newUserRef.key!, ...userData };
  }

  async joinQuiz(quizId: string, userId: string): Promise<Quiz> {
    try {
      // Fetch quiz details
      const quizRef = ref(this.db, `quizzes/${quizId}`);
      const quizSnapshot = await get(quizRef);

      if (!quizSnapshot.exists()) {
        throw new Error("Quiz not found");
      }

      const quizDetails = quizSnapshot.val();

      // Fetch questions for the quiz
      const questionsInQuizRef = ref(this.db, `questions_in_quiz/${quizId}`);
      const questionsInQuizSnapshot = await get(questionsInQuizRef);

      if (!questionsInQuizSnapshot.exists()) {
        throw new Error("Questions for this quiz not found");
      }

      const questionsInQuiz: QuizQuestion[] =
        questionsInQuizSnapshot.val().questions;

      // Fetch full question details
      const questionsRef = ref(this.db, "questions");
      const questionsSnapshot = await get(questionsRef);
      const allQuestions = questionsSnapshot.val();

      // Combine quiz questions with their full details
      const fullQuestions = questionsInQuiz.map((quizQuestion) => {
        const questionDetails = allQuestions[quizQuestion.question_id];
        return {
          question_id: quizQuestion.question_id,
          title: questionDetails.title,
          choices: questionDetails.choices,
          type: "multiple_choice", // Assuming all are multiple choice
          correct_choice: questionDetails.correct_choice,
          score: quizQuestion.score,
        };
      });

      // Initialize user's score for this quiz
      const userScoreRef = ref(this.db, `quiz_scores/${quizId}/${userId}`);
      const initialScore: UserScoreData = { total_score: 0 };
      await set(userScoreRef, initialScore);

      return {
        quizId,
        title: quizDetails.title,
        questions: fullQuestions,
      };
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  async answer(
    quizId: string,
    userId: string,
    questionId: string,
    answer: number,
    score: number
  ): Promise<number> {
    // Store individual answer
    const answerRef = ref(this.db, `answers/${quizId}/${userId}/${questionId}`);
    await set(answerRef, {
      question_id: questionId,
      score,
      answer,
    });

    // Update total quiz score
    const userScoreRef = ref(this.db, `quiz_scores/${quizId}/${userId}`);

    // Get current score and add new score
    const currentScoreSnapshot = await get(userScoreRef);
    const currentScoreData = currentScoreSnapshot.val() as UserScoreData | null;
    const currentScore = currentScoreData?.total_score || 0;
    const newScore = currentScore + score;

    const updatedScore: UserScoreData = {
      total_score: newScore,
    };

    await update(userScoreRef, updatedScore);

    return newScore;
  }

  viewLeaderboard(
    quizId: string,
    callback: (
      leaderboard: {
        userId: string;
        score: number;
        name: string;
        avatar: string;
      }[]
    ) => void
  ): () => void {
    // Reference to quiz scores
    const scoresRef = ref(this.db, `quiz_scores/${quizId}`);

    // Reference to all users
    const usersRef = ref(this.db, "users");

    const unsubscribe = onValue(scoresRef, async (scoresSnapshot) => {
      if (!scoresSnapshot.exists()) {
        callback([]);
        return;
      }

      // Get all users
      const usersSnapshot = await get(usersRef);
      const users = usersSnapshot.val() || {};

      const scoresData = scoresSnapshot.val() as Record<string, UserScoreData>;
      const leaderboard: {
        userId: string;
        score: number;
        name: string;
        avatar: string;
      }[] = Object.entries(scoresData).map(([userId, scoreData]) => {
        // Find user details
        const userDetails = Object.entries(users).find(
          ([key]) => key === userId
        )?.[1] as UserData | undefined;

        return {
          userId,
          score: scoreData.total_score || 0,
          name: userDetails?.name || "Unknown",
          avatar: userDetails?.avatar || "",
        };
      });

      callback(leaderboard.sort((a, b) => b.score - a.score));
    });

    return unsubscribe;
  }
}
