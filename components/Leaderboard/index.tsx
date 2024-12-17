import styles from "./leaderboard.module.scss";
import { leaderBoardData } from "@/data/leaderboard";
import Participant from "../Participant";

export default function Leaderboard() {
  return (
    <div className={styles["leaderboard"]}>
      <h2 className={styles["leaderboard__title"]}>Leaderboard</h2>
      <div className={styles["leaderboard__participants"]}>
        {leaderBoardData.map((participant, index) => {
          return <Participant key={index} {...participant}></Participant>;
        })}
      </div>
    </div>
  );
}
