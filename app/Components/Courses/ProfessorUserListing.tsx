import users from "~/routes/users";
import type { CourseDataView, CourseSimple, FullCourse } from "~/types/course";
import LoadingButton from "../LoadingButton";
import { useContext } from "react";
import { AuthContext } from "~/context/AuthContext";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import type { FullUser, UserSimple } from "~/types/user";
import { getErrors } from "~/utils/error";

export default function ProfessorUserListing({ user, course, i, usersLength }: { user: UserSimple, course: CourseDataView, i: number, usersLength: number }) {
    const currentUser = useContext(AuthContext);
    if (!currentUser) throw new Error('Error no hay usuario');

    const queryClient = useQueryClient();

    const addProfessorMutation = useMutation<CourseSimple, Error, { courseId: number, userId: number, userName: string }>({
            mutationFn: async data => (await api.post(`/course/${data.courseId}/add_professor`, data)).data,
            onError(error) {
                const errors = getErrors(error);
                console.log(errors);
                toast.error(error.message);
            },
            onSuccess: (data, variables) => {
                queryClient.setQueryData(['getCourseQuery', { courseId: course.id }], (old: FullCourse) => {
                    return { ...old, professors: [...old.professors, { id: variables.userId, name: variables.userName }] }
                });
                if (currentUser.id == variables.userId) {
                    queryClient.setQueryData(['get_user'], (old: FullUser) => {
                        return { ...old, professorCourses: [...old.professorCourses, { id: variables.userId, name: variables.userName }] }
                    });
                }
                toast.success("Se agrego al profesor");
            }
        });
    
        const removeProfessorMutation = useMutation<CourseSimple, Error, { courseId: number, userId: number }>({
            mutationFn: async data => (await api.post(`/course/${data.courseId}/remove_professor`, data)).data,
            onError(error) {
                const errors = getErrors(error);
                console.log(errors);
                toast.error(error.message);
            },
            onSuccess: (data, variables) => {
                queryClient.setQueryData(['getCourseQuery', { courseId: course.id }], (old: FullCourse) => {
                    return { ...old, professors: [...old.professors.filter(u => u.id != variables.userId)] }
                });
                if (currentUser.id == variables.userId) {
                    queryClient.setQueryData(['get_user'], (old: FullUser[]) => {
                        queryClient.setQueryData(['get_user'], (old: FullUser) => {
                            return { ...old, professorCourses: old.professorCourses.filter(c => c.id != variables.courseId) }
                        });
                    });
                }
                toast.success("Se elimino al profesor");
            }
        });
    
        const removeProfessor = (userId: number) => {
            if (confirm("Eliminar profesor de curso?")) {
                removeProfessorMutation.mutate({ courseId: course.id, userId: userId })
            }
        }
    
        const addProfessor = (userId: number, userName: string) => {
            if (confirm("Agregar profesor al curso?")) {
                addProfessorMutation.mutate({ courseId: course.id, userId, userName });
            }
        }
    
    return (
        <div className={`d-flex justify-content-between  align-items-center py-3 ${i != usersLength - 1 && " border-bottom"}`}>
            <div className="fw-semibold d-flex align-items-center">
                <div className="avatar-container" style={{
                    width: '40px',
                    height: '40px'
                }}>
                    <img
                        src={user.userImageUrl}
                        alt="Profile Picture"
                        className="avatar-img"
                    />
                </div>
                <span className="ms-2">{user.name}</span>
            </div>
            {
                course.professors.some(p => p.id == user.id) ?
                    <LoadingButton
                        className="btn btn-outline-danger "
                        onClick={() => removeProfessor(user.id)}
                        loading={removeProfessorMutation.isPending}
                    >
                        <i className="bi bi-trash me-2" />
                        Eliminar profesor
                    </LoadingButton>
                    :
                    <LoadingButton
                        className="btn btn-outline-primary "
                        onClick={() => addProfessor(user.id, user.name)}
                        loading={addProfessorMutation.isPending}
                    >
                        <i className="bi bi-plus-circle me-2" />
                        Elegir como profesor
                    </LoadingButton>
            }
        </div>
    );
}