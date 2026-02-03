import type { Assignment, AssignmentSubmission } from "~/types/assignment";
import { formatDate } from "~/utils/date";
import LoadingButton from "../LoadingButton";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import { toast } from "sonner";
import GradeModal from "./GradeModal";

export default function AssignmentSubmissionListing({ assignmentSubmission, assignment }: { assignmentSubmission: AssignmentSubmission, assignment: Assignment }) {
    const [isLate, setIsLate] = useState(false);
    const [updateIsLate, setUpdateIsLate] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const submissionTime = new Date(assignmentSubmission.creationDate).getTime();
        const submissionUpdateTime = new Date(assignmentSubmission.lastUpdateDate).getTime();
        const dueTime = new Date(assignment.dueDate).getTime();

        if (submissionTime > dueTime) setIsLate(true);
        if (submissionUpdateTime > dueTime) setUpdateIsLate(true);
    }, [assignmentSubmission, assignment]);

    const deleteAssignmentSubmissionMutation = useMutation({
        mutationKey: ['delete_assignment_submission_command'],
        mutationFn: async () => {
            const response = await api.delete("/AssignmentSubmission/" + assignmentSubmission.id);
            return response.data;
        },
        onError(error) {
            console.log(error);
            toast(error.message);
        },
        onSuccess: () => {
            queryClient.setQueryData(['getAssignmentQuery', { assignmentId: assignment.id }], (old: Assignment) => {
                return { ...old, assignmentSubmissions: old.assignmentSubmissions.filter(a => a.id != assignmentSubmission.id) }
            })
        }
    });

    const deleteAssignmentSubmission = () => {
        if (confirm("Esta seguro que quiere borrar esta entrega? Esta acción es irreversible")) {
            deleteAssignmentSubmissionMutation.mutate();
        }
    }

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
                <LoadingButton onClick={deleteAssignmentSubmission} loading={deleteAssignmentSubmissionMutation.isPending} className="p-0 bg-transparent border-0 text-danger text-center small me-4">
                    <i className="bi bi-trash-fill" />
                    <span className="ms-2">Eliminar</span>
                </LoadingButton>
                <GradeModal assignmentSubmissionId={assignmentSubmission.id} />
            </td>
        </tr>
    );
}