import type { ProfessorCourse } from "~/types/course";


export default function ProfessorView({ courses }: { courses: ProfessorCourse[] }) {
    return (
        <div>
            <h2>Materias enseñadas</h2>
            <p>Gestiona y accede a tus cursos académicos</p>
            <div className="row">
                {
                    courses.length != 0 ?
                        courses.map(course => (

                            <div className="col-md-6 col-lg-4">
                                <div className="card border-2 border-primary h-100 p-3">
                                    <div className="card-header border-0 bg-white ">
                                        <h5 className="card-title mb-0">{course.title}</h5>
                                        <small>Primer año</small>
                                    </div>
                                    <div className="card-body">
                                        <hr className="mt-0" />
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center text-muted mb-2">
                                                <i className="bi bi-people-fill me-2"></i>
                                                <small className="text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>
                                                    Estudiantes inscritos
                                                </small>
                                            </div>
                                            <h2 className="mb-0 text-primary fw-bold">{course.students}</h2>
                                        </div>
                                        <hr />
                                        <div className="">
                                            <h6 className="text-muted mb-2"><i className="bi bi-bell-fill"></i> Accion requerida</h6>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="small">Examenes a corregir</span>
                                                <span className="badge bg-warning text-dark">{course.examsToGrade}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="small">Entregas a corregir</span>
                                                <span className="badge bg-info text-dark">{course.assignmentsToGrade}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer border-0 bg-white text-center">
                                        <button className="btn btn-primary my-1 w-100">
                                            <i className="bi bi-box-arrow-in-right"></i> Ir al curso
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        <div>

                        </div>
                }
            </div>
        </div>
    )
}