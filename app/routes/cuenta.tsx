import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useContext, useState } from "react";
import { toast } from "sonner";
import api from "~/api";
import LoadingButton from "~/Components/LoadingButton";
import { AuthContext } from "~/context/AuthContext";
import { getErrors } from "~/utils/error";
import type { Route } from "./+types/cuenta";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Mi cuenta  | Setela" },
        { name: "description", content: "Cursos teologicos" },
    ];
}

export default function Cuenta() {
    const user = useContext(AuthContext);
    if (user == undefined) throw new Error("No hay usuario");

    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState(user.name);
    const [error, setError] = useState("");

    const [serverErrors, setServerErrors] = useState<any[]>([]);

    const updateUserMutation = useMutation<any, Error, { name?: string, email?: string }>({
        mutationFn: async data => {
            const response = await api.put("user/" + user.id, data);
            return response.data;
        },
        onSuccess: () => {
            toast("Sus cambios fueron guardados.");
            setServerErrors([]);
        },
        onError: error => {
            const errors = getErrors(error);
            setServerErrors(errors);
        }
    });


    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (name == "") {
            setError("Su nombre no puede estar vacio")
        } else if (email == "") {
            setError("Su correo no puede estar vacio")
        } else {
            setError("");
            updateUserMutation.mutate({ email, name })

        }
    }
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="w-25">
                <div className="pt-5">
                    <h1>Mi cuenta</h1>
                </div>
                <form onSubmit={handleLoginSubmit}>
                    <div className="form-floating mb-4">
                        <input type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="form-control" id="floatingName" placeholder="name" />
                        <label htmlFor="floatingName">Nombre</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="form-control"
                            id="email"
                            placeholder="name@example.com"
                        />
                        <label htmlFor="email">Correo electrónico</label>
                    </div>

                    <div className="my-2">
                        <div className="fw-semibold text-uppercase text-muted small">Opcional</div>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            className="form-control"
                            id="phoneNumber"
                            placeholder="name@example.com"
                        />
                        <label htmlFor="phoneNumber">Numero de telefono</label>
                    </div>
                    <LoadingButton loading={updateUserMutation.isPending} className="btn btn-primary btn-block w-100">Guardar cambios</LoadingButton>
                    {
                        error ?
                            <p className="text-danger mt-2">{error}</p>
                            :
                            ''
                    }

                    {
                        serverErrors.length != 0 ?
                            <div className="rounded-2 bg-body-tertiary px-3 py-2 text-danger-emphasis bg-danger-subtle mt-3">
                                <span className="fw-semibold">Ocurrieron los siguientes errores:</span>
                                <ul>
                                    {
                                        serverErrors.map(err => <li>{err}</li>)
                                    }
                                </ul>

                            </div>
                            :
                            ''
                    }
                </form>
            </div>
        </div>
    );
}