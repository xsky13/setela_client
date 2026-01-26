import { NavLink } from "react-router";
import { formatDate } from "~/utils/date";

export default function AssignmentListing({
    id,
    title,
    dueDate,
}: {
    id: number,
    title: string,
    dueDate: string,
}) {
    return (
        <div className="d-flex justify-content-between rounded-2 border  p-4 my-3">
            <div>
                <div className="bg-white border-0 mb-2">
                    <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-success-emphasis bg-success-subtle text-uppercase small">
                        <i className="bi bi-card-checklist me-2"></i>
                        Trabajo practico
                    </span>
                </div>
                <NavLink to={`./a/${id}`} className="h5 card-title text-decoration-none">{title}</NavLink>
                <div className="d-flex mt-2 small text-muted">
                    <p>
                        <i className='bi bi-calendar-week'></i> Vence el <span className="fw-semibold">{formatDate(dueDate)}</span></p>
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