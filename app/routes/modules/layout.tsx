import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import api from "~/api";
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import { ModuleContext } from "~/context/ModuleContext";
import type { Module } from "~/types/course";

export default function ModuleLayout() {
    const params = useParams();

    const { data: moduleData, isError, isLoading, error } = useQuery<Module>({
        queryKey: ['getModuleQuery', { moduleId: Number(params.moduleId) }],
        queryFn: async () => {
            const response = await api.get('module/' + params.moduleId);
            return response.data;
        },
        retry: 1
    });

    useEffect(() => {
        if (moduleData != undefined) document.title = `${moduleData.title} | Setela`;
    }, [moduleData])

    if (isLoading) return <LoadingSegment />
    if (isError) return <ErrorSegment status={isAxiosError(error) && error.response?.status} />

    return (
        <ModuleContext value={moduleData}>
            <Outlet />
        </ModuleContext>
    );

}