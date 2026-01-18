import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Navigate, NavLink, useParams } from "react-router";
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
    if (moduleData == undefined || moduleData == null) throw new Error("Modulo no existe");


    const [title, setTitle] = useState(moduleData?.title);
    const [textContent, setTextContent] = useState(moduleData?.textContent);
    const [visible, setVisible] = useState(moduleData.visible);
    const [error, setError] = useState("");

    const [serverErrors, setServerErrors] = useState<any[]>([]);
    const editModuleMutation = useMutation<any, Error, { title: string, textContent: string, visible: boolean }>({
        mutationKey: ['edit_module_command'],
        mutationFn: async data => {
            const response = await api.put("/module/" + moduleData.id, data);
            return response.data;
        },
        onSuccess() {
            toast("Sus cambios fueron guardados.")
        },
        onError: error => {
            const errors = getErrors(error);
            setServerErrors(errors);
            console.log(error);
        },
        retry: 1
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (title == "") {
            setError("El titulo no puede estar vacio")
        } else {
            setError("");
            editModuleMutation.mutate({ title, textContent, visible })
        }
    }

    return (
        courseData?.currentUserIsOwner ?
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
                        <li className="breadcrumb-item small fw-semibold text-decoration-none text-muted mx-1">
                            Editar
                        </li>
                    </ol>
                </nav>
                <h1>Editar modulo</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="form-control"
                            id="title"
                            placeholder="Su titulo"
                        />
                        <label htmlFor="title">Titulo</label>
                    </div>
                    <div className="form-floating mb-3">
                        <textarea
                            value={textContent}
                            onChange={e => setTextContent(e.target.value)}
                            className="form-control"
                            id="textContent"
                            placeholder="Contentido"
                            style={{ height: '200px' }} />
                        <label htmlFor="textContent">Contenido de texto</label>
                    </div>
                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" checked={visible} onChange={() => setVisible(!visible)} id="visible" />
                        <label className="form-check-label" htmlFor="visible">
                            Modulo esta visible
                        </label>
                    </div>
                    <LoadingButton loading={editModuleMutation.isPending} className="btn btn-primary btn-block w-100">Guardar cambios</LoadingButton>
                    {
                        error ?
                            <p className="text-danger mt-2">{error}</p>
                            :
                            ''
                    }

                    {
                        serverErrors.length != 0 ?
                            <FormErrors serverErrors={serverErrors} />
                            :
                            ''
                    }
                </form>
            </div>
            :
            <Navigate to={`/cursos/${courseData?.id}/m/${moduleData.id}`} />
    );
}