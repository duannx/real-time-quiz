import Leaderboard from "@/components/Leaderboard";
import Progress from "@/components/Progress";
import Question from "@/components/Question";
import styles from "./quiz.module.scss";

export default function Quiz() {
  return (
    <div className={`container ${styles["quiz-page"]}`}>
      <Progress
        name="Your Name"
        progress="1/15"
        rank={3}
        score={100}
      ></Progress>
      <div className={styles["quiz-page-content"]}>
        <Question></Question>
        <Leaderboard></Leaderboard>
      </div>
    </div>
  );
}
