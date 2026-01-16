import { NavLink } from "react-router";

export default function ExamListing({
    id,
    title,
    startTime,
    endTime,
    getMinutesDifference,
    formatDate
}: { 
    id: number, 
    title: string, 
    startTime: string, 
    endTime: string,
    getMinutesDifference: (a: string, b: string) => number,
    formatDate: (a: string) => any
}) {
    return (
        <div className="d-flex justify-content-between rounded-2 border border-2 border-danger  p-4 my-3">
            <div>
                <div className="bg-white border-0 mb-2">
                    <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-danger-emphasis bg-danger-subtle text-uppercase small">
                        <i className="bi bi-book me-2"></i>
                        Examen
                    </span>
                </div>
                <NavLink to={`./e/${id}`} className="h5 card-title text-decoration-none">{title}</NavLink>
                <div className="d-flex mt-2 small text-muted">
                    <p><i className='bi bi-calendar-week'></i> Apertura: <span className="fw-semibold">{startTime ? formatDate(startTime) : 'Sin fecha'}</span></p>
                    <div className="ms-3">
                        <i className='bi bi-clock'></i> Duracion: <span className="fw-semibold">{getMinutesDifference(startTime, endTime)}</span> minutos
                    </div>
                </div>
            </div>
            <div>
                <button className="btn btn-light">
                    <i className='bi bi-check-circle me-2'></i>
                    Marcar finalizado
                </button>
            </div>
        </div>
    );
}