import type { Assignment, AssignmentSubmission } from "~/types/assignment";
import { formatDate } from "~/utils/date";
import EditAssignmentSubmission from "../AssignmentSubmissions/EditAssignmentSubmission";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import { toast } from "sonner";
import LoadingButton from "../LoadingButton";

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
    const queryClient = useQueryClient();
    const deleteAssignmentSubmissionMutation = useMutation({
        mutationKey: ['delete_assignment_submission_command'],
        mutationFn: async () => {
            if (userSubmission == null) {
                toast('Hubo un error');
                return;
            }
            const response = await api.delete("/AssignmentSubmission/" + userSubmission.id);
            return response.data;
        },
        onError(error) {
            console.log(error);
            toast(error.message);
        },
        onSuccess: () => {
            queryClient.setQueryData(['getAssignmentQuery', { assignmentId: assignmentData.id }], (old: Assignment) => {
                return { ...old, assignmentSubmissions: old.assignmentSubmissions.filter(a => a.id != userSubmission!.id) }
            })
        }
    });

    const deleteAssignmentSubmission = () => {
        if (confirm("Esta seguro que quiere borrar esta entrega? Esta acción es irreversible")) {
            deleteAssignmentSubmissionMutation.mutate();
        }
    }

    return (
        <ul className="list-group">
            {
                userSubmission &&
                <li className="list-group-item">
                    <h4>Mi entrega</h4>
                    <div className="mt-2 mb-1 hstack gap-2">
                        <EditAssignmentSubmission assignmentSubmissionId={userSubmission.id} />
                        <LoadingButton
                            className="btn btn-outline-danger"
                            loading={deleteAssignmentSubmissionMutation.isPending}
                            onClick={deleteAssignmentSubmission}
                        >
                            <i className="bi bi-trash me-2" />
                            Eliminar entrega
                        </LoadingButton>
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