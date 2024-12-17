import quizAppBackend from "@/services/quiz-service";
import { getRandomAvatar } from "@/services/quiz-service/helper";
import { FormEvent, useState } from "react";

export default function JoiningQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const quizId = formData.get("quizId") as string;
      const name = formData.get("name") as string;
      if (!quizId) throw "Quiz ID is required";
      if (!name) throw "Your name is required";
      const avatar = getRandomAvatar();
      const userId = await quizAppBackend.createUser(name, avatar);
      const quiz = await quizAppBackend.joinQuiz(quizId, userId);
      if (!quiz) {
        throw "Quiz ID is invalid";
      }
      quizAppBackend.setCurrentQuiz(quiz);
      console.log("quiz", quiz);
    } catch (error) {
      console.log("error", error);
      if (typeof error === "string") {
        setError(error);
      }
      if ((error as Error).message) {
        setError((error as Error).message);
      }
      setError((error as object).toString?.() || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Your name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            aria-describedby="name"
            placeholder="Your name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quizId" className="form-label">
            Quiz ID
          </label>
          <input
            type="text"
            className="form-control"
            id="quizId"
            name="quizId"
            placeholder="quiz1, quiz2, quiz3"
          />
        </div>
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                id="spinner"
              ></span>
            ) : (
              "Join"
            )}
          </button>
        </div>
        <span className="is-invalid"></span>
        {error && <div className="invalid-feedback">{error}</div>}
      </form>
    </>
  );
}
