import Image from "next/image";
import styles from "./participant.module.scss";

export interface Participant {
  name: string;
  avatar: string;
  score: number;
  rank: number;
}

export default function Participant({
  avatar,
  name,
  rank,
  score,
}: Participant) {
  return (
    <div className={styles["participant"]}>
      <div className={styles["participant__avatar-block"]}>
        <Image className={styles["participant__avatar-image"]} src={avatar} alt="avatar" width={100} height={100}></Image>
      </div>
      <div className={styles["participant__info"]}>
        <div className={styles["participant__name"]}>
            {name}
        </div>
        <div className={styles["participant__score"]}>
            Score: {score}
        </div>
      </div>
      <div className={styles["participant__rank"]}>
        {rank}
      </div>
    </div>
  );
}
