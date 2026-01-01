import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Link } from "react-router";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import type { Profesor } from "~/types/user";

export default function Index() {
    const { data: courseData, isLoading, error } = useQuery({
        queryKey: ['getCoursesQuery'],
        queryFn: async () => {
            const response = await api.get('course');
            return response.data;
        },
        retry: 0
    });

    if (isLoading) return <LoadingSegment />
    if (isAxiosError(error) && error.response?.status !== 401) return <ErrorSegment />;

    return (
        <div className="container pt-5">
            <h1>Cursos</h1>
            {
                courseData.map((course: any, i: number) => (
                    <div key={i} className="position-relative my-3 rounded-2 border border-2 border-primary px-3 py-2 d-flex justify-content-between">
                        <div>
                            <span className="fw-semibold">{course.title}</span>
                            <div className="mt-2 small">
                                <span className="fw-bold text-muted h6">Profesores</span>
                                <ul className=" list-unstyled">
                                    {course.professors.map((professor: Profesor, i: number) => (
                                        <li key={i}>{professor.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <Link to={`/cursos/` + course.id} className="btn btn-secondary">
                                Ir al curso
                                <i className="bi bi-chevron-right ms-1"></i>

                            </Link>
                        </div>
                        <Link to={`/cursos/${course.id}/editar`} className="position-absolute small text-muted fw-semibold unstyled" style={{ bottom: 10, right: 20 }}>
                            <i className="bi bi-pencil me-1"></i>
                            Editar
                        </Link>
                    </div>
                ))
            }
        </div>
    );
}