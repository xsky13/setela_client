import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { NavLink } from "react-router";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import { CourseContext } from "~/context/CourseContext";
import { GradeParentType, type Grade, type GradeListing } from "~/types/grade";

export default function Grades() {
    const course = useContext(CourseContext);
    if (!course) throw new Error("El curso no existe. Por favor, intente de nuevo o contactese con el administrador. ");

    const { data: gradesList, isError, isLoading, error } = useQuery<GradeListing[]>({
        queryKey: ['get_grades_for_course', { courseId: course.id }],
        queryFn: async () => (await api.get(`/grade/${course.id}`)).data,
        retry: 2
    });


    if (isLoading) return <LoadingSegment />
    // TODO: FIGURE OUT ERROR HANDLING
    if (isError) return <ErrorSegment status={400} />

    return (
        <div>
            <h1>Calificaciones</h1>
            <div>

                <div className="table-container bg-white">
                    <table className="table align-middle mb-0">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th scope="col" className="py-3 px-4 subtitle" style={{ width: '45%' }}>Nombre</th>
                                <th scope="col" className="py-3 px-4 subtitle" style={{ width: '25%' }}>Tipo</th>
                                <th scope="col" className="py-3 px-4 subtitle text-center" style={{ width: '15%' }}>Porcentaje</th>
                                <th scope="col" className="py-3 px-4 subtitle text-center" style={{ width: '15%' }}>Calificación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradesList?.map((grade, i) => {
                                const percentage = Math.floor((100 * grade.value) / grade.parentHelper.maxGrade);
                                const isAssignment = grade.parentType == GradeParentType.AssignmentSubmission;
                                return (
                                    <tr key={i}>
                                        <td className="py-3 px-4">
                                            <NavLink
                                                className="text-decoration-none text-dark fw-semibold fs-6"
                                                to={(isAssignment ? `/cursos/${grade.courseId}/a/` : `/cursos/${grade.courseId}/e/`) + grade.parentHelper.grandParentId}
                                            >
                                                {grade.parentHelper.itemTitle}
                                            </NavLink>
                                        </td>
                                        <td className="py-3 px-4">
                                            {isAssignment ? (
                                                <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-success-emphasis bg-success-subtle text-uppercase small">
                                                    <i className="bi bi-card-checklist me-2"></i>
                                                    Trabajo practico
                                                </span>
                                            ) : (
                                                <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-danger-emphasis bg-danger-subtle text-uppercase small">
                                                    <i className="bi bi-book me-2"></i>
                                                    Examen
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`fw-bold fs-5`}>
                                                {percentage}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className={`fw-bold fs-4`}>
                                                {grade.value}
                                            </div>
                                            <small className="text-muted">
                                                de {grade.parentHelper.maxGrade}
                                            </small>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}