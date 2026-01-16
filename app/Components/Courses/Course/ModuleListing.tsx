import { NavLink } from "react-router";

export default function ModuleListing({ id, title} : { id: number, title: string }) {
    return (
        <div className="d-flex justify-content-between rounded-2 border border  p-4 my-3">
            <div>
                <div className="bg-white border-0 mb-2">
                    <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-primary-emphasis bg-primary-subtle text-uppercase small">
                        <i className="bi bi-book me-2"></i>
                        Modulo
                    </span>
                </div>
                <NavLink to={`./m/${id}`} className="h5 card-title text-decoration-none">{title}</NavLink>
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