import type { FullUser } from "~/types/user";
import LoadingButton from "../LoadingButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import type { CourseSimple } from "~/types/course";
import { getErrors } from "~/utils/error";
import { toast } from "sonner";

export default function EditUserCourses({ user }: { user: FullUser }) {
    const queryClient = useQueryClient();

    const removeCourseMutation = useMutation<CourseSimple, Error, { courseId: number, userId: number }>({
        mutationFn: async data => (await api.post(`/course/${data.courseId}/remove_professor`, data)).data,
        onError(error) {
            const errors = getErrors(error);
            console.log(errors);
            toast.error(error.message);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['get_users_query'], (old: FullUser[]) => {
                return [...old.map(u => u.id == user.id ? {
                    ...u,
                    professorCourses: u.professorCourses.filter(pc => pc.id != data.id)
                } : u)]
            });
            toast.success("Se elimino al profesor");
        }
    });

    const removeCourse = (courseId: number) => {
        if (confirm("Eliminar profesor de curso?")) {
            removeCourseMutation.mutate({ courseId, userId: user.id })
        }
    }
    return (
        <div>
            <p>
                <i className="bi bi-info-circle me-2" />
                Para agregar curso, ir a pagina principal del curso y poner al usuario como profesor desde alli.</p>
            {
                user.professorCourses.length == 0 ?
                    <p className="text-muted fst-italic">
                        <i className="bi bi-info-circle me-2" />
                        Este usuario no dicta ningun curso
                    </p>
                    :
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th className="w-100" scope="col">Curso</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user.professorCourses.map((course, i) => (
                                    <tr>
                                        <th scope="row">{i + 1}</th>
                                        <td>{course.title}</td>
                                        <td className="text-center">
                                            <LoadingButton
                                                className="bg-transparent p-0 border-0 text-danger"
                                                onClick={() => removeCourse(course.id)}
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