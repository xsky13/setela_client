import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import type { FullCourse } from "~/types/course";
import './styles/courseStyles.css'
import { useContext, useEffect } from "react";
import { AuthContext } from "~/context/AuthContext";
import Sidebar from "~/Components/Courses/Sidebar";

export default function Course() {
    const params = useParams();
    const user = useContext(AuthContext);

    const { data: courseData, isError, isLoading, error } = useQuery<FullCourse>({
        queryKey: ['getCourseQuery'],
        queryFn: async () => {
            const response = await api.get('course/' + params.id);
            return response.data;
        },
        retry: 0
    });

    if (isLoading) return <LoadingSegment />
    if (isError) return <ErrorSegment />

    return (
        <div className="d-flex">
            <Sidebar courseData={courseData!} />
            <div className="main p-4 px-5">
                <h1>{courseData?.title}</h1>
                <p>{courseData?.description}</p>
            </div>
        </div>
    );
}