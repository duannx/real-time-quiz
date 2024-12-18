import styles from "./leaderboard.module.scss";
import Participant from "../Participant";
import { UserScore } from "@/services/quiz-service/type";

export default function Leaderboard({
  leaderboard,
}: {
  leaderboard: UserScore[];
}) {
  return (
    <div className={styles["leaderboard"]}>
      <h2 className={styles["leaderboard__title"]}>Leaderboard</h2>
      <div className={styles["leaderboard__participants"]}>
        {leaderboard.map((participant, index) => {
          // only show the first 10 participants
          if (index > 10) return null;

          return (
            <Participant
              key={index}
              {...participant}
              rank={index + 1}
            ></Participant>
          );
        })}
      </div>
    </div>
  );
}
