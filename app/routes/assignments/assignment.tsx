import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router";
import AssignmentSubmissionListing from "~/Components/AssignmentSubmissions/AssignmentSubmissionListing";
import ResourceListing from "~/Components/Courses/Course/ResourceListing";
import { AssignmentContext } from "~/context/AssignmentContext";
import { CourseContext } from "~/context/CourseContext";
import { formatDate } from "~/utils/date";

export default function Assignment() {
    const assignmentData = useContext(AssignmentContext);
    const [timeLeft, setTimeLeft] = useState(0);

    const courseData = useContext(CourseContext);

    if (!courseData || !assignmentData) throw new Error("Hubo un error.");

    useEffect(() => {
        const dueDate = new Date(assignmentData.dueDate).getTime();
        const now = new Date().getTime();

        const diffInMs = dueDate - now;
        setTimeLeft(Math.floor(diffInMs / (1000 * 60 * 60 * 24)));
    }, [assignmentData])

    console.log(assignmentData);


    return (
        <div>
            <nav
                style={{
                    '--bs-breadcrumb-divider': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E\")"
                } as React.CSSProperties}
                aria-label="breadcrumb"
            >
                <ol className="breadcrumb">
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to="/" className="text-decoration-none text-muted">
                            <i className="bi bi-house-fill me-1" />
                        </NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to={`/cursos/${courseData!.id}`} className="text-decoration-none text-muted mx-1">{courseData?.title}</NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to={`/cursos/${courseData!.id}/a/${assignmentData.id}`} className="text-decoration-none text-muted mx-1">{assignmentData?.title}</NavLink>
                    </li>
                </ol>
            </nav>
            <h1>{assignmentData.title}</h1>
            <div className="mt-3">
                <div className="alert alert-warning alert-warning-custom">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-exclamation-triangle-fill text-warning fs-4"></i>
                        <div className="ms-2">
                            <strong>Fecha de vencimiento: {formatDate(assignmentData.dueDate)}</strong>
                            <p className="mb-0 small mt-1">Quedan {timeLeft} días para la entrega</p>
                        </div>
                    </div>
                </div>
            </div>
            {
                assignmentData.textContent &&
                <div className="my-5 px-3 py-2 m-0 rounded-1 bg-body-tertiary">
                    <h3>Consigna</h3>
                    <p>
                        {assignmentData.textContent}
                    </p>
                </div>
            }
            {assignmentData.textContent && <p>{assignmentData.textContent}</p>}
            {
                assignmentData.resources.length &&
                <div className="my-5">
                    <h3>Recursos y materiales</h3>
                    {
                        assignmentData.resources.map(resource => (
                            <ResourceListing resource={resource} currentUserIsOwner={courseData.currentUserIsOwner} />
                        ))
                    }
                </div>
            }
            {
                (courseData.currentUserIsOwner && assignmentData.assignmentSubmissions.length) &&
                <div>
                    <h2>Entregas</h2>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Nro</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Hora de entrega</th>
                                <th scope="col">Ultima actualizacion</th>
                                <th scope="col">Nota</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                assignmentData.assignmentSubmissions.map((assignmentSubmission, i) => (
                                    <tr key={i} className="">
                                        <th scope="row">{i + 1}</th>
                                        <td>{assignmentSubmission.sysUser.name}</td>
                                        <td>{formatDate(assignmentSubmission.creationDate)}</td>
                                        <td>{formatDate(assignmentSubmission.lastUpdateDate)}</td>
                                        <td>{assignmentSubmission.grade || <i>Sin calificar</i>}</td>
                                        <td>{assignmentSubmission.grade ?
                                            <span className="badge rounded-pill text-bg-primary">Corregida</span>
                                            :
                                            <span className="badge rounded-pill text-bg-danger">Pendiente</span>
                                        }</td>
                                        <td>Eliminar | Corregir</td>
                                    </tr>
                                ))

                            }
                        </tbody>
                    </table>
                    {/* {
                        assignmentData.assignmentSubmissions.map(assignmentSubmission => (
                            <AssignmentSubmissionListing assignmentSubmission={assignmentSubmission} />
                        ))
                    } */}
                </div>
            }
        </div>
    );
}