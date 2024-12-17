import Leaderboard from "@/components/Leaderboard";
import Question from "@/components/Question";

export default function Quiz() {
  return (
    <div className="container">
      <Question></Question>
      <Leaderboard></Leaderboard>
    </div>
  );
}
