import type { Exam, ExamDataView, ExamSubmission } from "~/types/exam";
import { formatDate, getMinutesDifference } from "~/utils/date";
import '../../styles/ExamStyles.css';
import '../../styles/AssignmentUpload.css';
import ExamSubmissionModal from "./ExamSubmissionModal";
import ExamStatusBar from "./ExamStatusBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "~/context/AuthContext";
import { getErrors } from "~/utils/error";
import { toast } from "sonner";
import { closeModal } from "~/utils/modal";

export default function ExamStudentView({ exam }: { exam: ExamDataView }) {
    const user = useContext(AuthContext);

    const queryClient = useQueryClient();

    // variables for child state
    const [files, setFiles] = useState<File[]>([]);
    const [textContent, setTextContent] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    const openModalBtn = useRef<HTMLButtonElement>(null);

    const userSubmission = exam.examSubmissions.find(e => e.sysUserId === user?.id);

    const { data: examSubmission } = useQuery<any, Error, ExamSubmission>({
        queryKey: ['getExamSubmissionForExam', { examId: exam.id }],
        queryFn: async () => {
            const response = await api.get("/examSubmission/" + userSubmission?.id);
            return response.data;
        },
        enabled: !!userSubmission?.id,
        retry: 1
    });

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
        }
    });

    const finishExam = () => {
        finishExamSubmissionMutation.mutate({ textContent });
    }

    const openModal = () => {
        openModalBtn.current?.click();
    }


    return (
        <div>
            <h1 style={{ margin: 0 }}>{exam.title}</h1>
            <div className={`badge rounded-pill ${exam.closed ? "text-bg-danger" : "text-bg-success"}`} style={{ marginBottom: '0.5rem' }}>
                {exam.closed ?
                    <>
                        <i className="bi bi-lock-fill" />
                        <span className="ms-1">Cerrado</span>
                    </> : <>
                        <i className="bi bi-unlock-fill" />
                        <span className="ms-1">Abierto</span>
                    </>}
            </div>
            <div className="container">
                <div className="row gap-3">
                    <div
                        className="position-relative col d-flex flex-column justify-content-center align-items-center rounded-2 px-3 py-1 flex-grow-1 upload-section bg-body-tertiary"
                        style={{ minHeight: '15rem' }}
                    >
                        <ExamSubmissionModal
                            exam={exam}
                            examSubmission={examSubmission || null}
                            openModalBtn={openModalBtn}
                            textContent={textContent}
                            setTextContent={setTextContent}
                            files={files}
                            setFiles={setFiles}
                            modalRef={modalRef}
                            finishExam={finishExam}
                            examLoading={finishExamSubmissionMutation.isPending}
                        />
                        <div className="text-muted small mt-2">Solo podras hacer 1 intento.</div>
                    </div>
                    <div className="col-7">
                        <ExamStatusBar
                            exam={exam}
                            finishExam={finishExam}
                        />
                        <h4>Mi entrega</h4>
                        {
                            examSubmission ?
                                <div className="px-3 py-2 rounded-2 border border-2 border-primary ">
                                    {
                                        examSubmission.finished ?
                                            <div className="hstack gap-2">
                                                <div className="badge rounded-pill text-bg-primary">
                                                    <i className="bi bi-check-circle-fill me-2"></i><span>Entregada</span>
                                                </div>
                                                {
                                                    getMinutesDifference(exam.startTime, examSubmission.turnInTime) > getMinutesDifference(exam.startTime, exam.endTime) ?
                                                        <div className="badge rounded-pill text-bg-danger">
                                                            <i className="bi bi-exclamation-triangle-fill me-2"></i><span>Tarde</span>
                                                        </div>
                                                        :
                                                        <div className="badge rounded-pill text-bg-success">
                                                            <i className="bi bi-check-circle-fill me-2"></i><span>A tiempo</span>
                                                        </div>
                                                }

                                                {
                                                    examSubmission.grade ?
                                                        <div className="badge rounded-pill text-bg-secondary">
                                                            <i className="bi bi-check-circle-fill me-2"></i><span>Calificada</span>
                                                        </div>
                                                        :
                                                        <div className="badge rounded-pill text-bg-secondary">
                                                            <i className="bi bi-hourglass me-2"></i><span>Aguardando calificacion</span>
                                                        </div>
                                                }
                                            </div>
                                            :
                                            <div className="badge rounded-pill text-bg-primary">
                                                <i className="bi bi-info-circle me-2"></i><span>En proceso</span>
                                            </div>
                                    }
                                    <div className="mt-3">
                                        <div className="d-flex align-items-center justify-content-between my-2">
                                            <div className="subtitle">Documentos adjuntos</div>
                                            <span className="badge text-bg-secondary fs-6">{examSubmission.finished ? examSubmission?.resources?.length : files.length}</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex align-items-center justify-content-between my-2">
                                            <div className="subtitle">Revision</div>
                                            {
                                                examSubmission.finished ?
                                                    <button className="btn btn-outline-primary" onClick={openModal}>
                                                        <i className="bi bi-arrow-return-right me-2"></i>
                                                        Ver
                                                    </button>
                                                    :
                                                    <button className="btn btn-outline-primary" onClick={openModal}>
                                                        <i className="bi bi-arrow-return-right me-2"></i>
                                                        Continuar
                                                    </button>
                                            }
                                        </div>
                                        <hr />
                                        <div className={`my-2 ${examSubmission.grade ? 'd-flex align-items-center justify-content-between' : ''}`}>
                                            <div className="subtitle">Calificacion:</div>
                                            {
                                                examSubmission.grade ?
                                                    <span className="fs-6 text-primary-emphasis"></span>
                                                    :
                                                    <span className="small">Todavía no hay calificación</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="text-muted">
                                    <i className="bi bi-info-circle me-2"></i><span>Todavia no ha creado una entrega.</span>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}