import type { Assignment, AssignmentSubmission } from "~/types/assignment";
import { formatDate } from "~/utils/date";
import EditAssignmentSubmission from "../AssignmentSubmissions/EditAssignmentSubmission";

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
        <ul className="list-group">
            {
                userSubmission &&
                <li className="list-group-item">
                    <span className="subtitle small">Contenido</span>
                    <div className="my-1">
                        <EditAssignmentSubmission assignmentSubmission={userSubmission} />
                    </div>
                </li>
            }
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
            <li className="list-group-item">
                <span className="subtitle small">Ultima actualizacion</span>
                {
                    !currentUserSubmitted ?
                        <div className="my-1">
                            <i className="text-muted">Todavía no hay entrega.</i>
                        </div>
                        :
                        <div className="text-muted small my-1">
                            <i className="bi bi-clock" />
                            <span className="ms-2">{formatDate(userSubmission?.lastUpdateDate)}</span>
                        </div>
                }
            </li>
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
        </ul>
    )
}