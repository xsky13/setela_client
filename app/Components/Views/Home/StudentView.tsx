import type { ProfessorCourse, StudentCourse } from "~/types/course";


export default function StudentView({ courses }: { courses: StudentCourse[] }) {
    return (
        <div className="container">
            <h2>Materias inscriptas</h2>
            <p>Gestiona y accede a tus materias inscrptas</p>
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
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center text-muted mb-2">
                                                <i className="bi bi-people-fill me-2"></i>
                                                <small className="text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>
                                                    Progreso
                                                </small>
                                            </div>
                                            <div className="fw-bold text-primary h5">
                                                75%
                                            </div>
                                        </div>
                                        <div className="progress progress-secondary" aria-label="Example 1px high" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} role="progressbar" style={{ height: '3px' }}>
                                            <div className="progress-bar w-75"></div>
                                        </div>
                                        {/* <hr className="mt-4"/>
                                        <h6 className="text-muted mb-2"><i className="bi bi-person-fill"></i> Profesor(es)</h6>
                                        {
                                            course.
                                        } */}
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