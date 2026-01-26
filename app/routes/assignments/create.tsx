import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "~/api";
import FormErrors from "~/Components/Error/FormErrors";
import LoadingButton from "~/Components/LoadingButton";
import type { Assignment } from "~/types/assignment";
import { getErrors } from "~/utils/error";

type AssignmentFormData = {
    title: string,
    textContent: string,
    maxGrade: number,
    weight: number,
    dueDate: string,
}
type AssignmentDTO = AssignmentFormData & {
    courseId: number
}

export default function CreateAssignment() {
    const params = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<string[]>([]);

    const createAssignmentMutation = useMutation<Assignment, Error, AssignmentDTO>({
        mutationKey: ['create_assignment_command'],
        mutationFn: async data => {
            const response = await api.post('/assignment', data);
            return response.data;
        },
        onSuccess(data) {
            setErrors([]);
            navigate(`/cursos/${params.id}/a/${data.id}?resourceCreation=true`);
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

        createAssignmentMutation.mutate({ ...formValues, courseId: Number(params.id) });
    }
    return (
        <div>
            <h1>Crear trabajo práctico</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="form-floating mb-3">
                    <input
                        id="title"
                        name="title"
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
                        type="date"
                        className="form-control"
                        placeholder="Su titulo"
                    />
                    <label htmlFor="dueDate">Fecha de entrega</label>
                </div>
                <div className="form-floating mb-3">
                    <textarea
                        id="textContent"
                        name="textContent"
                        className="form-control"
                        placeholder="Consigna"
                        style={{ height: '200px' }} />
                    <label htmlFor="textContent">Consigna</label>
                </div>
                <LoadingButton loading={createAssignmentMutation.isPending} className="btn btn-primary btn-block w-100">Crear</LoadingButton>
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