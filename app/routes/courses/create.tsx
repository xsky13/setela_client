import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import api from "~/api";
import FormErrors from "~/Components/Error/FormErrors";
import LoadingButton from "~/Components/LoadingButton";
import { type CourseSimple } from "~/types/course";
import { getErrors } from "~/utils/error";

export default function CreateCourse() {
    const [errors, setErrors] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");

    const navigate = useNavigate();

    const createCourseMutation = useMutation<CourseSimple, Error, { title: string, description: string }>({
        mutationFn: async data => {
            const response = await api.post("/course", data);
            return response.data;
        },
        onError(error) {
            const errors = getErrors(error);
            setErrors(errors);
        },
        onSuccess(data) {
            navigate("/cursos/" + data.id);
        }
    })

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        createCourseMutation.mutate({ title, description });
    }


    return (
        <div className="d-flex flex-column justify-content-center align-items-center pt-5">
            <div className="w-50">
                <h1>Crear curso</h1>
                <form onSubmit={handleCreate}>
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
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="form-control"
                            id="description"
                            placeholder="Contentido"
                            style={{ height: '200px' }} />
                        <label htmlFor="description">Descripcion</label>
                    </div>
                    <LoadingButton loading={createCourseMutation.isPending} className="btn btn-primary btn-block w-100">Continuar</LoadingButton>


                    {
                        errors.length != 0 ?
                            <FormErrors serverErrors={errors} />
                            :
                            ''
                    }
                </form>
            </div>
        </div>
    )
}