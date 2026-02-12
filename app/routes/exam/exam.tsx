import { useContext } from "react";
import { NavLink } from "react-router";
import ExamOwnerView from "~/Components/Views/Exam/ExamOwnerView";
import ExamStudentView from "~/Components/Views/Exam/ExamStudentView";
import { CourseContext } from "~/context/CourseContext";
import { ExamContext } from "~/context/ExamContext";

export default function Exam() {
    const examData = useContext(ExamContext);
    const courseData = useContext(CourseContext);

    if (!examData || !courseData) throw new Error("El examen no existe. Por favor intente de nuevo o contactese con el administrador.");

    return (
        <div>
            <nav
                style={{
                    '--bs-breadcrumb-divider': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E\")"
                } as React.CSSProperties}
                aria-label="breadcrumb"
            >
                <ol className="breadcrumb">
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to="/" className="text-decoration-none text-muted">
                            <i className="bi bi-house-fill me-1" />
                        </NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to={`/cursos/${courseData!.id}`} className="text-decoration-none text-muted mx-1">{courseData.title}</NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to={`/cursos/${courseData!.id}/a/${examData.id}`} className="text-decoration-none text-muted mx-1">{examData.title}</NavLink>
                    </li>
                </ol>
            </nav>

            {
                examData.currentUserIsOwner ?
                    <ExamOwnerView exam={examData} />
                    :
                    <ExamStudentView exam={examData} />
            }
        </div>
    );
}