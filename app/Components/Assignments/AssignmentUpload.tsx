import { useContext, useRef, useState, type ChangeEvent, type RefObject } from "react";
import { type AssignmentSubmission, type Assignment } from "~/types/assignment";
import '../styles/AssignmentUpload.css'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import { toast } from "sonner";
import LoadingButton from "../LoadingButton";
import { AuthContext } from "~/context/AuthContext";
import { closeModal } from "~/utils/modal";

export default function AssignmentUpload({
    assignmentData,
    action,
    assignmentSubmission,
    modalRef
}: {
    assignmentData: Assignment,
    action: "create" | "edit",
    assignmentSubmission?: AssignmentSubmission,
    modalRef?: RefObject<HTMLDivElement | null>
}) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [textContent, setTextContent] = useState(assignmentSubmission ? assignmentSubmission.textContent : '');
    const currentUser = useContext(AuthContext);
    const queryClient = useQueryClient();

    let canEnter = true;

    if (action == "create") canEnter = !assignmentData.assignmentSubmissions.some(a => a.sysUserId == currentUser?.id);

    const handleClick = () => {
        fileInput.current?.click();
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const createAssignmentSubmission = useMutation<AssignmentSubmission, Error, { assignmentId: number, textContent: string }>({
        mutationKey: ['create_assignment_submission_command'],
        mutationFn: async data => {
            let response;

            if (action == "create") response = await api.post('/AssignmentSubmission', data);
            else response = await api.put('/AssignmentSubmission/' + assignmentSubmission?.id, data);

            return response.data;
        },
        onSuccess: data => {
            toast("Su entrega ha sido " + (action == "create" ? "subida." : "modificada."))
            if (assignmentSubmission) {
                queryClient.setQueryData(['getAssignmentQuery', { assignmentId: assignmentData.id }], (old: Assignment) => {
                    return { ...old, assignmentSubmissions: [...old.assignmentSubmissions.filter(a => a.id != assignmentSubmission.id), data] }
                });
            } else {
                queryClient.setQueryData(['getAssignmentQuery', { assignmentId: assignmentData.id }], (old: Assignment) => {
                    return { ...old, assignmentSubmissions: [...old.assignmentSubmissions, data] }
                });
            }
            if (modalRef) closeModal(modalRef);

        },
        onError: (error) => {
            console.log(error);

            toast(error.message);
        }
    });

    const handleAssignmentCreation = () => {
        if (!files.length && textContent == '') {
            toast("No puede hacer una entrega vacía.");
            return;
        }

        createAssignmentSubmission.mutate({ assignmentId: assignmentData.id, textContent });
    }




    return (
        (!assignmentData.closed && canEnter) &&
        <>
            <div className={"mb-4 " + (action == "edit" ? "modal-body" : "")}>
                <div className="rounded-2 px-2 py-3 border border-2 border-primary row" style={{ margin: '0 .01rem 0 .01rem' }}>
                    {action == "create" && <h4>Subir entrega</h4>}
                    <div className="col-5 d-flex flex-column" style={{ minHeight: '17rem' }}>
                        <div className="d-flex flex-column justify-content-center align-items-center rounded-2 px-3 py-1 border flex-grow-1 bg-white upload-section bg-body-tertiary" style={{ minHeight: '5rem' }}>
                            <div className="h5">Arrastra tus archivos aqui</div>
                            <div className="text-muted small mb-2">O haz clic al boton para seleccionar</div>
                            <button onClick={handleClick} className="btn btn-primary">
                                <i className="bi bi-file-earmark me-2" />
                                Elegir archivo(s)
                            </button>
                            <input
                                type="file"
                                ref={fileInput}
                                onChange={handleChange}
                                style={{ display: 'none' }}
                                multiple
                            />
                        </div>
                        {
                            (files && files.length != 0) &&
                            <div className="mt-2 w-full">
                                <span className="subtitle">Archivos seleccionados</span>
                                {Array.from(files).map((file, i) => (
                                    <div className="small" key={i}>
                                        <i onClick={() => setFiles(prev => prev.filter((_, index) => index !== i))} className="bi bi-trash-fill text-danger me-2" role="button" />
                                        <span>{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <div className="col-7">
                        <div className="form-floating mb-3 h-100">
                            <textarea
                                id="textContent"
                                name="textContent"
                                className="form-control h-100"
                                placeholder="Lorem ipsum dolor sit amet"
                                value={textContent}
                                onChange={e => setTextContent(e.target.value)}
                            />
                            <label htmlFor="textContent">Texto adicional</label>
                        </div>
                    </div>
                    {
                        action == "create" &&
                        <>
                            <div className="mt-4 mb-3 px-3">
                                <hr />
                            </div>
                            <div className=" d-flex justify-content-between align-items-center">
                                <span className="text-muted small">
                                    <i className="bi bi-clock me-2"></i>
                                    Podrás editar tu entrega hasta la fecha límite
                                </span>
                                <LoadingButton
                                    onClick={handleAssignmentCreation}
                                    loading={createAssignmentSubmission.isPending}
                                    className="btn btn-primary w-25"
                                >
                                    Subir entrega
                                </LoadingButton>
                            </div>
                        </>
                    }
                </div>
            </div>
            {
                action == "edit" &&

                <div className="modal-footer">
                    <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                    <LoadingButton
                        type="submit"
                        onClick={handleAssignmentCreation}
                        className="btn btn-primary"
                        loading={createAssignmentSubmission.isPending}
                    >
                        Subir cambios
                    </LoadingButton>
                </div>
            }
        </>
    );
}