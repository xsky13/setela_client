import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import type { StudentCourse } from "~/types/course";

export default function StudentCourseCard({ course }: { course: StudentCourse }) {
    const { data: progress, isError, isLoading } = useQuery<number>({
        queryKey: ['get_progress_for_course', { courseId: course.courseId }],
        queryFn: async () => (await api.get(`/userProgress/${course.courseId}`)).data,
        retry: 2
    });

    const renderUserProgress = () => {
        if (isLoading) {
            return <p className="card-text placeholder-glow px-3">
                <span className="placeholder placeholder-custom col-12"></span>
                <span className="placeholder placeholder-custom col-10"></span>
            </p>
        }
        else if (isError) {
            toast("Hubo un error cargando progreso del curso. Por favor reinicie la pagina e intente de nuevo")
            return;
        }
        else {
            return <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center text-muted mb-2">
                        <i className="bi bi-activity me-2"></i>
                        <small className="subtitle">
                            Progreso
                        </small>
                    </div>
                    <div className="fw-bold text-primary h5">
                        {progress}%
                    </div>
                </div>
                <div className="progress progress-secondary" aria-label="Example 1px high" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} role="progressbar" style={{ height: '3px' }}>
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        }
    }

    return (
        <div className="col-md-6 col-lg-4">
            <div className="card border-2 border-primary h-100 p-3">
                <div className="card-header border-0 bg-white ">
                    <h5 className="card-title mb-0">{course.courseTitle}</h5>
                    <small>Primer año</small>
                </div>
                    {renderUserProgress()}
                <div className="card-footer border-0 bg-white text-center">
                    <NavLink to={`cursos/${course.courseId}`} className="btn btn-primary my-1 w-100">
                        <i className="bi bi-box-arrow-in-right"></i> Ir al curso
                    </NavLink>
                </div>
            </div>
        </div>
    );

}