import '../styles/courseStyles.css';
import { useContext, useEffect } from "react";
import { CourseContext } from "~/context/CourseContext";


export default function Course() {
    const courseData = useContext(CourseContext);

    useEffect(() => {
        if (courseData != undefined) document.title = `Participantes | ${courseData?.title} | Setela`;
    }, [courseData])

    return (
        <div>
            <h1>Estudiantes en {courseData?.title}</h1>
        </div>
    );
}