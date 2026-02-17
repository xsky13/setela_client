import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import LoadingButton from "~/Components/LoadingButton";
import EditResourceModal from "~/Components/Resource/EditResourceModal";
import type { Assignment } from "~/types/assignment";
import type { FullCourse, Module, ResourceListing } from "~/types/course";
import type { Exam } from "~/types/exam";
import { ResourceParentType } from "~/types/resourceTypes";

export default function ResourceListing({
    resource,
    currentUserIsOwner,
}: {
    resource: ResourceListing
    currentUserIsOwner: boolean,
}) {
    const queryClient = useQueryClient();
    const deleteResourceMutation = useMutation({
        mutationKey: ['delete_resource_command'],
        mutationFn: async () => {
            const response = await api.delete("/resource/" + resource.id);
            return response.data;
        },
        async onSuccess() {
            switch (resource.parentType) {
                case ResourceParentType.Course:
                    queryClient.setQueryData(['getCourseQuery', { courseId: resource.parentId }], (old: FullCourse) => {
                        return { ...old, resources: old.resources.filter((r: ResourceListing) => r.id != resource.id) }
                    })
                    break;
                case ResourceParentType.Module:
                    queryClient.setQueryData(['getModuleQuery', { moduleId: resource.parentId }], (old: Module) => {
                        return { ...old, resources: old.resources.filter((r: ResourceListing) => r.id != resource.id) }
                    })
                    break;
                case ResourceParentType.Assignment:
                    queryClient.setQueryData(['getAssignmentQuery', { assignmentId: resource.parentId }], (old: Assignment) => {
                        return { ...old, resources: old.resources.filter((r: ResourceListing) => r.id != resource.id) }
                    })
                case ResourceParentType.Exam:
                    queryClient.setQueryData(['getExamQuery', { examId: resource.parentId }], (old: Exam) => {
                        return { ...old, resources: old.resources.filter((r: ResourceListing) => r.id != resource.id) }
                    })
                    break;
                default:
                    break;
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
        <div className="d-flex justify-content-between rounded-2 border border bg-white p-4 my-3">
            <div>
                <div className="bg-transparent border-0 mb-2">
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
                                return <a
                                    href={resource.url + (resource.download ? "?download=true" : "")}
                                    target="blank"
                                    className="h5 card-title text-decoration-none"
                                    rel="noreferrer"
                                >{resource.linkText || resource.url}</a>
                            default:
                                break;
                        }
                    })()
                }
            </div>
            <div className={"d-flex flex-column " + (currentUserIsOwner && "justify-content-end")}>
                {
                    resource.parentType == ResourceParentType.Course && <button className="btn btn-light">
                        <i className='bi bi-check-circle me-2'></i>
                        Marcar finalizado
                    </button>
                }
                {
                    currentUserIsOwner &&
                    <div className="d-flex mt-2">
                        <LoadingButton onClick={deleteResource} loading={deleteResourceMutation.isPending} className="p-0 bg-transparent border-0 text-danger text-center small me-4">
                            <i className="bi bi-trash-fill" />
                            <span className="ms-2">Eliminar</span>
                        </LoadingButton>
                        <EditResourceModal
                            resource={resource}
                            currentUserIsOwner={currentUserIsOwner}
                        />
                    </div>
                }
            </div>
        </div>
    );
}