import type { r } from "node_modules/@react-router/dev/dist/routes-CZR-bKRt";
import type { ResourceListing } from "~/types/course";
import LoadingButton from "../LoadingButton";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import type { AssignmentSubmissionFull } from "~/types/assignment";
import { formatDate } from "~/utils/date";

export default function AssignmentSubmissionResourceListing({ resource, assignmentId, assignmentSubmissionId }: {
    resource: ResourceListing,
    assignmentId: number,
    assignmentSubmissionId: number
}) {
    const queryClient = useQueryClient();
    const deleteResourceMutation = useMutation({
        mutationKey: ['delete_resource_command'],
        mutationFn: async () => {
            const response = await api.delete("/resource/" + resource.id);
            return response.data;
        },
        async onSuccess() {
            queryClient.setQueryData(['getAssignmentSubmissionForAssignment', { assignmentId: Number(assignmentId) }], (old: AssignmentSubmissionFull) => {
                return { ...old, resources: [...old.resources.filter(r => r.id != resource.id)] }
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
    
    return (
        <li className="list-group-item bg-body-tertiary w-auto d-flex justify-content-between gap-2">
            <div className="hstack gap-2 align-items-start">
                <i className="bi bi-file-earmark-fill text-primary bg-primary-subtle px-2 py-1 rounded-2" />
                <div className="fw-semibold">
                    {resource.linkText || resource.url}
                    <div className="mt-1 text-muted small fw-normal">
                        {formatDate(resource.creationDate)}
                    </div>
                </div>
            </div>
            <div className="hstack gap-2">
                <i className="bi bi-pencil text-primary" role="button" />
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