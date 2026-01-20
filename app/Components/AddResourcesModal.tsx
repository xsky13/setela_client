"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import api from "~/api";
import { ResourceType } from "~/types/resourceTypes";
import LoadingButton from "./LoadingButton";
import { toast } from "sonner";

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

    const addResourceMutation = useMutation<any, Error, {
        url: string, linkText: string, type: string, parentType: string, parentId: number, courseId: number
    }>({
        mutationKey: ['add_resource_command'],
        mutationFn: async data => {
            const response = await api.post('/resource', data);
            return response.data;
        },
        async onSuccess() {
            if (modalRef.current) {
                const closeButton = modalRef.current.querySelector('[data-bs-dismiss="modal"]') as HTMLButtonElement;
                if (closeButton) {
                    closeButton.click();
                }
                const formElement = modalRef.current.querySelector('form');
                formElement?.reset();
            }
            await queryClient.invalidateQueries({ queryKey: ['getModuleQuery'] });
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
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i className="bi bi-plus-circle me-1" /> Agregar recursos
            </button>

            <div ref={modalRef} className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar recurso</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <form id="resourceForm" onSubmit={handleFormSubmit}>
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
                                form="resourceForm"
                                className="btn btn-primary"
                            >
                                Subir recurso
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}