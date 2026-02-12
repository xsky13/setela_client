"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import api from "~/api";
import { ResourceType } from "~/types/resourceTypes";
import LoadingButton from "../LoadingButton";
import { toast } from "sonner";
import { closeModal } from "~/utils/modal";
import type { FullCourse, Module, ResourceListing } from "~/types/course";
import { createPortal } from 'react-dom';
import { useSearchParams } from "react-router";
import type { Assignment } from "~/types/assignment";
import type { ExamDataView } from "~/types/exam";

export default function AddResourcesModal({
    type,
    parentId,
    courseId,
}: {
    type: string;
    parentId: number,
    courseId: number,
}) {
    const [resourceType, setResourceType] = useState(ResourceType.Link);
    const queryClient = useQueryClient();
    const [linkText, setLinkText] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const openModalRef = useRef<HTMLButtonElement>(null);

    const [searchParams, setSearchParams] = useSearchParams();


    const removeParam = (paramName: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete(paramName);
        setSearchParams(newSearchParams);
    };

    useEffect(() => {
        if (searchParams.get("resourceCreation")) {
            if (openModalRef.current) {
                openModalRef.current.click();
                removeParam("resourceCreation");
            }
        }
    }, [])


    const addResourceMutation = useMutation<ResourceListing, Error, {
        url: string, linkText: string, type: string, parentType: string, parentId: number, courseId: number
    }>({
        mutationKey: ['add_resource_command'],
        mutationFn: async data => {
            const response = await api.post('/resource', data);
            return response.data;
        },
        async onSuccess(data) {
            closeModal(modalRef);
            switch (type) {
                case "module":
                    queryClient.setQueryData(['getModuleQuery', { moduleId: Number(parentId) }], (old: Module) => {
                        return { ...old, resources: [...old.resources, data] }
                    })
                    break;
                case "assignment":
                    queryClient.setQueryData(['getAssignmentQuery', { assignmentId: Number(parentId) }], (old: Assignment) => {
                        return { ...old, resources: [...old.resources, data] }
                    })
                    break;
                case "course":
                    queryClient.setQueryData(['getCourseQuery', { courseId: Number(courseId) }], (old: FullCourse) => {
                        return { ...old, resources: [...old.resources, data] }
                    })
                    break;
                case "exam":
                    queryClient.setQueryData(['getExamQuery', { examId: Number(parentId) }], (old: ExamDataView) => {
                        return { ...old, resources: [...old.resources, data] }
                    })
                    break;
                default:
                    break;
            }
            
            removeParam('resourceCreation')

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
            type: resourceType.toString(),
            parentType: type,
            parentId,
            courseId
        };

        addResourceMutation.mutate(data);
    }

    const changeTabs = (type: ResourceType) => {
        setResourceType(type);
        setLinkText("");
        setError('');
    }

    return (
        <div>
            {
                type == 'course'
                    ?
                    <div
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target={"#addResourceModal" + type + parentId}
                        role="button"
                    >
                        Recurso
                    </div>
                    :
                    <button type="button" ref={openModalRef} className="btn btn-primary" data-bs-toggle="modal" data-bs-target={"#addResourceModal" + type + parentId}>
                        <i className="bi bi-plus-circle me-1" /> Agregar recursos
                    </button>
            }
            {typeof document !== 'undefined' && createPortal(<div ref={modalRef} className="modal fade" id={"addResourceModal" + type + parentId} tabIndex={-1} aria-labelledby={"addResourceModal" + type + parentId + "Label"} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={"addResourceModal" + type + parentId + "Label"}>Agregar recurso</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <form id={"addResourceForm" + type + parentId} onSubmit={handleFormSubmit}>
                                <div className="mb-3">
                                    <ul className="nav nav-pills nav-fill">
                                        <li className="nav-item">
                                            <button
                                                className={"nav-link " + (resourceType == ResourceType.Link && "active")}
                                                type="button"
                                                onClick={() => changeTabs(ResourceType.Link)}
                                            >
                                                Enlace
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={"nav-link " + (resourceType == ResourceType.Image && "active")}
                                                type="button"
                                                onClick={() => changeTabs(ResourceType.Image)}
                                            >
                                                Imagen
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={"nav-link " + (resourceType == ResourceType.Document && "active")}
                                                type="button"
                                                onClick={() => changeTabs(ResourceType.Document)}
                                            >
                                                Documento
                                            </button>
                                        </li>
                                    </ul>
                                </div>
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
                                                                id="linkText"
                                                                placeholder="Nombre del recurso"
                                                            />
                                                            <label htmlFor="linkText">Nombre del recurso (opcional)</label>
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                value={url}
                                                                onChange={e => setUrl(e.target.value)}
                                                                className="form-control"
                                                                id="url"
                                                                placeholder="https://"
                                                            />
                                                            <label htmlFor="url">URL</label>
                                                        </div>
                                                    </div>
                                                )
                                            default:
                                                return (
                                                    <>
                                                        <div className="mb-3">
                                                            <label htmlFor="file" className="form-label">Elegir archivo</label>
                                                            <input className="form-control" type="file" id="file" />
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                value={linkText}
                                                                onChange={e => setLinkText(e.target.value)}
                                                                className="form-control"
                                                                id="linkText"
                                                                placeholder="Nombre del recurso"
                                                            />
                                                            <label htmlFor="linkText">Nombre del recurso (opcional)</label>
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
                                form={"addResourceForm" + type + parentId}
                                className="btn btn-primary"
                                loading={addResourceMutation.isPending}
                            >
                                Subir recurso
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>, document.body)}

        </div>
    )
}