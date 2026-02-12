import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useContext, useEffect } from "react";
import { useParams, Outlet } from "react-router";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import { CourseContext } from "~/context/CourseContext";
import { ExamContext } from "~/context/ExamContext";
import type { Exam } from "~/types/exam";

export default function ExamLayout() {
    const params = useParams();

    const courseContext = useContext(CourseContext);
    if (!courseContext) throw new Error("El curso no existe. Por favor intente de nuevo o contactese con el administrador.");

    const { data: examData, isError, isLoading, error } = useQuery<Exam>({
        queryKey: ['getExamQuery', { examId: Number(params.examId) }],
        queryFn: async () => {
            const response = await api.get('exam/' + params.examId);
            return response.data;
        },
        retry: 1
    });

    useEffect(() => {
        if (examData != undefined) document.title = `${examData.title} | Setela`;
    }, [examData])

    if (isLoading) return <LoadingSegment />
    if (isError) return <ErrorSegment status={isAxiosError(error) && error.response?.status} />

    return (
        <ExamContext value={{ ...examData!, currentUserIsOwner: courseContext.currentUserIsOwner }}>
            <Outlet />
        </ExamContext>
    );
}