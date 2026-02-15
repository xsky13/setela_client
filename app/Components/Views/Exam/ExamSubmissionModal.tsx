import { useContext, useEffect, useRef, useState, type ChangeEvent, type Ref } from "react";
import LoadingButton from "~/Components/LoadingButton";
import type { Exam, ExamDataView, ExamSubmission } from "~/types/exam";
import ExamStatusBar from "./ExamStatusBar";
import ResourceListing from "~/Components/Courses/Course/ResourceListing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "~/context/AuthContext";
import api from "~/api";
import { getErrors } from "~/utils/error";
import { toast } from "sonner";
import { closeModal } from "~/utils/modal";

export default function ExamSubmissionModal({ exam, examSubmission, openModalBtn }: { exam: ExamDataView, examSubmission: ExamSubmission | null | undefined, openModalBtn: React.RefObject<HTMLButtonElement | null> }) {
    const user = useContext(AuthContext);

    const [error, setError] = useState('');
    const fileInput = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [textContent, setTextContent] = useState('');
    const queryClient = useQueryClient();

    const userSubmitted = exam.examSubmissions.some(e => e.sysUserId == user?.id);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (examSubmission?.textContent) setTextContent(examSubmission.textContent);
    }, [examSubmission]);

    const finishExamSubmissionMutation = useMutation<ExamSubmission, Error, { textContent: string }>({
        mutationKey: ['finish_exam_command'],
        mutationFn: async data => {
            const response = await api.post("/examSubmission/" + examSubmission!.id + "/finish", data);
            return response.data;
        },
        onError(error) {
            const errors = getErrors(error);
            toast(error.message);
            console.log(errors);
        },
        onSuccess(data) {
            queryClient.setQueryData(['getExamSubmissionForExam', { examId: exam.id }], data);
            queryClient.setQueryData(['getExamQuery', { examId: exam.id }], (old: Exam) => {
                return {
                    ...old, examSubmissions: old.examSubmissions.map(e => e.id == examSubmission!.id ? data : e)
                }
            });

            closeModal(modalRef);
            toast("Su entrega fue enviada exitosamente.");
        }
    });

    const createExamSubmissionMutation = useMutation<ExamSubmission, Error, { examId: number }>({
        mutationKey: ['create_exam_submission_command'],
        mutationFn: async data => {
            const response = await api.post("/examSubmission", data);
            console.log(response);

            return response.data;
        },
        onError(error) {
            const errors = getErrors(error);
            toast(error.message);
            console.log(errors);
        },
        onSuccess(data) {
            queryClient.setQueryData(['getExamSubmissionForExam', { examId: exam.id }], data);

            queryClient.setQueryData(['getExamQuery', { examId: exam.id }], (old: Exam) => {
                if (!old) return old;
                return {  ...old, examSubmissions: [...old.examSubmissions, data] }
            });
        }
    })

    const handleClick = () => {
        fileInput.current?.click();
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const finishExam = (e: React.FormEvent) => {
        e.preventDefault();

        if (confirm("Guardar cambios y mandar entrega?")) {
            finishExamSubmissionMutation.mutate({ textContent });
        }
    }

    const openModal = async () => {
        if (examSubmission) {
            openModalBtn?.current?.click();
        } else {
            await createExamSubmissionMutation.mutateAsync({ examId: exam.id });

            setTimeout(() => {
                openModalBtn.current?.click();
            }, 0);
        }
    }


    return (
        <div>

            {
                examSubmission?.finished ?
                    <button
                        className="btn btn-primary btn-lg text-uppercase tracking-wide"
                        style={{ fontSize: '1rem' }}
                        disabled
                    >
                        <i className="bi bi-play-circle-fill me-2"></i>
                        {userSubmitted ? 'Abrir' : 'Comenzar'} examen
                    </button>
                    :
                    <LoadingButton
                        type="button"
                        className="btn btn-primary btn-lg text-uppercase tracking-wide"
                        loading={createExamSubmissionMutation.isPending}
                        onClick={openModal}
                        style={{ fontSize: '1rem' }}
                    >
                        <i className="bi bi-play-circle-fill me-2"></i>
                        {userSubmitted ? 'Abrir' : 'Comenzar'} examen
                    </LoadingButton>
            }

            <button
                ref={openModalBtn}
                data-bs-toggle="modal"
                data-bs-target="#submitExamModal"
                type="button"
                style={{ display: 'none' }}
            ></button>

            <div ref={modalRef} className="modal fade" id="submitExamModal" tabIndex={-1} aria-labelledby="submitExamModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header text-bg-primary border-bottom border-3 border-secondary">
                            <h1 className="modal-title fs-5" id="submitExamModalLabel">{exam.title}</h1>
                            <button type="button" className="btn-close" id="closeSubmitExamModal" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <div className="">
                                <ExamStatusBar
                                    exam={exam}
                                />
                                <div className="col px-3 py-2 rounded-1 bg-body-tertiary border">
                                    <p>
                                        {exam.description}
                                    </p>
                                    {
                                        (exam.resources != null && exam.resources.length) != 0 &&
                                        <div className="mt-4">
                                            <div className="subtitle">Recursos y materiales</div>
                                            {
                                                exam.resources.map((resource, i) => (
                                                    <ResourceListing key={i} resource={resource} currentUserIsOwner={exam.currentUserIsOwner} />
                                                ))
                                            }
                                        </div>
                                    }
                                </div>


                                <div className="my-5 rounded-2 px-2 py-4 border border-2 border-primary row" style={{ margin: '0 .01rem 0 .01rem' }}>
                                    <h4>Subir entrega</h4>
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
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                            <LoadingButton
                                type="submit"
                                form="submitExamForm"
                                className="btn btn-primary"
                                loading={finishExamSubmissionMutation.isPending}
                                onClick={finishExam}
                            >
                                Subir entrega
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}