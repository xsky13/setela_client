import { useContext, useRef } from "react";
import { createPortal } from "react-dom";
import type { Assignment, AssignmentSubmission } from "~/types/assignment";
import LoadingButton from "../LoadingButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AssignmentUpload from "../Assignments/AssignmentUpload";
import { AssignmentContext } from "~/context/AssignmentContext";
import api from "~/api";
import LoadingSegment from "../Loading/LoadingSegment";
import { toast } from "sonner";

export default function EditAssignmentSubmission({ assignmentSubmissionId }: { assignmentSubmissionId: number }) {
    const modalRef = useRef<HTMLDivElement>(null);
    const openModalRef = useRef<HTMLButtonElement>(null);
    const assignmentData = useContext(AssignmentContext);
    if (!assignmentData) throw new Error("Hubo un error.");

    const getAssignmentSubmission = useQuery<AssignmentSubmission>({
        queryKey: ['getAssignmentSubmissionQuery', { assignmentId: assignmentSubmissionId }],
        queryFn: async () => {
            const response = await api.get('AssignmentSubmission/' + assignmentSubmissionId);
            return response.data;
        },
        retry: 1,
        enabled: false
    });

    if (getAssignmentSubmission.isError) {
        toast("Hubo un error. Por favor intente de nuevo o contáctese con el administrador.");
        return;
    }

    const openModal = () => {
        openModalRef.current?.click();
        getAssignmentSubmission.refetch();
    }

    return (
        <div>
            <button
                className="btn btn-primary"
                onClick={openModal}
            >
                <i className="bi bi-pencil me-1" /> Editar entrega
            </button>
            <button
                type="button"
                ref={openModalRef}
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#editAssignmentSubmissionModal"
                style={{ display: 'none' }}
            >
            </button>
            {typeof document !== 'undefined' && createPortal(<div ref={modalRef} className="modal fade" id="editAssignmentSubmissionModal" tabIndex={-1} aria-labelledby="editAssignmentSubmissionModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        {
                            getAssignmentSubmission.isLoading ?
                                <LoadingSegment />
                                :
                                <>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="editAssignmentSubmissionModalLabel">Editar entrega</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                    </div>
                                    <div className="subtitle">Mis archivos</div>
                                    <AssignmentUpload
                                        action="edit"
                                        assignmentData={assignmentData}
                                        assignmentSubmission={getAssignmentSubmission.data}
                                        modalRef={modalRef}
                                    />
                                </>
                        }
                    </div>
                </div>
            </div>, document.body)}
        </div>
    );
}