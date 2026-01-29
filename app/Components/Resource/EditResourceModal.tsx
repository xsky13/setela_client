"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import api from "~/api";
import { ResourceParentType, ResourceType } from "~/types/resourceTypes";
import LoadingButton from "../LoadingButton";
import { toast } from "sonner";
import type { FullCourse, Module, ResourceListing } from "~/types/course";
import { closeModal } from "~/utils/modal";
import type { Assignment } from "~/types/assignment";

export default function EditResourceModal({
    resource,
    currentUserIsOwner,
}: {
    resource: ResourceListing,
    currentUserIsOwner: boolean,
}) {
    const [resourceType] = useState(ResourceType.Link);
    const queryClient = useQueryClient();
    const [linkText, setLinkText] = useState(resource.linkText);
    const [url, setUrl] = useState(resource.url);
    const [error, setError] = useState('');
    const editResourceModalRef = useRef<HTMLDivElement>(null);

    const editResourceMutation = useMutation<ResourceListing, Error, { url: string, linkText: string }>({
        mutationKey: ['edit_resource_command'],
        mutationFn: async data => {
            const response = await api.put('/resource/' + resource.id, data);
            return response.data;
        },
        async onSuccess(data) {
            closeModal(editResourceModalRef);

            switch (resource.parentType) {
                case ResourceParentType.Module:
                    queryClient.setQueryData(['getModuleQuery', { moduleId: resource.parentId }], (old: Module) => {
                        return {
                            ...old,
                            resources: old.resources.map((r: ResourceListing) => r.id == resource.id ? {
                                ...r, url: data.url, linkText: data.linkText
                            } : r)
                        }
                    })
                    break;
                case ResourceParentType.Course:
                    queryClient.setQueryData(['getCourseQuery', { courseId: resource.parentId }], (old: FullCourse) => {
                        return {
                            ...old,
                            resources: old.resources.map((r: ResourceListing) => r.id == resource.id ? {
                                ...r, url: data.url, linkText: data.linkText
                            } : r)
                        }
                    })
                    break;
                case ResourceParentType.Assignment:
                    queryClient.setQueryData(['getAssignmentQuery', { assignmentId: resource.parentId }], (old: Assignment) => {
                        return {
                            ...old,
                            resources: old.resources.map((r: ResourceListing) => r.id == resource.id ? {
                                ...r, url: data.url, linkText: data.linkText
                            } : r)
                        }
                    })
                    break;
                default:
                    break;
            }
            setError('');
        },
        onError(error) {
            toast(error.message);
            console.log(error);
        }
    })



    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (resourceType != ResourceType.Link) {
            toast("WIP");
            return;
        }

        if (url == '') {
            setError("URL no puede estar vacío.");
            return;
        }

        const data = {
            url,
            linkText,
        };

        editResourceMutation.mutate(data);
    }

    return (
        <div>
            <button
                type="button"
                className="text-center small text-decoration-none bg-transparent border-0 text-primary"
                data-bs-toggle="modal"
                data-bs-target={"#editResourceModal" + resource.id}
            >
                <i className="bi bi-pencil" />
                <span className="ms-2">Editar</span>
            </button>

            <div ref={editResourceModalRef} className="modal fade" id={"editResourceModal" + resource.id} tabIndex={-1} aria-labelledby={"editResourceModalLabel" + resource.id} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={"editResourceModalLabel" + resource.id}>Editar recurso</h1>
                            <button type="button" className="btn-close" id={"closeEditResourceModalButton" + resource.id} data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <form id={"editResourceForm" + resource.id} onSubmit={handleFormSubmit}>
                                {
                                    (() => {
                                        switch (resourceType) {
                                            case ResourceType.Link:
                                                return (
                                                    <div>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                value={linkText}
                                                                onChange={e => setLinkText(e.target.value)}
                                                                className="form-control"
                                                                id={"linkText" + resource.id}
                                                                placeholder="Nombre del recurso"
                                                            />
                                                            <label htmlFor={"linkText" + resource.id}>Nombre del recurso (opcional)</label>
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                value={url}
                                                                onChange={e => setUrl(e.target.value)}
                                                                className="form-control"
                                                                id={"url" + resource.id}
                                                                placeholder="https://"
                                                            />
                                                            <label htmlFor={"url" + resource.id}>URL</label>
                                                        </div>
                                                    </div>
                                                )
                                            default:
                                                return (
                                                    <>
                                                        <div className="mb-3">
                                                            <label htmlFor="file" className="form-label">Elegir archivo para reemplazar</label>
                                                            <input className="form-control" type="file" id={"file" + resource.id} />
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                value={linkText}
                                                                onChange={e => setLinkText(e.target.value)}
                                                                className="form-control"
                                                                id={"fileLinkText" + resource.id}
                                                                placeholder="Nombre del recurso"
                                                            />
                                                            <label htmlFor={"fileLinkText" + resource.id}>Nombre del recurso (opcional)</label>
                                                        </div>
                                                    </>
                                                )
                                        }
                                    })()
                                }
                                {
                                    error && <p className="text-danger">{error}</p>
                                }
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                            <LoadingButton
                                type="submit"
                                form={"editResourceForm" + resource.id}
                                className="btn btn-primary"
                                loading={editResourceMutation.isPending}
                            >
                                Actualizar recurso
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}