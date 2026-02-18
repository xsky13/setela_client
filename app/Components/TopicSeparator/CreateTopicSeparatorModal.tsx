import { createPortal } from "react-dom";
import LoadingButton from "../LoadingButton";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type TopicSeparator, type FullCourse } from "~/types/course";
import api from "~/api";
import { toast } from "sonner";
import { closeModal } from "~/utils/modal";

export default function CreateTopicSeparatorModal({ courseId }: { courseId: number }) {
    const [title, setTitle] = useState("");
    const queryClient = useQueryClient();
    const modalRef = useRef<HTMLDivElement | null>(null);

    const createTopicSeparatorMutation = useMutation<TopicSeparator, Error, { title: string, courseId: number }>({
        mutationFn: async data => (await api.post("/topicSeparator", data)).data,
        onError: error => toast(error.message),
        onSuccess: data => {
            queryClient.setQueryData(['getCourseQuery', { courseId: courseId }], (old: FullCourse) => {
                return { ...old, topicSeparators: [...old.topicSeparators, data] }
            });

            closeModal(modalRef);
            toast("Separador agregado");
        }
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTopicSeparatorMutation.mutate({ title, courseId });
    }
    return (
        <div>
            <button
                type="button"
                className="dropdown-item"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#createTopicSeparatorModal"
            >
                Separador
            </button>
            {typeof document !== 'undefined' && createPortal(<div className="modal fade" ref={modalRef} id="createTopicSeparatorModal" tabIndex={-1} aria-labelledby="createTopicSeparatorModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="createTopicSeparatorModaLabel">Agregar separador</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <form id={"addResourceForm"} onSubmit={handleFormSubmit}>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="form-control"
                                        id="title"
                                        placeholder="titulo..."
                                    />
                                    <label htmlFor="title">Titulo</label>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                            <LoadingButton
                                type="submit"
                                form={"addResourceForm"}
                                className="btn btn-primary"
                            >
                                Subir
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>, document.body)}

        </div>
    );
}