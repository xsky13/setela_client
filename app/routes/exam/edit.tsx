import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import FormErrors from "~/Components/Error/FormErrors";
import LoadingButton from "~/Components/LoadingButton";
import { CourseContext } from "~/context/CourseContext";
import { ExamContext } from "~/context/ExamContext";
import type { FullCourse } from "~/types/course";
import type { Exam, ExamSimple } from "~/types/exam";
import { formatDateForInput } from "~/utils/date";
import { getErrors } from "~/utils/error";

type ExamRequest = {
    title: string,
    description: string,
    maxGrade: number,
    weight: number,
    startTime: string,
    endTime: string,
    visible: boolean,
    closed: boolean
}


export default function EditExam() {
    const [errors, setErrors] = useState<string[]>([]);
    const examData = useContext(ExamContext);
    const courseData = useContext(CourseContext);

    if (!examData || !courseData) throw new Error("El examen no existe. Por favor intente de nuevo o contactese con el administrador.");

    const [visible, setVisible] = useState(examData.visible)
    const [closed, setClosed] = useState(examData.closed)

    const queryClient = useQueryClient();


    const editExamMutation = useMutation<Exam, Error, ExamRequest>({
        mutationKey: ["edit_exam_command"],
        mutationFn: async data => {
            const response = await api.put("/exam/" + examData.id, data);
            return response.data;
        },
        onError(error) {
            const errors = getErrors(error);
            setErrors(errors);
        },
        onSuccess(data) {
            setErrors([]);
            toast("Sus cambios fueron guardados.");

            queryClient.setQueryData(['getExamQuery', { examId: examData.id }], (old: Exam) => {
                return { ...data, resources: old.resources, examSubmissions: old.examSubmissions, course: old.course }
            });
            queryClient.setQueryData(['getCourseQuery', { courseId: courseData.id }], (old: FullCourse) => ({ 
                ...old, exams: old.exams.map(e => e.id == examData.id ? data : e) 
            }))
        },
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const formValues = Object.fromEntries(formData.entries()) as unknown as ExamRequest;

        const emptyExists = Object.values(formValues).some(value => value == '');
        if (emptyExists) {
            setErrors(["No puede haber campos vacíos."]);
            return;
        }


        editExamMutation.mutate({
            ...formValues,
            startTime: new Date(formValues.startTime).toISOString(),
            endTime: new Date(formValues.endTime).toISOString(),
            visible,
            closed
        });
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
                        <NavLink to={`/cursos/${courseData.id}`} className="text-decoration-none text-muted mx-1">{courseData.title}</NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to={`/cursos/${courseData.id}/e/${examData.id}`} className="text-decoration-none text-muted mx-1">{examData.title}</NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold text-decoration-none text-muted mx-1">
                        Editar
                    </li>
                </ol>
            </nav>
            <h1>Actualizar examen</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="form-floating mb-3">
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="form-control"
                        placeholder="Su titulo"
                        defaultValue={examData.title}
                    />
                    <label htmlFor="title">Titulo</label>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input
                                id="maxGrade"
                                name="maxGrade"
                                type="number"
                                className="form-control"
                                placeholder="Nota maxima"
                                defaultValue={examData.maxGrade}
                            />
                            <label htmlFor="maxGrade">Nota máxima</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input
                                id="weight"
                                name="weight"
                                type="number"
                                className="form-control"
                                placeholder="Peso"
                                defaultValue={examData.weight}
                            />
                            <label htmlFor="weight">Peso</label>
                        </div>
                    </div>
                </div>


                <div className="form-floating mb-3">
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        placeholder="Descripción"
                        style={{ height: '100px' }}
                        defaultValue={examData.description}
                    />
                    <label htmlFor="description">Descripción</label>
                </div>


                <div className="row">
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input
                                id="startTime"
                                name="startTime"
                                type="datetime-local"
                                className="form-control"
                                placeholder="Hora de comienzo"
                                defaultValue={formatDateForInput(examData.startTime)}
                            />
                            <label htmlFor="startTime">Hora de comienzo</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input
                                id="endTime"
                                name="endTime"
                                type="datetime-local"
                                className="form-control"
                                placeholder="Hora de cierre"
                                defaultValue={formatDateForInput(examData.endTime)}
                            />
                            <label htmlFor="endTime">Hora de cierre</label>
                        </div>
                    </div>
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
                <LoadingButton loading={editExamMutation.isPending} className="btn btn-primary btn-block w-100">Actualizar</LoadingButton>
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