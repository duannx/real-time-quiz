import { FormEvent, useState } from "react";
import Choice from "../Choice";
import styles from "./question.module.scss";
import { Question as QuestionType } from "@/services/quiz-service/type";
import { calculateScore } from "@/services/quiz-service/helper";
import quizAppBackend from "@/services/quiz-service";

export default function Question({
  question,
  quizId,
  userId,
  onAnswer
}: {
  question: QuestionType;
  quizId: string;
  userId: string;
  onAnswer(score: number): void
}) {
  const [selectedChoice, setSelectedChoice] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const deltaScore = calculateScore(question, selectedChoice);
      await quizAppBackend.answer(
        quizId,
        userId,
        question.question_id,
        selectedChoice,
        deltaScore
      );
      onAnswer(deltaScore)
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles["form"]}>
      <div className={styles["question"]}>
        <h2 className={styles["question__title"]}>{question.title}</h2>
        <div className={styles["question__choices"]}>
          {question.choices.map((choice, index) => {
            const choiceId = getChoiceId(index);
            return (
              <Choice
                key={choiceId}
                id={choiceId}
                choice={choice}
                selected={selectedChoice === index}
                onClick={() => setSelectedChoice(index)}
              ></Choice>
            );
          })}
        </div>
      </div>
      <button
        disabled={selectedChoice == -1 || isLoading}
        className={`${styles["button"]} btn btn-success`}
      >
        {isLoading ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            id="spinner"
          ></span>
        ) : (
          "Answer"
        )}
      </button>
    </form>
  );
}

function getChoiceId(index: number) {
  return ["A", "B", "C", "D"][index] || "";
}
