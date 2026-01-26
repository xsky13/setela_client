import type { Assignment, AssignmentSubmission } from "~/types/assignment";
import { formatDate } from "~/utils/date";
import LoadingButton from "../LoadingButton";
import { useEffect, useState } from "react";

export default function AssignmentSubmissionListing({ assignmentSubmission, assignment }: { assignmentSubmission: AssignmentSubmission, assignment: Assignment }) {
    const [isLate, setIsLate] = useState(false);
    const [updateIsLate, setUpdateIsLate] = useState(false);

    useEffect(() => {
        const submissionTime = new Date(assignmentSubmission.creationDate).getTime();
        const submissionUpdateTime = new Date(assignmentSubmission.lastUpdateDate).getTime();
        const dueTime = new Date(assignment.dueDate).getTime();

        if (submissionTime > dueTime) setIsLate(true);
        if (submissionUpdateTime > dueTime) setUpdateIsLate(true);
    }, [assignmentSubmission, assignment])

    return (
        <tr className="">
            <th scope="row">1</th>
            <td className="fw-semibold">{assignmentSubmission.sysUser.name}</td>
            <td className="text-muted small">
                {formatDate(assignmentSubmission.creationDate)}
                {
                    isLate &&
                    <div className="text-danger mt-1">
                        <i className="bi-exclamation-triangle-fill"></i>
                        <span className="ms-2">Entregado tarde</span>
                    </div>
                }
            </td>
            <td className="text-muted small">
                {formatDate(assignmentSubmission.lastUpdateDate)}
                {
                    updateIsLate &&
                    <div className="text-danger mt-1">
                        <i className="bi-exclamation-triangle-fill"></i>
                        <span className="ms-2">Editado tarde</span>
                    </div>
                }
            </td>
            <td>{assignmentSubmission.grade || <i>Sin calificar</i>}</td>
            <td>{assignmentSubmission.grade ?
                <span className="badge rounded-pill text-bg-primary">Corregida</span>
                :
                <span className="badge rounded-pill text-bg-danger">Pendiente</span>
            }</td>
            <td>
                <LoadingButton loading={false} className="p-0 bg-transparent border-0 text-danger text-center small me-4">
                    <i className="bi bi-trash-fill" />
                    <span className="ms-2">Eliminar</span>
                </LoadingButton>
                <div className="block small" role="button">
                    <i className="bi bi-pencil" />
                    <span className="ms-2">Corregir</span>
                </div>
            </td>
        </tr>
    );
}