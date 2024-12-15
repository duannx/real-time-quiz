export default function JoiningQuiz() {
  return (
    <>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Your name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
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
            placeholder="Quiz ID"
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-success">
            Join
          </button>
        </div>
      </form>
    </>
  );
}
