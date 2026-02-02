import { useRef } from "react";
import { createPortal } from "react-dom";
import type { AssignmentSubmission } from "~/types/assignment";
import LoadingButton from "../LoadingButton";
import { useMutation } from "@tanstack/react-query";

export default function EditAssignmentSubmission({ assignmentSubmission }: { assignmentSubmission: AssignmentSubmission }) {
    const modalRef = useRef<HTMLDivElement>(null);
    const openModalRef = useRef<HTMLButtonElement>(null);

    const editAssignmentSubmissionMutation = useMutation<AssignmentSubmission, Error, { assignmentId: number, textContent: string }>({

    });

    const handleFormSubmit = () => {

    }
    return (
        <div>
            <button
                type="button"
                ref={openModalRef}
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#editAssignmentSubmissionModal"
            >
                <i className="bi bi-pencil me-1" /> Editar entrega
            </button>
            {typeof document !== 'undefined' && createPortal(<div ref={modalRef} className="modal fade" id="editAssignmentSubmissionModal" tabIndex={-1} aria-labelledby="editAssignmentSubmissionModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editAssignmentSubmissionModalLabel">Editar entrega</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <form id="editAssignmentSubmissionForm" onSubmit={handleFormSubmit}>

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                            <LoadingButton
                                type="submit"
                                form="editAssignmentSubmissionForm"
                                className="btn btn-primary"
                                loading={editAssignmentSubmissionMutation.isPending}
                            >
                                Subir cambios
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>, document.body)}
        </div>
    );
}