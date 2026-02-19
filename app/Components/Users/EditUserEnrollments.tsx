import type { Enrollment, FullUser } from "~/types/user";
import LoadingButton from "../LoadingButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import type { CourseSimple } from "~/types/course";
import { getErrors } from "~/utils/error";
import { toast } from "sonner";

export default function EditUserEnrollments({ user }: { user: FullUser }) {
    const queryClient = useQueryClient();

    const removeCourseMutation = useMutation<Enrollment, Error, { courseId: number, userId: number }>({
        mutationFn: async data => (await api.post(`/course/${data.courseId}/disenroll`, data)).data,
        onError(error) {
            const errors = getErrors(error);
            console.log(errors);
            toast.error(error.message);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['get_users_query'], (old: FullUser[]) => {
                return [...old.map(u => u.id == user.id ? {
                    ...u,
                    enrollments: u.enrollments.filter(pc => pc.courseId != variables.courseId)
                } : u)]
            });
            toast.success("Se elimino al estudiante");
        }
    });

    const removeCourse = (courseId: number) => {
        if (confirm("Eliminar estudiante del curso?")) {
            removeCourseMutation.mutate({ courseId, userId: user.id })
        }
    }
    return (
        <div>
            {
                user.professorCourses.length == 0 ?
                    <p className="text-muted fst-italic">
                        <i className="bi bi-info-circle me-2" />
                        Este usuario no esta inscripto en ningun curso
                    </p>
                    :
                    <table className="table table-hover" style={{ marginTop: '-1rem'}}>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th className="w-100" scope="col">Curso</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user.enrollments.map((course, i) => (
                                    <tr>
                                        <th scope="row">{i + 1}</th>
                                        <td>{course.courseTitle}</td>
                                        <td className="text-center">
                                            <LoadingButton
                                                className="bg-transparent p-0 border-0 text-danger"
                                                onClick={() => removeCourse(course.courseId)}
                                                loading={removeCourseMutation.isPending}
                                            >
                                                <i className="bi bi-trash" />
                                            </LoadingButton>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            }
        </div>
    );
}