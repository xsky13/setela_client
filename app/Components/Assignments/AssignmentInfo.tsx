import type { Assignment, AssignmentSubmission, AssignmentSubmissionFull } from "~/types/assignment";
import { formatDate } from "~/utils/date";
import EditAssignmentSubmission from "../AssignmentSubmissions/EditAssignmentSubmission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import { toast } from "sonner";
import LoadingButton from "../LoadingButton";
import AddResourcesModal from "../Resource/AddResourcesModal";
import AssignmentSubmissionResourceListing from "../AssignmentSubmissions/AssignmentSubmissionResourceListing";

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
    const dueDate = new Date(assignmentData.dueDate).getTime();
    let creationDate;
    let lastUpdateDate;
    if (userSubmission) {
        creationDate = new Date(userSubmission.creationDate).getTime();
        lastUpdateDate = new Date(userSubmission.lastUpdateDate).getTime();
    }

    const { data: assignmentSubmission } = useQuery<AssignmentSubmissionFull>({
        queryKey: ['getAssignmentSubmissionForAssignment', { assignmentId: assignmentData.id }],
        queryFn: async () => {
            const response = await api.get("/assignmentSubmission/" + userSubmission?.id);
            return response.data;
        },
        enabled: !!userSubmission?.id,
        retry: 1
    });


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
                    <div className="mb-1 hstack justify-content-between">
                        <h4>Mi entrega</h4>
                        <LoadingButton
                            className="btn btn-outline-danger"
                            loading={deleteAssignmentSubmissionMutation.isPending}
                            onClick={deleteAssignmentSubmission}
                        >
                            <i className="bi bi-trash me-2" />
                            Eliminar entrega
                        </LoadingButton>
                    </div>
                    <div className="fw-semibold fs-5 hstack gap-3">
                        {
                            currentUserSubmitted ?
                                <div className="pill-lg pill-primary">
                                    <i className="bi-check-circle-fill"></i>
                                    Entregado
                                </div>
                                :
                                <div className="pill-lg pill-warning">
                                    <i className="bi-alarm"></i>
                                    Pendiente
                                </div>
                        }
                        {
                            userSubmission ?
                                creationDate! > dueDate ?
                                    <div className="pill-lg pill-danger">
                                        <i className="bi-exclamation-circle-fill"></i>
                                        Entregado tarde
                                    </div>
                                    :
                                    <div className="pill-lg pill-success">
                                        <i className="bi-calendar-check-fill"></i>
                                        Entregado a tiempo
                                    </div>
                                :
                                expired ?
                                    <div className="pill-lg pill-danger">
                                        <i className="bi-exclamation-circle-fill"></i>
                                        Tarde
                                    </div>
                                    :
                                    <div className="pill-lg pill-primary">
                                        <i className="bi-exclamation-triangle-fill"></i>
                                        A tiempo
                                    </div>
                        }

                        {/* check: if last updated date is older than dueDate, but dont show pill if user already submitted late */}
                        {
                            (creationDate && lastUpdateDate) && (
                                creationDate < dueDate && (
                                    lastUpdateDate > dueDate &&
                                    <div className="pill-lg pill-danger">
                                        <i className="bi-exclamation-circle-fill"></i>
                                        Actualizado tarde
                                    </div>
                                )
                            )
                        }

                        {
                            userSubmission && (
                                userSubmission?.grade ?
                                    <div className="pill-lg pill-success">
                                        <i className="bi-check-circle-fill"></i>
                                        Calificado
                                    </div>
                                    :
                                    <div className="pill-lg pill-warning">
                                        <i className="bi-clock"></i>
                                        Aguardando calificacion
                                    </div>
                            )
                        }
                    </div>
                </li>
            }
            {
                assignmentSubmission &&
                <li className="list-group-item">
                    <span className="subtitle small">Archivos adjuntos</span>
                    <div className="mt-1 list-group d-inline">
                        {
                            assignmentSubmission.resources &&
                                assignmentSubmission.resources.length != 0 ?
                                assignmentSubmission.resources.map(r =>
                                    <AssignmentSubmissionResourceListing
                                        resource={r}
                                        assignmentId={assignmentData.id}
                                        assignmentSubmissionId={assignmentSubmission.id}
                                    />
                                )
                                :
                                <div className="text-muted">
                                    <i className="bi bi-info-circle" />
                                    <i className="ms-2">No hay documentos</i>
                                </div>
                        }
                        <div className="mt-2">
                            <AddResourcesModal
                                type="assignmentSubmission"
                                parentId={assignmentSubmission.id}
                                courseId={assignmentData.courseId}
                                grandparentId={assignmentData.id}
                            />
                        </div>
                    </div>
                </li>
            }
            <li className="list-group-item">
                <span className="subtitle small">Nota</span>
                {
                    currentUserSubmitted ?
                        userSubmission?.grade ?
                            <div className="my-1 fs-4 fw-semibold text-primary">
                                {userSubmission.grade.value}
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
        </ul>
    )
}