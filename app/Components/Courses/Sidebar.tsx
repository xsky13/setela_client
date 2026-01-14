import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { NavLink, useParams } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import { AuthContext } from "~/context/AuthContext";
import type { FullCourse } from "~/types/course";

export default function Sidebar({ postEnrollmentFunc, courseData }: { courseData: FullCourse, postEnrollmentFunc: (value: boolean) => void }) {
    const user = useContext(AuthContext);
    const params = useParams();

    const disenrollStudentMutation = useMutation<any, Error, { userId: number }>({
        mutationFn: async data => {
            const response = await api.post("/course/" + courseData?.id + "/disenroll", data);
            return response.data;
        },
        onSuccess() {
            postEnrollmentFunc(false);
        },
        onError(error) {
            toast("Hubo un error. Por favor intente nuevamente.");
            console.log(error);
        },
    });

    const disenrollStudent = (userId: number) => {
        disenrollStudentMutation.mutate({ userId });
    }


    return (
        <div className="position-relative d-flex flex-column flex-shrink-0 p-3 bg-dark text-bg-dark border-top border-4 border-dark position-fixed z-3 h-100 sidebar" >
            <div className="fw-semibold h5">{courseData?.title}</div>
            <div className="small">Primer año</div>
            <ul className="nav flex-column flex-grow-1 mt-4" data-bs-theme="dark">
                <li className="nav-item">
                    <NavLink className={"nav-link " + (params.id != "calificaciones" ? "text-bg-dark" : "text-muted")} to={`/cursos/${courseData.id}`}>Curso</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className={"nav-link " + (params.id?.includes("calificaciones") ? "text-bg-dark" : "text-muted")} to="./calificaciones">Calificaciones</NavLink>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link text-muted dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Profesores</a>
                    <ul className="dropdown-menu" data-bs-theme="dark">
                        {
                            courseData?.professors.map((professor, i) =>
                                <li key={i}><span className="dropdown-item">{professor.name}</span></li>
                            )
                        }
                    </ul>
                </li>
                <li className="nav-item">
                    {
                        user?.enrollments.some(e => e.courseId == courseData?.id) ?
                            <span
                                className="nav-link text-danger"
                                onClick={() => disenrollStudent(user.id)}
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
                            <span className="nav-link text-secondary" role="button">Inscribirse en el curso</span>
                    }
                </li>
            </ul>
        </div>
    );
}