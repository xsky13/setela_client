import { createPortal } from "react-dom";
import type { ExamSubmissionSimple, ExamSubmission } from "~/types/exam";
import LoadingSegment from "../Loading/LoadingSegment";
import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import { useContext, useEffect, useRef, useState } from "react";
import { formatDate } from "~/utils/date";
import { closeModal } from "~/utils/modal";
import { toast } from "sonner";
import '../styles/GradeStyles.css'
import GradeExamForm from "./GradeExamForm";
import { ExamContext } from "~/context/ExamContext";

export default function GradeExamModal({
    examSubmissionId
}: {
    examSubmissionId: number
}) {
    const modalRef = useRef<HTMLDivElement>(null);
    const openModalRef = useRef<HTMLButtonElement>(null);
    const exam = useContext(ExamContext);

    if (!exam) throw new Error("Hubo un error");

    const { data: examSubmission, refetch, isLoading, isError, error } = useQuery<ExamSubmission>({
        queryKey: ['getexamSubmissionQuery', { examSubmissionId: examSubmissionId }],
        queryFn: async () => {
            const response = await api.get('examSubmission/' + examSubmissionId);
            return response.data;
        },
        retry: 1,
        enabled: false
    });

    let isLate = false;
    if (examSubmission && exam) {
        const submissionDate = new Date(examSubmission.turnInTime).getTime();
        const dueDate = new Date(exam.endTime).getTime();
        isLate = submissionDate > dueDate;
    }

    useEffect(() => {
        if (isError) {
            closeModal(modalRef);
            toast.error("Ocurrió un error.");
        }
    }, [isError]);

    useEffect(() => {
        
        console.log(examSubmission);
    }, [examSubmission])


    const openModal = () => {
        openModalRef.current?.click();
        refetch();
    }

    return (
        <>
            <div className="block small" role="button" onClick={openModal}>
                <i className="bi bi-pencil" />
                <span className="ms-2">Corregir</span>
            </div>
            <button
                type="button"
                ref={openModalRef}
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target={"#gradeSubmissionModal" + examSubmissionId}
                style={{ display: 'none' }}
            >
            </button>
            {typeof document !== 'undefined' && createPortal(<div ref={modalRef} className="modal fade" id={"gradeSubmissionModal" + examSubmissionId} tabIndex={-1} aria-labelledby={"gradeSubmissionModalLabel" + examSubmissionId} aria-hidden="true">
                <div className="modal-dialog modal-xl" style={{ maxHeight: '50vh' }}>
                    <div className="modal-content">
                        {
                            isLoading ?
                                <LoadingSegment />
                                :
                                <>
                                    <div className="modal-header py-4 text-bg-primary border-bottom border-3 border-secondary">
                                        <h1 className="modal-title fs-5" id={"gradeSubmissionModalLabel" + examSubmissionId}>Corregir entrega</h1>
                                        <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* header */}
                                        <div className="bg-body-tertiary border rounded-2 px-3 py-3">
                                            <h4> {examSubmission?.sysUser.name}</h4>
                                            <div className="hstack gap-5 text-muted">
                                                <div>
                                                    <div className="hstack">
                                                        <i className="bi bi-calendar3 me-2" />
                                                        <span className="subtitle date-labels ">Hora de comienzo</span>
                                                    </div>
                                                    <div className="date">{formatDate(examSubmission?.startTime)}</div>
                                                    
                                                </div>
                                                <div>
                                                    <div className="hstack">
                                                        <i className="bi bi-clock me-2" />
                                                        <span className="subtitle date-labels">Hora de entrega</span>
                                                    </div>
                                                    <div className="date">{formatDate(examSubmission?.turnInTime)}</div>
                                                    <div>{
                                                        isLate ?
                                                            <span className="badge pill text-danger-emphasis bg-danger-subtle">Entregado tarde</span>

                                                            :
                                                            <span className="badge rounded-pill text-bg-success">A tiempo</span>
                                                    }</div>
                                                </div>
                                            </div>
                                        </div>



                                        <div className="container mt-4">
                                            <div className="row gap-3">
                                                <div className="col border rounded-2 p-3">
                                                    <div className="d-flex gap-2 text-primary-emphasis">
                                                        <i className="bi bi-paperclip"></i>
                                                        <h5>Archivos adjuntos</h5>
                                                    </div>
                                                    {
                                                        examSubmission?.resources.length != 0 ?
                                                            <div className="vstack gap-2">
                                                                {
                                                                    examSubmission?.resources.map((resource, i) => (
                                                                        <div key={i} className="bg-white p-2 rounded-2 border list-group-item d-flex justify-content-between align-items-center">
                                                                            <div>
                                                                                <div className="text-primary-emphasis bg-primary-subtle p-2 rounded-2 d-inline me-2">
                                                                                    <i className="bi bi-file-earmark" />
                                                                                </div>
                                                                                <span className="fw-semibold">{resource.url}</span>
                                                                            </div>
                                                                            <button className="btn btn-secondary">
                                                                                <i className="bi bi-download me-1"></i>
                                                                                Descargar
                                                                            </button>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                            :
                                                            <i className="text-muted">
                                                                <i className="bi bi-info-circle me-2"></i>
                                                                No hay documentos en esta entrega.
                                                            </i>
                                                    }
                                                </div>

                                                <div className="col">
                                                    <div className="d-flex gap-2 text-primary-emphasis">
                                                        <i className="bi bi-chat-left-text"></i>
                                                        <h5>Comentarios del estudiante</h5>
                                                    </div>
                                                    <div className="submission-text">
                                                        <p>{examSubmission?.textContent}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <GradeExamForm
                                        examId={exam.id}
                                        maxGrade={exam.maxGrade}
                                        examSubmissionId={examSubmissionId}
                                        grade={examSubmission?.grade}
                                    />
                                </>
                        }
                    </div>
                </div>
            </div>, document.body)}
        </>
    );
}