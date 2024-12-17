import styles from "./Choice.module.scss";

export default function Choice({
  choice,
  id,
  selected,
  onClick
}: {
  choice: string;
  id: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`${styles["choice"]} ${
        selected ? styles["choice--selected"] : ""
      }`}
      onClick={onClick}
    >
      <span className={styles["choice__id"]}>{id}</span>
      <span className={styles["choice__content"]}>{choice}</span>
    </div>
  );
}
