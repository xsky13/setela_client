import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import FormErrors from "~/Components/Error/FormErrors";
import LoadingButton from "~/Components/LoadingButton";
import { CourseContext } from "~/context/CourseContext";
import { ModuleContext } from "~/context/ModuleContext";
import { getErrors } from "~/utils/error";

export default function EditModule() {
    const moduleData = useContext(ModuleContext);
    const courseData = useContext(CourseContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    if (moduleData == undefined || moduleData == null) throw new Error("Modulo no existe");

    const deleteModuleMutation = useMutation<any, Error>({
        mutationKey: ['delete_module_command'],
        mutationFn: async () => {
            const response = await api.delete("/module/" + moduleData.id);
            return response.data;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['getCourseQuery']});
            navigate(`/cursos/${courseData?.id}`);
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

    return (
        <div>
            <nav
                style={{
                    '--bs-breadcrumb-divider': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E\")"
                } as React.CSSProperties}
                aria-label="breadcrumb"
            >
                <ol className="breadcrumb">
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to="/" className="text-decoration-none text-muted">
                            <i className="bi bi-house-fill me-1" />
                        </NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to={`/cursos/${courseData!.id}`} className="text-decoration-none text-muted mx-1">{courseData?.title}</NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to={`/cursos/${courseData!.id}/m/${moduleData.id}`} className="text-decoration-none text-muted mx-1">{moduleData?.title}</NavLink>
                    </li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center">
                <h1>{moduleData.title}</h1>
                {
                    courseData?.currentUserIsOwner &&
                    <div className="my-2 d-flex">
                        <NavLink to="editar" className="btn btn-light"><i className="bi bi-pencil me-1" /> Editar</NavLink>
                        <LoadingButton
                            loading={deleteModuleMutation.isPending}
                            onClick={deleteModule}
                            className="btn btn-danger ms-2"
                        >
                            <i className="bi bi-trash me-1" />
                            Eliminar
                        </LoadingButton>
                    </div>
                }
            </div>
            <div className="my-2">
                {moduleData.textContent}
            </div>
        </div >
    );
}