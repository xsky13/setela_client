import type { Exam } from "~/types/exam";
import { formatDate, getMinutesDifference } from "~/utils/date";

export default function ExamStatusBar({ exam }: { exam: Exam }) {
    return (
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
    );
}