import type { Assignment, AssignmentSubmission, AssignmentSubmissionFull } from "~/types/assignment";
import { formatDate } from "~/utils/date";
import EditAssignmentSubmission from "../AssignmentSubmissions/EditAssignmentSubmission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import { toast } from "sonner";
import LoadingButton from "../LoadingButton";
import AddResourcesModal from "../Resource/AddResourcesModal";
import AssignmentSubmissionResourceListing from "../AssignmentSubmissions/AssignmentSubmissionResourceListing";
import { useEffect, useState } from "react";

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

    const [updating, setUpdating] = useState(false);

    const { data: assignmentSubmission } = useQuery<AssignmentSubmissionFull>({
        queryKey: ['getAssignmentSubmissionForAssignment', { assignmentId: assignmentData.id }],
        queryFn: async () => {
            const response = await api.get("/assignmentSubmission/" + userSubmission?.id);
            return response.data;
        },
        enabled: !!userSubmission?.id,
        retry: 1
    });


    const [textContent, setTextContent] = useState(assignmentSubmission?.textContent || "");

    useEffect(() => {
        if (assignmentSubmission?.textContent) {
            setTextContent(assignmentSubmission.textContent);
        }
    }, [assignmentSubmission?.textContent]);


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
            
            queryClient.removeQueries({ queryKey: ['getAssignmentSubmissionForAssignment', { assignmentId: assignmentData.id }] });
        }
    });

    const updateAssignmentSubmissionText = useMutation<AssignmentSubmission, Error, { textContent: string }>({
        mutationKey: ['update_assignment_submission_content'],
        mutationFn: async data => {
            const response = await api.put('/AssignmentSubmission/' + assignmentSubmission?.id, data);
            return response.data;
        },
        onSuccess: data => {
            toast("Su entrega ha sido actualizada");
            queryClient.setQueryData(['getAssignmentSubmissionForAssignment', { assignmentId: assignmentData.id }], (old: AssignmentSubmissionFull) => {
                return { ...old, textContent: data.textContent, lastUpdateDate: data.lastUpdateDate }
            });
            setUpdating(false);
        },
        onError: (error) => {
            console.log(error);
            toast(error.message);
        }
    });

    const currentSub = assignmentSubmission || userSubmission;
    const creationDate = currentSub ? new Date(currentSub.creationDate).getTime() : null;
    const lastUpdateDate = currentSub ? new Date(currentSub.lastUpdateDate).getTime() : null;

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        updateAssignmentSubmissionText.mutate({ textContent });
    }


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
                    <div className="subtitle small">Archivos adjuntos</div>
                    <div className="list-group mb-3 mt-2">
                        {
                            assignmentSubmission.resources &&
                                assignmentSubmission.resources.length != 0 ?
                                assignmentSubmission.resources.map((r, i) =>
                                    <AssignmentSubmissionResourceListing
                                    key={i}
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
                    </div>
                    <AddResourcesModal
                        type="assignmentSubmission"
                        parentId={assignmentSubmission.id}
                        courseId={assignmentData.courseId}
                        grandparentId={assignmentData.id}
                    />
                </li>
            }
            <li className="list-group-item">
                <span className="subtitle small">Comentarios</span>
                <p className="mt-2">
                    <div className="d-flex gap-2">
                        {
                            updating ?
                                <>
                                    <div>
                                        <i className="bi bi-x-circle-fill" onClick={() => setUpdating(false)} role="button" />
                                        <i
                                            className="bi bi-arrow-counterclockwise"
                                            onClick={() => setTextContent(assignmentSubmission?.textContent || textContent)}
                                            title="Deshacer cambios"
                                            role="button" />
                                    </div>
                                    <form onSubmit={handleUpdate} className="w-100">
                                        <div className="form-floating mb-3">
                                            <textarea
                                                id="description"
                                                name="description"
                                                className="form-control"
                                                placeholder="Descripción"
                                                style={{ height: '100px' }}
                                                value={textContent}
                                                onChange={e => setTextContent(e.target.value)}
                                            />
                                            <label htmlFor="description">Comentarios</label>
                                        </div>
                                        <LoadingButton
                                            loading={updateAssignmentSubmissionText.isPending}
                                            className="btn btn-primary w-100"
                                            disabled={textContent == currentSub?.textContent}
                                        >
                                            Guardar cambios
                                        </LoadingButton>
                                    </form>
                                </>
                                :
                                <>
                                    <i className="bi bi-pencil text-primary" onClick={() => setUpdating(true)} role="button" />
                                    {assignmentSubmission?.textContent}
                                </>
                        }

                    </div>
                </p>
            </li>
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
                            <span className="ms-2">{formatDate(currentSub?.lastUpdateDate)}</span>
                        </div>
                }
            </li>
        </ul>
    )
}