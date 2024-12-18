import LeaderboardComponent from "@/components/Leaderboard";
import ProgressComponent from "@/components/Progress";
import QuestionComponent from "@/components/Question";
import Modal from "@/components/Modal";
import styles from "./quiz.module.scss";
import { useRouter } from "next/router";
import quizAppBackend from "@/services/quiz-service";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DEFAULT_ERROR_MESSAGE } from "@/utils/constants";
import { UserScore } from "@/services/quiz-service/type";
import { mergeScore } from "@/services/quiz-service/helper";

const Leaderboard = memo(LeaderboardComponent);
const Progress = memo(ProgressComponent);
const Question = memo(QuestionComponent);

export default function Quiz() {
  const router = useRouter();
  // useRef here to call get quiz only once
  const quizRef = useRef(quizAppBackend.getCurrentQuiz());
  // useRef here to call get user only once
  const userRef = useRef(quizAppBackend.getCurrentUser());
  const quiz = quizRef.current;
  const user = userRef.current;
  useLayoutEffect(() => {
    if (!quiz || !user) router.replace("/");
  });

  const [currentScore, setCurrentScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([]);
  const [isEnd, setIsEnd] = useState(false);

  const quizId = quiz?.quizId || "";
  const totalQuestions = quiz?.questions.length || 0;

  useEffect(() => {
    if (!quizId) return;
    const unsubscribe = quizAppBackend.viewLeaderboard(
      quizId,
      (userScores: UserScore[]) => {
        setLeaderboard(userScores);
      }
    );

    // cleanup subscriber
    return unsubscribe;
  }, [quizId]);

  const onAnswer = useCallback(
    (deltaScore: number) => {
      setCurrentScore(currentScore + deltaScore);
      if (currentQuestionIndex + 1 < totalQuestions) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsEnd(true);
      }
    },
    [currentQuestionIndex, currentScore, totalQuestions]
  );

  function onQuit() {
    quizAppBackend.setCurrentQuiz(null);
    quizAppBackend.setCurrentUser(null);
    router.push("/");
  }

  if (!quiz || !user) return <p>Redirecting to Home Page...</p>;

  const { rank, leaderboard: newLeaderboard } = mergeScore(
    {
      score: currentScore,
      userId: user.id,
      name: user.name + " (You)",
      avatar: user.avatar,
    },
    leaderboard
  );

  const question = quiz.questions[currentQuestionIndex];
  if (!question) return DEFAULT_ERROR_MESSAGE;

  return (
    <div className={`container ${styles["quiz-page"]}`}>
      <Modal onAccept={onQuit}></Modal>
      <Progress
        name={user.name}
        progress={`Question ${currentQuestionIndex + 1} of ${
          quiz.questions.length
        }`}
        rank={rank + 1}
        score={currentScore}
      ></Progress>

      <div className={styles["quiz-page-content"]}>
        {!isEnd && (
          <Question
            quizId={quizId}
            userId={user.id}
            question={question}
            onAnswer={onAnswer}
            key={question.question_id}
          ></Question>
        )}
        <Leaderboard leaderboard={newLeaderboard}></Leaderboard>
      </div>
    </div>
  );
}
