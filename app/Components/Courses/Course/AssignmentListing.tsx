import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import LoadingButton from "~/Components/LoadingButton";
import type { Assignment } from "~/types/assignment";
import type { FullCourse } from "~/types/course";
import { formatDate } from "~/utils/date";
import { getErrors } from "~/utils/error";

export default function AssignmentListing({
    assignment,
    currentUserIsOwner
}: {
    assignment: Assignment,
    currentUserIsOwner: boolean
}) {
    const queryClient = useQueryClient();

    const changeVisibilityMutation = useMutation<Assignment, Error, { visible: boolean }>({
        mutationKey: ['edit_assignment_visibility_command'],
        mutationFn: async data => {
            const response = await api.put('/assignment/' + assignment.id, data);
            return response.data;
        },
        onSuccess() {
            queryClient.setQueryData(['getCourseQuery', { courseId: Number(assignment.courseId) }], (old: FullCourse) => {
                return {
                    ...old,
                    assignments: old.assignments.map((a: Assignment) => a.id == assignment.id ? {
                        ...a, visible: !assignment.visible
                    } : a)
                }
            });
            queryClient.setQueryData(['getAssignmentQuery', { assignmentId: Number(assignment.id) }], (old: Assignment) => ({ ...old, visible: !assignment.visible }))
        },
        onError(error) {
            const errors = getErrors(error);
            console.log(errors);
            toast(error.message);
        }
    });
    const deleteAssignmentMutation = useMutation<any, Error>({
        mutationKey: ['delete_assignment_from_course_command'],
        mutationFn: async () => {
            const response = await api.delete("/assignment/" + assignment.id);
            return response.data;
        },
        async onSuccess() {
            queryClient.setQueryData(['getCourseQuery', { courseId: Number(assignment.courseId) }], (old: FullCourse) => {
                return { ...old, assignments: old.assignments.filter(m => m.id != assignment.id) }
            });
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);
            toast(error.message);
        },
        retry: 1
    });

    const changeVisibility = () => {
        changeVisibilityMutation.mutate({ visible: !assignment.visible })
    }

    const deleteAssignment = () => {
        if (confirm("Esta seguro que quiere eliminar este trabajo práctico? Esta acción es irreversible")) {
            deleteAssignmentMutation.mutate();
        }
    }
    return (
        <div className="d-flex justify-content-between rounded-2 border  p-4 my-3">
            <div>
                <div className="bg-white border-0 mb-2">
                    <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-success-emphasis bg-success-subtle text-uppercase small">
                        <i className="bi bi-card-checklist me-2"></i>
                        Trabajo practico
                    </span>
                </div>
                <NavLink to={`./a/${assignment.id}`} className="h5 card-title text-decoration-none">{assignment.title}</NavLink>
                <div className="d-flex mt-2 small text-muted">
                    <p>
                        <i className='bi bi-calendar-week'></i> Vence el <span className="fw-semibold">{formatDate(assignment.dueDate)}</span></p>
                </div>
            </div>
            <div className={"d-flex flex-column " + (currentUserIsOwner && "justify-content-between")}>
                <button className="btn btn-light">
                    <i className='bi bi-check-circle me-2'></i>
                    Marcar finalizado
                </button>
                {
                    currentUserIsOwner &&
                    <div className="d-flex">
                        <LoadingButton onClick={changeVisibility} loading={changeVisibilityMutation.isPending} className="p-0 bg-white border-0 text-center small">
                            {
                                assignment.visible ?
                                    <><i className="bi bi-eye" /><span className="d-block">Visible</span></>
                                    :
                                    <><i className="bi bi-eye-slash" /><span className="d-block">No visible</span></>

                            }
                        </LoadingButton>
                        <LoadingButton onClick={deleteAssignment} loading={deleteAssignmentMutation.isPending} className="p-0 bg-white border-0 text-danger text-center small mx-4">
                            <i className="bi bi-trash-fill" />
                            <span className="d-block">Eliminar</span>
                        </LoadingButton>
                        <NavLink to={`./a/${assignment.id}/editar`} className="text-center small text-decoration-none" role="button">
                            <i className="bi bi-pencil" />
                            <span className="d-block">Editar</span>
                        </NavLink>
                    </div>
                }
            </div>
        </div>
    );
}