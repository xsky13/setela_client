import { createPortal } from "react-dom";
import type { AssignmentSubmission, AssignmentSubmissionFull } from "~/types/assignment";
import LoadingSegment from "../Loading/LoadingSegment";
import { useQuery } from "@tanstack/react-query";
import api from "~/api";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { formatDate } from "~/utils/date";
import { AssignmentContext } from "~/context/AssignmentContext";
import { closeModal } from "~/utils/modal";
import { toast } from "sonner";
import '../styles/GradeStyles.css'

export default function GradeModal({
    assignmentSubmissionId
}: {
    assignmentSubmissionId: number
}) {
    const modalRef = useRef<HTMLDivElement>(null);
    const openModalRef = useRef<HTMLButtonElement>(null);
    const assignment = useContext(AssignmentContext);

    const { data: assignmentSubmission, refetch, isLoading, isError, error } = useQuery<AssignmentSubmissionFull>({
        queryKey: ['getAssignmentSubmissionQuery', { assignmentId: assignmentSubmissionId }],
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

    console.log(assignmentSubmissionId);


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
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {
                            isLoading ?
                                <LoadingSegment />
                                :
                                <>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id={"gradeSubmissionModalLabel" + assignmentSubmissionId}>Corregir entrega</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="bg-body-tertiary border rounded-2 px-3 py-3">
                                            <h4> {assignmentSubmission?.sysUser.name}</h4>
                                            <div className="hstack gap-5 text-muted">
                                                <div>
                                                    <div className="hstack">
                                                        <i className="bi bi-calendar3 me-1" />
                                                        <span>Entregado: {formatDate(assignmentSubmission?.creationDate)}</span>
                                                    </div>
                                                    <div>{
                                                        isLate ?
                                                            <span className="badge rounded-pill text-bg-danger">Entregado tarde</span>

                                                            :
                                                            <span className="badge rounded-pill text-bg-success">A tiempo</span>
                                                    }</div>
                                                </div>
                                                <div>
                                                    <div className="hstack">
                                                        <i className="bi bi-clock me-1" />
                                                        <span>Actualizado: {formatDate(assignmentSubmission?.lastUpdateDate)}</span>
                                                    </div>
                                                    <div>{
                                                        updateIsLate ?
                                                            <span className="badge rounded-pill text-bg-danger">Actualizado tarde</span>

                                                            :
                                                            <span className="badge rounded-pill text-bg-success">A tiempo</span>
                                                    }</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <div className="row gap-2">
                                                <div className="col">
                                                    <div className="bg-body-tertiary border rounded-2 p-3">
                                                        <h5>Documentos:</h5>
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
                                                </div>
                                                <div className="col">
                                                    <div className="subtitle">Texto del alumno</div>
                                                    <p>{assignmentSubmission?.textContent}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>, document.body)}
        </>
    );
}