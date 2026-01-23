import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import { AssignmentContext } from "~/context/AssignmentContext";
import type { Assignment } from "~/types/course";

export default function AssignmentsLayout() {
    const params = useParams();

    const { data: assignmentData, isError, isLoading, error } = useQuery<Assignment>({
        queryKey: ['getAssignmentQuery', { assignmentId: Number(params.assignmentId) }],
        queryFn: async () => {
            const response = await api.get('assignment/' + params.assignmentId);
            return response.data;
        },
        retry: 1
    });

    useEffect(() => {
        if (assignmentData != undefined) document.title = `${assignmentData.title} | Setela`;
    }, [assignmentData])

    if (isLoading) return <LoadingSegment />
    if (isError) return <ErrorSegment status={isAxiosError(error) && error.response?.status} />

    return (
        <AssignmentContext value={assignmentData}>
            <Outlet />
        </AssignmentContext>
    );
}