import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "~/api";
import type { Enrollment } from "~/types/user";

export default function StudentListing({ student, currentUserIsOwner, courseId }: { student: Enrollment, currentUserIsOwner: boolean, courseId: number }) {
    const queryClient = useQueryClient();
    const disenrollStudentMutation = useMutation<any, Error, { userId: number }>({
        mutationFn: async data => {
            const response = await api.post("/course/" + courseId + "/disenroll", data);
            return response.data;
        },
        async onSuccess() {
            /**
             * TODO: use state to list the enrollments so i dont have to invalidate the query
             */
            await queryClient.invalidateQueries({ queryKey: ['getCourseQuery']});
        },
        onError(error) {
            toast("Hubo un error. Por favor intente nuevamente.");
            console.log(error);
        },
    });

    const removeStudent = () => {
        if (confirm("Esta seguro que quiere eliminar este estudiante?")) {
            disenrollStudentMutation.mutate({ userId: student.sysUser.id });
        }
    }

    return (
        <div className="my-3 rounded-2 border border-2 border-primary px-3 py-2 d-flex justify-content-between">
            <span className="text-uppercase fw-semibold text-muted small">
                <i className="bi bi-person-circle me-2"></i>

                {student.sysUser.name}
            </span>
            {
                currentUserIsOwner && <div className="text-danger fw-semibold small" role="button" onClick={removeStudent}>
                    Dar de baja del curso

                </div>
            }
        </div>
    );
}