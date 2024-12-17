import { useState } from "react";
import Choice from "../Choice";
import styles from "./question.module.scss";

const question = {
  title: "What does the word 'benevolent' mean?",
  choices: [
    "Kind and generous",
    "Harsh and cruel",
    "Loud and noisy",
    "Small and insignificant",
  ],
  answer: 0,
};

export default function Question() {
  const [selectedChoice, setSelectedChoice] = useState(-1);

  return (
    <form className={styles["form"]}>
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
      <button className={`${styles["button"]} btn btn-success`}>Answer</button>
    </form>
  );
}

function getChoiceId(index: number) {
  return ["A", "B", "C", "D"][index] || "";
}
