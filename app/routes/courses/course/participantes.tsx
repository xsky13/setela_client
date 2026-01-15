import '../styles/courseStyles.css';
import { useContext, useEffect } from "react";
import StudentListing from '~/Components/Courses/Course/StudentListing';
import { CourseContext } from "~/context/CourseContext";


export default function Course() {
    const courseData = useContext(CourseContext);

    useEffect(() => {
        if (courseData != undefined) document.title = `Participantes | ${courseData?.title} | Setela`;
    }, [courseData])

    return (
        <div>
            <h1>Estudiantes en {courseData?.title}</h1>
            <div className="mt-4">
                {
                    courseData?.enrollments.map((enrollment, i) => (
                        <StudentListing
                            key={i}
                            student={enrollment}
                            courseId={courseData.id}
                            currentUserIsOwner={courseData.currentUserIsOwner}
                        />
                    ))
                }
            </div>
        </div>
    );
}