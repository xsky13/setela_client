import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import { ModuleContext } from "~/context/ModuleContext";
import type { Module } from "~/types/course";

export default function ModuleLayout() {
    const params = useParams();

    const { data: moduleData, isError, isLoading } = useQuery<Module>({
        queryKey: ['getModuleQuery'],
        queryFn: async () => {
            const response = await api.get('module/' + params.moduleId);
            return response.data;
        },
        retry: 1
    });

    if (isLoading) return <LoadingSegment />
    if (isError) return <ErrorSegment />

    return (
        <ModuleContext value={moduleData}>
            <Outlet />
        </ModuleContext>
    );

}