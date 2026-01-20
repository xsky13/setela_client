import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "~/api";
import FormErrors from "~/Components/Error/FormErrors";
import LoadingButton from "~/Components/LoadingButton";
import { getErrors } from "~/utils/error";

export default function CreateModule() {
    const params = useParams();

    const [title, setTitle] = useState('');
    const [textContent, setTextContent] = useState('');
    const [error, setError] = useState("");
    let navigate = useNavigate();


    const [serverErrors, setServerErrors] = useState<any[]>([]);
    const createModuleMutation = useMutation<any, Error, { title: string, textContent: string, courseId: number }>({
        mutationKey: ['create_module_command'],
        mutationFn: async data => {
            const response = await api.post("/module", data);
            return response.data;
        },
        onSuccess(data) {
            navigate(`/cursos/${params.id}/m/${data.id}/recursos/modificar`)
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
            createModuleMutation.mutate({ title, textContent, courseId: parseInt(params.id!) })
        }
    }
    return (
        <div>
            <h1>Crear modulo</h1>
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
                <LoadingButton loading={createModuleMutation.isPending} className="btn btn-primary btn-block w-100">Continuar</LoadingButton>
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
    );
}