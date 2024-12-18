export default function Modal({ onAccept }: { onAccept: () => unknown }) {
  return (
    <div
      className="modal fade"
      id="closeModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Are you sure you want to quit the quiz?
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            You will not be able to continue your quiz.
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onAccept} data-bs-dismiss="modal">
              Quit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
