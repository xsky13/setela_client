import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import type { FullCourse } from "~/types/course";
import './styles/courseStyles.css'
import { useContext, useEffect } from "react";
import { AuthContext } from "~/context/AuthContext";

export default function Course() {
    const params = useParams();
    const user = useContext(AuthContext);

    const { data: courseData, isError, isLoading, error } = useQuery<FullCourse>({
        queryKey: ['getCourseQuery'],
        queryFn: async () => {
            const response = await api.get('course/' + params.id);
            return response.data;
        },
        retry: 0
    });

    if (isLoading) return <LoadingSegment />
    if (isError) return <ErrorSegment />

    return (
        <div className="d-flex">
            <div className="position-relative d-flex flex-column flex-shrink-0 p-3 bg-dark text-bg-dark border-top border-4 border-dark position-fixed z-3 h-100 sidebar" >
                <div className="fw-semibold h5">{courseData?.title}</div>
                <div className="small">Primer año</div>
                <ul className="nav flex-column flex-grow-1 mt-4" data-bs-theme="dark">
                    <li className="nav-item">
                        <NavLink className={"nav-link text-muted " + (params.id != "calificaciones" ? "text-bg-dark" : "")} to="">Curso</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={"nav-link text-muted " + (params.id?.includes("calificaciones") ? "text-bg-dark" : "")} to="./calificaciones">Calificaciones</NavLink>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link text-muted dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Profesores</a>
                        <ul className="dropdown-menu" data-bs-theme="dark">
                            {
                                courseData?.professors.map(professor =>
                                    <li><span className="dropdown-item">{professor.name}</span></li>
                                )
                            }
                        </ul>
                    </li>
                    <li className="nav-item">
                        {
                            user?.enrollments.some(e => e.courseId == courseData?.id) ?
                                <span className="nav-link text-danger" role="button">Darse de baja del curso</span>
                                :
                                <span className="nav-link text-secondary" role="button">Inscribirse en el curso</span>
                        }
                    </li>
                </ul>
            </div>

            <div className="main p-4 px-5">
                <h1>{courseData?.title}</h1>
                <p>{courseData?.description}</p>
            </div>
        </div>
    );
}