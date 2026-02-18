import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import FormErrors from "~/Components/Error/FormErrors";
import LoadingButton from "~/Components/LoadingButton";
import { AuthContext } from "~/context/AuthContext";
import { CourseContext } from "~/context/CourseContext";
import { type CourseSimple } from "~/types/course";
import { UserRole } from "~/types/roles";
import { getErrors } from "~/utils/error";

export default function EditCourse() {
    const course = useContext(CourseContext);
    const user = useContext(AuthContext);
    if (!course) throw new Error("El curso no existe. Por favor intente de nuevo o contactese con el administrador.");

    const [active, setActive] = useState(course.isActive);
    const [errors, setErrors] = useState<string[]>([]);

    const editCourseMutation = useMutation<CourseSimple, Error, FormData>({
        mutationFn: async data => ((await api.put("/course/" + course.id, data)).data),
        onError(error) {
            const errors = getErrors(error);
            setErrors(errors);
        },
        onSuccess() {
            toast("Curso actualizado");
        }
    })
    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.append('isActive', active.toString());
        editCourseMutation.mutate(formData);
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
                        <NavLink to={`/cursos/${course.id}`} className="text-decoration-none text-muted mx-1">{course.title}</NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold text-decoration-none text-muted mx-1">
                        Editar
                    </li>
                </ol>
            </nav>
            
            <h1>Editar curso</h1>
            <form onSubmit={handleEdit}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        id="title"
                        placeholder="Su titulo"
                        defaultValue={course.title}
                    />
                    <label htmlFor="title">Titulo</label>
                </div>
                <div className="form-floating mb-3">
                    <textarea
                        name="description"
                        className="form-control"
                        id="description"
                        placeholder="Contentido"
                        style={{ height: '200px' }}
                        defaultValue={course.description}
                    />
                    <label htmlFor="description">Descripcion</label>
                </div>
                {
                    user?.roles.includes(UserRole.admin) &&
                    <div className="mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={active}
                            onChange={() => setActive(!active)}
                        />
                        <label className="form-check-label ms-2" htmlFor="active">
                            Activo
                        </label>
                    </div>
                }
                <LoadingButton loading={editCourseMutation.isPending} className="btn btn-primary btn-block w-100">Continuar</LoadingButton>


                {
                    errors.length != 0 ?
                        <FormErrors serverErrors={errors} />
                        :
                        ''
                }
            </form>
        </div>
    );
}