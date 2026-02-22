import type { r } from "node_modules/@react-router/dev/dist/routes-CZR-bKRt";
import type { ResourceListing } from "~/types/course";
import LoadingButton from "../LoadingButton";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import type { AssignmentSubmissionFull } from "~/types/assignment";
import { formatDate } from "~/utils/date";
import { useState } from "react";
import { getErrors } from "~/utils/error";

export default function AssignmentSubmissionResourceListing({ resource, assignmentId, assignmentSubmissionId }: {
    resource: ResourceListing,
    assignmentId: number,
    assignmentSubmissionId: number
}) {
    const [updating, setUpdating] = useState(false);
    const [resourceTitle, setResourceTitle] = useState(resource.linkText || resource.url);
    const queryClient = useQueryClient();
    const deleteResourceMutation = useMutation({
        mutationKey: ['delete_resource_command'],
        mutationFn: async () => {
            const response = await api.delete("/resource/" + resource.id);
            return response.data;
        },
        async onSuccess() {
            // TODO unsafe but can't find a way to extract date for now
            queryClient.setQueryData(['getAssignmentSubmissionForAssignment', { assignmentId: Number(assignmentId) }], (old: AssignmentSubmissionFull) => {
                return { ...old, lastUpdateDate: new Date(), resources: [...old.resources.filter(r => r.id != resource.id)] }
            })

            toast("Su recurso fue eliminado exitosamente.");
        },
        onError(error) {
            toast(error.message);
            console.log(error);
        }
    });

    const deleteResource = () => {
        if (confirm("Esta seguro que quiere eliminar este recurso? Esta acción es irreversible.")) {
            deleteResourceMutation.mutate()
        }
    };

    const updateResourceTitleMutation = useMutation<ResourceListing, Error, { linkText: string }>({
        mutationFn: async data => (await api.put(`/resource/${resource.id}`, data)).data,
        onError: error => {
            console.log(getErrors(error));
            toast.error(error.message);
        },
        onSuccess: data => {
            queryClient.setQueryData(['getAssignmentSubmissionForAssignment', { assignmentId: assignmentId }], (old: AssignmentSubmissionFull) => {
                return {
                    ...old, resources: [...old.resources.map(r =>
                        r.id == resource.id ? { ...r, linkText: data.linkText } : r
                    )]
                }
            });
            setUpdating(false);
        }
    });

    const updateResourceTitle = () => {
        updateResourceTitleMutation.mutate({ linkText: resourceTitle });
    }

    return (
        <li className="list-group-item bg-body-tertiary w-auto d-flex justify-content-between gap-2">
            <div className="hstack gap-2 align-items-start">
                <i className="bi bi-file-earmark-fill text-primary bg-primary-subtle px-2 py-1 rounded-2" />
                <div className="fw-semibold">
                    {
                        updating ?
                            <div className="d-flex align-items-center gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={resourceTitle}
                                    onChange={e => setResourceTitle(e.target.value)}
                                />
                                <LoadingButton
                                    className="btn btn-outline-primary"
                                    onClick={updateResourceTitle}
                                    loading={updateResourceTitleMutation.isPending}
                                >
                                    Guardar
                                </LoadingButton>
                            </div>
                            :
                            (resource.linkText || resource.url)
                    }
                    <div className="mt-1 text-muted small fw-normal">
                        {formatDate(resource.creationDate)}
                    </div>
                </div>
            </div>
            <div className="hstack gap-2">
                <div
                    role="button"
                >
                    {
                        updating ?
                            <div className="d-flex gap-2">
                                <i
                                    className="bi bi-arrow-counterclockwise"
                                    onClick={() => setResourceTitle(resource.linkText || resource.url)}
                                    title="Deshacer cambios"
                                    role="button"
                                />
                                <i
                                    onClick={() => setUpdating(false)}
                                    className="bi bi-x-circle-fill"
                                />
                            </div>
                            :
                            <i
                                onClick={() => setUpdating(true)}
                                className="bi bi-pencil"
                            />
                    }
                </div>
                <LoadingButton
                    onClick={deleteResource}
                    loading={deleteResourceMutation.isPending}
                    className="text-danger bg-transparent p-0 border-0"
                >
                    <i className="bi bi-trash" role="button" />
                </LoadingButton>
            </div>
        </li>
    );
}