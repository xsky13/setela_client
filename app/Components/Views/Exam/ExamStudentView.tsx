import type { ExamDataView } from "~/types/exam";
import { formatDate, getMinutesDifference } from "~/utils/date";

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
                        className="col d-flex flex-column justify-content-center align-items-center rounded-2 px-3 py-1 border border-2 border-primary flex-grow-1" style={{ minHeight: '15rem' }}>
                        <div className="text-muted small mb-2">Solo podras hacer 1 intento.</div>
                        <button className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
                            Comenzar examen
                        </button>
                    </div>
                    <div className="col-7">
                        <div className="d-flex justify-content-between w-100 py-2 px-4 rounded-2 border bg-body-tertiary mb-3">
                            <div className="small text-muted d-flex align-items-center">
                                <i className="bi bi-clock" />
                                <div className="ms-2">
                                    <span className="fw-semibold">Duracion: </span>
                                    <div>{getMinutesDifference(exam.startTime, exam.endTime)} minutos</div>
                                </div>
                            </div>
                            <div className="small text-muted d-flex align-items-center">
                                <i className="bi bi-hourglass-top" />
                                <div className="ms-2">
                                    <span className="fw-semibold">Hora de comienzo: </span>
                                    <div>{formatDate(exam.startTime)}</div>
                                </div>
                            </div>
                            <div className="small text-muted d-flex align-items-center">
                                <i className="bi bi-hourglass-bottom" />
                                <div className="ms-2">
                                    <span className="fw-semibold">Hora de finalizacion: </span>
                                    <div>{formatDate(exam.endTime)}</div>
                                </div>
                            </div>
                        </div>
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