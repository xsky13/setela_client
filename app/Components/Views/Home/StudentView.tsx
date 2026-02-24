import { NavLink } from "react-router";
import type { ProfessorCourse, StudentCourse } from "~/types/course";
import StudentCourseCard from "./StudentCourseCard";


export default function StudentView({ courses }: { courses: StudentCourse[] }) {
    return (
        <div className="container">
            <h2>Materias inscriptas</h2>
            <p>Gestiona y accede a tus materias inscrptas</p>
            <div className="row">
                {
                    courses.length != 0 ?
                        courses.map(course => (
                            <StudentCourseCard course={course} />
                        ))
                        :
                        <div>
                            
                        </div>
                }
            </div>
        </div>
    )
}