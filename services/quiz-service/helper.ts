import { Question, UserScore } from "./type";

const avatarList = [
  "/avatar-icons/avatar-1.png",
  "/avatar-icons/avatar-2.png",
  "/avatar-icons/avatar-3.png",
  "/avatar-icons/avatar-4.png",
  "/avatar-icons/avatar-5.png",
  "/avatar-icons/avatar-6.png",
  "/avatar-icons/avatar-7.png",
  "/avatar-icons/avatar-8.png",
  "/avatar-icons/avatar-9.png",
];

export function getRandomAvatar() {
  return avatarList[Math.floor(Math.random() * 9)];
}

/**
 * This function merges the current userScore into the up-to-date leaderboard
 * and reorders all scores to display the correct leaderboard for the current data.
 * Further optimization can reduce the complexity of both sorting and merging operations.
 *
 * @export
 * @param {UserScore} currentUserScore
 * @param {UserScore[]} leaderboard
 */
export function mergeScore(
  currentUserScore: UserScore,
  leaderboard: UserScore[]
) {
  const index = leaderboard.findIndex(
    (userScore) => userScore.userId === currentUserScore.userId
  );
  leaderboard[index] = currentUserScore;
  leaderboard.sort((a, b) => b.score - a.score);
  const newIndex = leaderboard.findIndex(
    (userScore) => userScore.userId === currentUserScore.userId
  );
  return {
    rank: newIndex,
    leaderboard,
  };
}


/**
 * We should never compare the correct answer on the client side 
 * or send the correct answer to the client to prevent cheating. 
 * This function is for demonstration purposes only
 *
 * @export
 * @param {Question} question
 * @param {number} answer
 * @return {*} 
 */
export function calculateScore(question: Question, answer: number) {
  if (answer === question.correct_choice) return question.score;
  return 0;
}
