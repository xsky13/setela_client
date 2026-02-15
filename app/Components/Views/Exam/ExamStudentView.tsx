import type { ExamDataView } from "~/types/exam";
import { formatDate, getMinutesDifference } from "~/utils/date";
import '../../styles/ExamStyles.css';
import '../../styles/AssignmentUpload.css';
import ExamSubmissionModal from "./ExamSubmissionModal";
import ExamStatusBar from "./ExamStatusBar";

export default function ExamStudentView({ exam }: { exam: ExamDataView }) {

    return (
        <div>
            <h1 style={{ margin: 0 }}>{exam.title}</h1>
            <div className={`badge rounded-pill ${exam.closed ? "text-bg-danger" : "text-bg-success"}`} style={{ marginBottom: '0.5rem' }}>
                {exam.closed ?
                    <>
                        <i className="bi bi-lock-fill" />
                        <span className="ms-1">Cerrado</span>
                    </> : <>
                        <i className="bi bi-unlock-fill" />
                        <span className="ms-1">Abierto</span>
                    </>}
            </div>
            <div className="container">
                <div className="row gap-3">
                    <div
                        className="position-relative col d-flex flex-column justify-content-center align-items-center rounded-2 px-3 py-1 flex-grow-1 upload-section bg-body-tertiary"
                        style={{ minHeight: '15rem' }}
                    >
                        <ExamSubmissionModal exam={exam} />
                        <div className="text-muted small mt-2">Solo podras hacer 1 intento.</div>
                    </div>
                    <div className="col-7">
                        <ExamStatusBar
                            exam={exam}
                        />
                        <h4>Mi entrega</h4>
                        <i className="text-muted">
                            <i className="bi bi-info-circle me-2"></i>
                            <span>Todavia no ha creado una entrega.</span>
                        </i>
                    </div>
                </div>
            </div>
        </div>
    );
}