import Close from "./Close";
import styles from "./progress.module.scss";

interface ProgressProps {
  name: string;
  progress: string;
  score: number;
  rank: number;
}

export default function Progress({
  name,
  progress,
  rank,
  score,
}: ProgressProps) {
  return (
    <div className={styles["progress"]}>
      <div className={styles["progress__top"]}>
        <div className={styles["progress__number"]}>{progress}</div>
        <div className={styles["progress__name"]}>{name}</div>
        <div className={styles["progress__close-button"]}><Close></Close></div>
      </div>
      <div className={styles["progress__bottom"]}>
        <div className={styles["progress__score"]}>Score: {score}</div>
        <div className={styles["progress__rank"]}>Rank: {rank}</div>
      </div>
    </div>
  );
}
