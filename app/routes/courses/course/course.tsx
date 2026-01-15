import '../styles/courseStyles.css';
import { useContext } from "react";
import { CourseContext } from "~/context/CourseContext";


export default function Course() {
    const courseData = useContext(CourseContext);

    return (
        <div>
            <h1>{courseData?.title}</h1>
            <p>{courseData?.description}</p>
        </div>
    );
}