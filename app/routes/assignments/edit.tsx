import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import FormErrors from "~/Components/Error/FormErrors";
import LoadingButton from "~/Components/LoadingButton";
import { AssignmentContext } from "~/context/AssignmentContext";
import { CourseContext } from "~/context/CourseContext";
import type { Assignment } from "~/types/assignment";
import type { FullCourse } from "~/types/course";
import { formatDateForInput } from "~/utils/date";
import { getErrors } from "~/utils/error";

type AssignmentFormData = {
    title: string,
    textContent: string,
    maxGrade: number,
    weight: number,
    dueDate: string,
    visible: boolean,
    closed: boolean,
}


export default function EditAssignment() {
    const [errors, setErrors] = useState<string[]>([]);
    const assignmentData = useContext(AssignmentContext);
    const courseData = useContext(CourseContext);

    const queryClient = useQueryClient();

    if (assignmentData == undefined) throw new Error("Assignment doesnt exist");
    if (courseData == undefined) throw new Error("Course doesnt exist");

    const [visible, setVisible] = useState(assignmentData.visible)
    const [closed, setClosed] = useState(assignmentData.closed)

    const [redundantFormData, setRedundantFormData] = useState<AssignmentFormData>();


    const editAssignmentMutation = useMutation<Assignment, Error, AssignmentFormData>({
        mutationKey: ['edit_assignment_command'],
        mutationFn: async data => {
            const response = await api.put('/assignment/' + assignmentData?.id, data);
            return response.data;
        },
        onSuccess(data) {
            setErrors([]);

            queryClient.setQueryData(['getAssignmentQuery', { assignmentId: assignmentData.id }], (old: Assignment) => {
                return {
                    ...old,
                    ...redundantFormData
                }
            });

            queryClient.setQueryData(['getCourseQuery', { courseId: courseData.id }], (old: FullCourse) => ({
                ...old, assignments: old.assignments.map(a => a.id == assignmentData.id ? data : a)
            }))

            toast("Sus cambios fueron guardados");
        },
        onError(error) {
            const errors = getErrors(error);
            setErrors(errors);
            console.log(error);
        }
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget)
        const formValues = Object.fromEntries(formData.entries()) as unknown as AssignmentFormData

        const emptyExists = Object.values(formValues).some(value => value == '');
        if (emptyExists) {
            setErrors(["No puede haber campos vacíos."]);
            return;
        }

        setRedundantFormData({ ...formValues, visible, closed });

        editAssignmentMutation.mutate({ ...formValues, visible, closed });
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
                        <NavLink to={`/cursos/${courseData!.id}/a/${assignmentData.id}`} className="text-decoration-none text-muted mx-1">{assignmentData?.title}</NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold text-decoration-none text-muted mx-1">
                        Editar
                    </li>
                </ol>
            </nav>
            <h1>Actializar trabajo práctico</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="form-floating mb-3">
                    <input
                        id="title"
                        name="title"
                        defaultValue={assignmentData?.title}
                        type="text"
                        className="form-control"
                        placeholder="Su titulo"
                    />
                    <label htmlFor="title">Titulo</label>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input
                                id="maxGrade"
                                defaultValue={assignmentData?.maxGrade}
                                name="maxGrade"
                                type="number"
                                className="form-control"
                                placeholder="Su titulo"
                            />
                            <label htmlFor="maxGrade">Nota máxima</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input
                                id="weight"
                                name="weight"
                                defaultValue={assignmentData?.weight}
                                type="number"
                                className="form-control"
                                placeholder="Su titulo"
                            />
                            <label htmlFor="weight">Peso</label>
                        </div>
                    </div>
                </div>
                <div className="form-floating mb-3">
                    <input
                        id="dueDate"
                        name="dueDate"
                        defaultValue={formatDateForInput(assignmentData.dueDate)}
                        type="datetime-local"
                        className="form-control"
                        placeholder="Su titulo"
                    />
                    <label htmlFor="dueDate">Fecha de entrega</label>
                </div>
                <div className="form-floating mb-3">
                    <textarea
                        id="textContent"
                        name="textContent"
                        defaultValue={assignmentData?.textContent}
                        className="form-control"
                        placeholder="Consigna"
                        style={{ height: '200px' }} />
                    <label htmlFor="textContent">Consigna</label>
                </div>
                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="visible"
                        checked={visible}
                        onChange={() => setVisible(!visible)}
                    />
                    <label className="form-check-label" htmlFor="visible">
                        Trabajo esta visible
                    </label>
                </div>
                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="closed"
                        checked={closed}
                        onChange={() => setClosed(!closed)}
                    />
                    <label className="form-check-label" htmlFor="closed">
                        Trabajo esta cerrado
                    </label>
                </div>
                <div className="row">

                    <div className="col">
                        <NavLink to={"/cursos/" + courseData.id + "/a/" + assignmentData.id} className="btn btn-light btn-block w-100">
                            <i className="bi bi-chevron-left" />
                            <span className="ms-2">Volver a trabajo practico</span>
                        </NavLink>
                    </div>
                    <div className="col">
                        <LoadingButton loading={editAssignmentMutation.isPending} className="btn btn-primary btn-block w-100">Actualizar</LoadingButton>
                    </div>
                </div>
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