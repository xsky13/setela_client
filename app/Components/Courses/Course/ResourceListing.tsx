import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import LoadingButton from "~/Components/LoadingButton";
import type { ResourceListing } from "~/types/course";
import { ResourceParentType } from "~/types/resourceTypes";

export default function ResourceListing({
    resource,
    currentUserIsOwner,
    resourceDeletionCallback
}: {
    resource: ResourceListing
    currentUserIsOwner: boolean,
    resourceDeletionCallback: (id: string) => void
}) {
    const queryClient = useQueryClient();
    const deleteResourceMutation = useMutation({
        mutationKey: ['delete_resource_command'],
        mutationFn: async () => {
            const response = await api.delete("/resource/" + resource.id);
            return response.data;
        },
        async onSuccess() {
            if (resource.parentType == ResourceParentType.Course) {
                resourceDeletionCallback(`r-${resource.id}`);
                await queryClient.invalidateQueries({ queryKey: ['getCourseQuery'] });
            } else {
                resourceDeletionCallback(resource.id.toString());
                await queryClient.invalidateQueries({ queryKey: ['getModuleQuery'] });
            }
        },
        onError(error) {
            toast(error.message);
            console.log(error);
        }
    });

    const deleteResource = () => {
        if (confirm("Esta seguro que quiere eliminar este recurso? Esta acción es irreversible")) {
            deleteResourceMutation.mutate()
        }
    };

    return (
        <div className="d-flex justify-content-between rounded-2 border border  p-4 my-3">
            <div>
                <div className="bg-white border-0 mb-2">
                    <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-primary-emphasis bg-primary-subtle text-uppercase small">
                        {
                            (() => {
                                switch (resource.resourceType) {
                                    case 1:
                                        return <>
                                            <i className="bi bi-box-arrow-up-right me-2"></i>
                                            Enlace
                                        </>
                                    case 2:
                                        return <>
                                            <i className="bi bi-file-earmark-image-fill me-2"></i>
                                            Imagen
                                        </>
                                    case 3:
                                        return <>
                                            <i className="bi bi-file-earmark me-2"></i>
                                            Recurso
                                        </>
                                    default:
                                        break;
                                }
                            })()
                        }
                    </span>
                </div>
                {
                    (() => {
                        switch (resource.resourceType) {
                            case 1:
                                return <NavLink to={resource.url} target="_blank" className="h5 card-title">{resource.linkText || resource.url}</NavLink>
                            case 2:
                                // should open up a popup with image
                                return <NavLink to={resource.url} className="h5 card-title text-decoration-none">{resource.linkText || resource.url}</NavLink>
                            case 3:
                                return <NavLink to={resource.url} target="_blank" className="h5 card-title text-decoration-none">{resource.linkText || resource.url}</NavLink>
                            default:
                                break;
                        }
                    })()
                }
            </div>
            <div className={"d-flex flex-column " + (currentUserIsOwner && "justify-content-end")}>
                <button className="btn btn-light">
                    <i className='bi bi-check-circle me-2'></i>
                    Marcar finalizado
                </button>
                {
                    currentUserIsOwner &&
                    <div className="d-flex mt-2">
                        <LoadingButton onClick={deleteResource} loading={deleteResourceMutation.isPending} className="p-0 bg-white border-0 text-danger text-center small me-4">
                            <i className="bi bi-trash-fill" />
                            <span className="ms-2">Eliminar</span>
                        </LoadingButton>
                        <NavLink to={`./m/${resource.id}/editar`} className="text-center small text-decoration-none" role="button">
                            <i className="bi bi-pencil" />
                            <span className="ms-2">Editar</span>
                        </NavLink>
                    </div>
                }
            </div>
        </div>
    );
}