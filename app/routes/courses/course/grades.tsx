import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import { CourseContext } from "~/context/CourseContext";
import type { Grade } from "~/types/grade";

export default function Grades() {
    const course = useContext(CourseContext);
    if (!course) throw new Error("El curso no existe. Por favor, intente de nuevo o contactese con el administrador. ");

    const { data: gradesList, isError, isLoading, error } = useQuery<Grade[]>({
        queryKey: ['get_grades_for_course', { courseId: course.id }],
        queryFn: async () => (await api.get(`/grade/${course.id}`)).data,
        retry: 2
    });

    console.log(gradesList);
    

    if (isLoading) return <LoadingSegment />
    // TODO: FIGURE OUT ERROR HANDLING
    if (isError) return <ErrorSegment status={400} />

    return (
        <div>
            <h1>Calificaciones</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th className="subtitle" scope="col">Nro</th>
                        <th className="subtitle" scope="col">Nombre</th>
                        <th className="subtitle" scope="col">Tipo</th>
                        <th className="subtitle" scope="col">Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        gradesList?.map((grade, i) => 
                        <tr>
                            <th className="">{i + 1}</th>
                            <td>hel</td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    );
}