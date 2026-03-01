import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import { AuthContext } from "~/context/AuthContext";
import { CourseContext } from "~/context/CourseContext";
import type { CourseDataView, FullCourse } from "~/types/course";
import AddProfessorModal from "./AddProfessorModal";
import type { FullUser } from "~/types/user";

export default function Sidebar({ courseData }: { courseData: CourseDataView }) {
    const user = useContext(AuthContext);
    const queryClient = useQueryClient()

    const userEnrolled = user?.enrollments.some(e => e.courseId == courseData.id);

    const disenrollStudentMutation = useMutation<any, Error, { userId: number }>({
        mutationFn: async data => {
            const response = await api.post("/course/" + courseData?.id + "/disenroll", data);
            return response.data;
        },
        async onSuccess() {
            queryClient.setQueryData(["get_user"], (old: FullUser) => {
                return { ...old, enrollments: old.enrollments.filter(e => e.courseId != courseData.id) }
            })
        },
        onError(error) {
            toast("Hubo un error. Por favor intente nuevamente.");
            console.log(error);
        },
    });

    const enrollStudentMutation = useMutation<FullCourse, Error, { userId: number }>({
        mutationFn: async data => {
            const response = await api.post("/course/" + courseData?.id + "/enroll", data);
            return response.data;
        },
        async onSuccess(data) {
            queryClient.setQueryData(["get_user"], (old: FullUser) => {
                return { ...old, enrollments: data.enrollments }
            })
        },
        onError(error) {
            toast("Hubo un error. Por favor intente nuevamente.");
            console.log(error);
        },
    });

    const enrollStudent = () => {
        enrollStudentMutation.mutate({ userId: user!.id });
    };

    const disenrollStudent = () => {
        disenrollStudentMutation.mutate({ userId: user!.id });
    }

    return (
        <div className="position-relative d-flex flex-column flex-shrink-0 p-3 bg-dark text-bg-dark border-top border-4 border-dark position-fixed z-3 h-100 sidebar" >
            <div className="fw-semibold h5">{courseData?.title}</div>
            <div className="small">Primer año</div>
            <ul className="nav flex-column flex-grow-1 mt-4" data-bs-theme="dark">
                <li className="nav-item">
                    <NavLink className={"nav-link " + ((!window.location.href.includes("calificaciones") && !window.location.href.includes("participantes")) ? "text-bg-dark" : "text-muted")} to={`/cursos/${courseData.id}`}>Curso</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className={"nav-link " + (window.location.href.includes("calificaciones") ? "text-bg-dark" : "text-muted")} to={`/cursos/${courseData.id}/calificaciones`}>Calificaciones</NavLink>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link text-muted dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Profesores</a>
                    {
                        courseData.professors != undefined && <ul className="dropdown-menu" data-bs-theme="dark">
                            {
                                courseData.professors.map((professor, i) =>
                                    <li key={i}><span className="dropdown-item">{professor.name}</span></li>
                                )
                            }
                            {
                                courseData.currentUserIsOwner &&
                                <li><div className="p-2">
                                    <AddProfessorModal course={courseData} />
                                </div></li>

                            }
                        </ul>
                    }
                </li>
                <li className="nav-item">
                    <NavLink className={"nav-link " + (window.location.href.includes("participantes") ? "text-bg-dark" : "text-muted")} to={`/cursos/${courseData.id}/participantes`}>Participantes</NavLink>
                </li>
                <li className="nav-item">
                    {
                        userEnrolled ?
                            <span
                                className="nav-link text-danger"
                                onClick={disenrollStudent}
                                role="button"
                            >
                                {
                                    disenrollStudentMutation.isPending ?
                                        <div className="spinner-border spinner-border-sm text-danger" role="status">
                                        </div>
                                        :
                                        'Darse de baja del curso'
                                }
                            </span>
                            :
                            <span
                                className="nav-link text-secondary"
                                onClick={enrollStudent}
                                role="button"
                            >
                                {
                                    enrollStudentMutation.isPending ?
                                        <div className="spinner-border spinner-border-sm" role="status">
                                        </div>
                                        :
                                        'Inscribirse en el curso'
                                }
                            </span>
                    }
                </li>
            </ul>
        </div>
    );
}