import { createPortal } from "react-dom";
import type { AssignmentSubmission, AssignmentSubmissionFull } from "~/types/assignment";
import LoadingSegment from "../Loading/LoadingSegment";
import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import { useContext, useEffect, useRef, useState } from "react";
import { formatDate } from "~/utils/date";
import { AssignmentContext } from "~/context/AssignmentContext";
import { closeModal } from "~/utils/modal";
import { toast } from "sonner";
import '../styles/GradeStyles.css'
import GradeForm from "./GradeForm";

export default function GradeModal({
    assignmentSubmissionId
}: {
    assignmentSubmissionId: number
}) {
    const modalRef = useRef<HTMLDivElement>(null);
    const openModalRef = useRef<HTMLButtonElement>(null);
    const assignment = useContext(AssignmentContext);

    if (!assignment) throw new Error("Hubo un error");

    const { data: assignmentSubmission, refetch, isLoading, isError, error } = useQuery<AssignmentSubmissionFull>({
        queryKey: ['getAssignmentSubmissionQuery', { assignmentSubmissionId: assignmentSubmissionId }],
        queryFn: async () => {
            const response = await api.get('AssignmentSubmission/' + assignmentSubmissionId);
            return response.data;
        },
        retry: 1,
        enabled: false
    });

    let isLate = false;
    let updateIsLate = false;
    if (assignmentSubmission && assignment) {
        const submissionDate = new Date(assignmentSubmission.creationDate).getTime();
        const submissionUpdateDate = new Date(assignmentSubmission.lastUpdateDate).getTime();
        const dueDate = new Date(assignment.dueDate).getTime();
        isLate = submissionDate > dueDate;
        updateIsLate = submissionUpdateDate > dueDate;
    }

    useEffect(() => {
        if (isError) {
            closeModal(modalRef);
            toast.error("Ocurrió un error.");
        }
    }, [isError]);



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
                data-bs-target={"#gradeSubmissionModal" + assignmentSubmissionId}
                style={{ display: 'none' }}
            >
            </button>
            {typeof document !== 'undefined' && createPortal(<div ref={modalRef} className="modal fade" id={"gradeSubmissionModal" + assignmentSubmissionId} tabIndex={-1} aria-labelledby={"gradeSubmissionModalLabel" + assignmentSubmissionId} aria-hidden="true">
                <div className="modal-dialog modal-xl" style={{ maxHeight: '50vh' }}>
                    <div className="modal-content">
                        {
                            isLoading ?
                                <LoadingSegment />
                                :
                                <>
                                    <div className="modal-header py-4 text-bg-primary border-bottom border-3 border-secondary">
                                        <h1 className="modal-title fs-5" id={"gradeSubmissionModalLabel" + assignmentSubmissionId}>Corregir entrega</h1>
                                        <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* header */}
                                        <div className="bg-body-tertiary border rounded-2 px-3 py-3">
                                            <h4> {assignmentSubmission?.sysUser.name}</h4>
                                            <div className="hstack gap-5 text-muted">
                                                <div>
                                                    <div className="hstack">
                                                        <i className="bi bi-calendar3 me-2" />
                                                        <span className="subtitle date-labels ">Fecha de entrega</span>
                                                    </div>
                                                    <div className="date">{formatDate(assignmentSubmission?.creationDate)}</div>
                                                    <div>{
                                                        isLate ?
                                                            <span className="badge pill text-danger-emphasis bg-danger-subtle">Entregado tarde</span>

                                                            :
                                                            <span className="badge rounded-pill text-bg-success">A tiempo</span>
                                                    }</div>
                                                </div>
                                                <div>
                                                    <div className="hstack">
                                                        <i className="bi bi-clock me-2" />
                                                        <span className="subtitle date-labels">Ultima actualizacion</span>
                                                    </div>
                                                    <div className="date">{formatDate(assignmentSubmission?.lastUpdateDate)}</div>
                                                    <div>{
                                                        updateIsLate ?
                                                            <span className="badge pill text-danger-emphasis bg-danger-subtle">Actualizado tarde</span>

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
                                                        assignmentSubmission?.resources.length != 0 ?
                                                            <div className="vstack gap-2">
                                                                {
                                                                    assignmentSubmission?.resources.map((resource, i) => (
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
                                                        <p>{assignmentSubmission?.textContent}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <GradeForm
                                        assignmentId={assignment.id}
                                        maxGrade={assignment.maxGrade}
                                        assignmentSubmissionId={assignmentSubmissionId}
                                        grade={assignmentSubmission?.grade}
                                    />
                                </>
                        }
                    </div>
                </div>
            </div>, document.body)}
        </>
    );
}