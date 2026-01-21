import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import LoadingButton from "~/Components/LoadingButton";
import type { FullCourse, Module, ResourceListing } from "~/types/course";
import { getErrors } from "~/utils/error";

export default function ModuleListing({ 
    module, 
    currentUserIsOwner, 
}: { module: Module, currentUserIsOwner: boolean }) {
    const queryClient = useQueryClient();

    const deleteModuleMutation = useMutation<any, Error>({
        mutationKey: ['delete_module_command'],
        mutationFn: async () => {
            const response = await api.delete("/module/" + module.id);
            return response.data;
        },
        onSuccess() {
            queryClient.setQueryData(['getCourseQuery', { courseId: Number(module.courseId) }], (old: FullCourse) => {
                return { ...old, modules: old.modules.filter(m => m.id != module.id) }
            });
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);
            toast(error.message);
        },
        retry: 1
    });

    const changeVisibilityMutation = useMutation<any, Error, { visible: boolean }>({
        mutationKey: ['change_visibility_command'],
        mutationFn: async data => {
            const response = await api.put("/module/" + module.id, data);
            return response.data;
        },
        async onSuccess() {
            queryClient.setQueryData(['getCourseQuery', { courseId: Number(module.courseId) }], (old: FullCourse) => {
                return { ...old,
                    modules: old.modules.map((m: Module) => m.id == module.id ? {
                        ...m, visible: !module.visible
                    } : m)
                }
            });

            queryClient.setQueryData(['getModuleQuery', { moduleId: Number(module.id) }], (old: Module) => ({ ...old, visible: !module.visible }))
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);
            toast(error.message);
        },
        retry: 1
    });

    const deleteModule = () => {
        if (confirm("Esta seguro que quiere eliminar este modulo? Esta acción es irreversible")) {
            deleteModuleMutation.mutate();
        }
    }

    const changeVisibility = () => {
        changeVisibilityMutation.mutate({ visible: !module.visible })
    }


    return (
        <div className="d-flex justify-content-between rounded-2 border border  p-4 my-3">
            <div>
                <div className="bg-white border-0 mb-2">
                    <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-primary-emphasis bg-primary-subtle text-uppercase small">
                        <i className="bi bi-book me-2"></i>
                        Modulo
                    </span>
                </div>
                <NavLink to={`./m/${module.id}`} className="h5 card-title text-decoration-none">{module.title}</NavLink>
            </div>
            <div className={"d-flex flex-column " + (currentUserIsOwner && "justify-content-end")}>
                <button className="btn btn-light mb-2">
                    <i className='bi bi-check-circle me-2'></i>
                    Marcar finalizado
                </button>
                {
                    currentUserIsOwner &&
                    <div className="d-flex">
                        <LoadingButton onClick={changeVisibility} loading={changeVisibilityMutation.isPending} className="p-0 bg-white border-0 text-center small">
                            {
                                module.visible ?
                                    <><i className="bi bi-eye" /><span className="d-block">Visible</span></>
                                    :
                                    <><i className="bi bi-eye-slash" /><span className="d-block">No visible</span></>

                            }
                        </LoadingButton>
                        <LoadingButton onClick={deleteModule} loading={deleteModuleMutation.isPending} className="p-0 bg-white border-0 text-danger text-center small mx-4">
                            <i className="bi bi-trash-fill" />
                            <span className="d-block">Eliminar</span>
                        </LoadingButton>
                        <NavLink to={`./m/${module.id}/editar`} className="text-center small text-decoration-none" role="button">
                            <i className="bi bi-pencil" />
                            <span className="d-block">Editar</span>
                        </NavLink>
                    </div>
                }
            </div>
        </div>
    );
}