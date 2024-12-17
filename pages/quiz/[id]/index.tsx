import Leaderboard from "@/components/Leaderboard";
import Progress from "@/components/Progress";
import Question from "@/components/Question";

export default function Quiz() {
  return (
    <div className="container">
      <Progress name="Your Name" progress="1/15" rank={3} score={100}></Progress>
      <Question></Question>
      <Leaderboard></Leaderboard>
    </div>
  );
}
