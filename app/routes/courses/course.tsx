import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import type { FullCourse } from "~/types/course";
import './styles/courseStyles.css';
import Sidebar from "~/Components/Courses/Sidebar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "~/context/AuthContext";
import { UserRole } from "~/types/roles";
import type { Route } from "./+types/course";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Cursos | Setela" },
        { name: "description", content: "Cursos teologicos" },
    ];
}

export default function Course() {
    const params = useParams();
    const user = useContext(AuthContext);
    const [userCanAccessCourse, setUserCanAccessCourse] = useState(false);

    const { data: courseData, isError, isLoading } = useQuery<FullCourse>({
        queryKey: ['getCourseQuery'],
        queryFn: async () => {
            const response = await api.get('course/' + params.id);
            return response.data;
        },
        retry: 0
    });

    useEffect(() => {
        document.title = `${courseData?.title} | Setela`;
    }, [])

    /** 
     * ! POSIBLE BUG: I DONT KNOW IF THE ID PROPERTY OF PROFESSORCOURSE IS FROM THE ACTUAL COURSE OR INTERMEDIARY TABLE
     * TODO: findout sometime i geuss
     */

    useEffect(() => {
        if (user?.roles.includes(UserRole.admin) || user?.roles.includes(UserRole.professor)) {
            setUserCanAccessCourse(true);
        } else if (user?.enrollments.some(e => e.courseId == courseData?.id)) {
            setUserCanAccessCourse(true);
        }
    }, []);

    if (isLoading) return <LoadingSegment />
    if (isError) return <ErrorSegment />

    return (
        <div className="d-flex">
            <Sidebar courseData={courseData!} />
            <div className="main p-4 px-5">
                {
                    userCanAccessCourse ?
                        <div>
                            <h1>{courseData?.title}</h1>
                            <p>{courseData?.description}</p>
                        </div>
                        :
                        <h1 className=" text-center">Debe inscribirse al curso antes de poder acceder a el.</h1>
                }
            </div>
        </div>
    );
}