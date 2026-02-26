import { createPortal } from "react-dom";
import type { formatDate } from "~/utils/date";
import LoadingSegment from "../Loading/LoadingSegment";
import LoadingButton from "../LoadingButton";
import { useContext, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import type { FullUser, UserSimple } from "~/types/user";
import { toast } from "sonner";
import type { CourseDataView, CourseSimple, FullCourse } from "~/types/course";
import { getErrors } from "~/utils/error";
import { AuthContext } from "~/context/AuthContext";
import ProfessorUserListing from "./ProfessorUserListing";

export default function AddProfessorModal({ course }: { course: CourseDataView }) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const queryClient = useQueryClient();

    const { data: users, isError, error, isLoading } = useQuery<UserSimple[]>({
        queryKey: ['get_professors_query'],
        queryFn: async () => (await api.get("/user/professors")).data,
        retry: 1
    });


    return (
        <>
            <button
                data-bs-toggle="modal"
                data-bs-target={"#gradeSubmissionModal"}
                className="btn btn-light w-100"
                role="button"
            >
                Manejar profesores
            </button>
            {typeof document !== 'undefined' && createPortal(<div ref={modalRef} className="modal fade" id={"gradeSubmissionModal"} tabIndex={-1} aria-labelledby={"gradeSubmissionModalLabel"} aria-hidden="true">
                <div className="modal-dialog modal-xl" style={{ maxHeight: '50vh' }}>
                    <div className="modal-content">
                        {
                            isLoading ?
                                <LoadingSegment />
                                :
                                <>
                                    <div className="modal-header py-4 text-bg-primary border-bottom border-3 border-secondary">
                                        <h1 className="modal-title fs-5" id={"gradeSubmissionModalLabel"}>Seleccionar profesor</h1>
                                        <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                    </div>
                                    <div className="modal-body">
                                        {
                                            users?.map((user, i) => (
                                                <ProfessorUserListing
                                                    user={user}
                                                    usersLength={users.length}
                                                    i={i}
                                                    course={course}
                                                />
                                            ))
                                        }
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>, document.body)}
        </>
    )
}