import type { Assignment, AssignmentSubmission } from "~/types/assignment";
import { formatDate } from "~/utils/date";

export default function AssignmentInfo({
    assignmentData,
    currentUserIsOwner,
    currentUserSubmitted,
    expired,
    userSubmission
}: { 
    assignmentData: Assignment
    currentUserIsOwner: boolean 
    currentUserSubmitted: boolean,
    expired: boolean,
    userSubmission: AssignmentSubmission | null
}) {
    return (
        <>
            <h3>Información del trabajo</h3>
            <ul className="list-group">
                {
                    currentUserIsOwner &&
                    <li className="list-group-item">
                        <span className="subtitle small">Estado</span>
                        <div className="d-flex my-1">
                            <div className="badge rounded-pill text-bg-primary">
                                {assignmentData.visible ?
                                    <>
                                        <i className="bi bi-eye" />
                                        <span className="ms-1">Visible</span>
                                    </> : <>
                                        <i className="bi bi-eye-slash" />
                                        <span className="ms-1">No visible</span>
                                    </>}
                            </div>
                            <div className="badge rounded-pill text-bg-success ms-2">
                                {assignmentData.closed ?
                                    <>
                                        <i className="bi bi-lock-fill" />
                                        <span className="ms-1">Cerrado</span>
                                    </> : <>
                                        <i className="bi bi-unlock-fill" />
                                        <span className="ms-1">Abierto</span>
                                    </>}
                            </div>

                        </div>
                    </li>
                }
                <li className="list-group-item">
                    <span className="subtitle small">Nota maxima</span>
                    <div className="fs-4 fw-semibold">
                        {assignmentData.maxGrade}
                    </div>
                </li>
                {
                    !currentUserIsOwner &&
                    <li className="list-group-item">
                        <span className="subtitle small">Estado de entrega</span>
                        <div className={`fw-semibold fs-5 ${currentUserSubmitted ?
                            'text-success'
                            : expired ? 'text-danger' : 'text-warning'
                            }`}>
                            {
                                currentUserSubmitted ?
                                    <div className="my-1">
                                        <i className="bi-check-circle-fill"></i>
                                        <span className="ms-2">Entregado</span>
                                    </div>
                                    :
                                    expired ?
                                        <div className="my-1">
                                            <i className="bi-exclamation-circle-fill"></i>
                                            <span className="ms-2">Tarde</span>
                                        </div>
                                        :
                                        <div className="my-1">
                                            <i className="bi-exclamation-triangle-fill"></i>
                                            <span className="ms-2">Pendiente</span>
                                        </div>
                            }
                        </div>
                    </li>
                }
                {
                    !currentUserIsOwner &&
                    <li className="list-group-item">
                        <span className="subtitle small">Hora de entrega</span>
                        {
                            !currentUserSubmitted ?
                                <div className="my-1">
                                    <i className="text-muted">Todavía no hay entrega.</i>
                                </div>
                                :
                                <div className="text-muted small my-1">
                                    <i className="bi bi-clock" />
                                    <span className="ms-2">{formatDate(userSubmission?.creationDate)}</span>
                                </div>
                        }
                    </li>
                }
                {
                    !currentUserIsOwner &&
                    <li className="list-group-item">
                        <span className="subtitle small">Nota</span>
                        {
                            currentUserSubmitted ?
                                userSubmission?.grade ?
                                    <div className="my-1 fs-4 fw-semibold text-primary">
                                        {userSubmission.grade}
                                    </div>
                                    :
                                    <div className="my-1">
                                        <i className="text-muted">Todavía no hay nota.</i>
                                    </div>
                                :
                                <div className="my-1">
                                    <i className="text-muted">Todavía no hay nota.</i>
                                </div>
                        }
                    </li>
                }
                {
                    currentUserIsOwner &&
                    <li className="list-group-item">
                        <span className="subtitle small">Entregas por corregir</span>
                        <div className="my-1 fs-4 fw-semibold">
                            {assignmentData.assignmentSubmissions.filter(a => !a.grade).length}
                        </div>
                    </li>
                }
            </ul>
        </>
    )
}