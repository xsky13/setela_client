import { Link } from "react-router";

export default function AdminView() {
    return (
        <>
            <h2>Panel de gestión</h2>
            <p>Maneje los usuarios y cursos de la aplicación.</p>
            <div className="row g-3">
                <div className="col-md-6 col-lg-4 flex-grow-1">
                    <div className="card border-2 border-primary h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-start mb-3">
                                <div className="bg-secondary bg-opacity-10 d-inline-flex justify-content-center align-items-center rounded-circle me-3"  style={{ width: '4rem', height: '4rem' }}>
                                    <i className="bi bi-person-fill text-secondary fs-4"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="card-title mb-1">Gestión de usuarios</h5>
                                    <p className="text-muted small mb-0">
                                        Crear, editar y administrar usuarios del sistema
                                    </p>
                                </div>
                            </div>
                            <Link to="administracion/usuarios" className="btn btn-light w-100">
                                Administrar usuarios <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4 flex-grow-1">
                    <div className="card border-2 border-primary h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-start mb-3">
                                <div className="bg-secondary bg-opacity-10 rounded-circle me-3 d-inline-flex justify-content-center align-items-center" style={{ width: '4rem', height: '4rem' }}>
                                    <i className="bi bi-book-half text-secondary fs-4"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="card-title mb-1">Gestión de cursos</h5>
                                    <p className="text-muted small mb-0">
                                        Crear, editar y asignar cursos a profesores
                                    </p>
                                </div>
                            </div>
                            <Link to="/administracion/cursos" className="btn btn-light w-100">
                                Administrar cursos <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}