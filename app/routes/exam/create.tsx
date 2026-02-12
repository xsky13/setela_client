import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import FormErrors from "~/Components/Error/FormErrors";
import LoadingButton from "~/Components/LoadingButton";
import type { Exam } from "~/types/exam";
import { getErrors } from "~/utils/error";

type ExamRequest = {
    title: string,
    description: string,
    maxGrade: number,
    weight: number,
    startTime: string,
    endTime: string,
    courseId: number
}


export default function CreateExam() {
    const navigate = useNavigate();
    const params = useParams();
    const [errors, setErrors] = useState<string[]>([]);
    
    
    const createExamMutation = useMutation<Exam, Error, ExamRequest>({
        mutationKey: ["create_exam_command"],
        mutationFn: async data => {
            const response = await api.post("/exam", data);
            return response.data;
        },
        onError(error) {
            const errors = getErrors(error);
            setErrors(errors);
        },
        onSuccess(data) {
            setErrors([]);
            navigate(`/cursos/${params.id}/e/${data.id}?resourceCreation=true`);
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


        createExamMutation.mutate({ 
            ...formValues,
            startTime: new Date(formValues.startTime).toISOString(),
            endTime: new Date(formValues.endTime).toISOString(),
            courseId: Number(params.id)
        });
    }
    return (
        <div>
            <h1>Crear examen</h1>
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
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        placeholder="Descripción"
                        style={{ height: '100px' }} />
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
                            />
                            <label htmlFor="endTime">Hora de cierre</label>
                        </div>
                    </div>
                </div>

                <LoadingButton loading={createExamMutation.isPending} className="btn btn-primary btn-block w-100">Crear</LoadingButton>
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