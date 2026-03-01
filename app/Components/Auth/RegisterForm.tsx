import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import api from "~/api";
import LoadingButton from "../LoadingButton";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const registerMutation = useMutation<any, Error, { name: string, email: string, password: string }>({
        mutationKey: ["register_mutation"],
        mutationFn: async data => {
            const response = await api.post("auth/register", data);
            return response.data;
        },
        onSuccess(data) {
            localStorage.setItem("token", data.token);
            window.location.reload();
        },
        onError(error) {
            setError(isAxiosError(error) ? error.response?.data.error : error.message);
        },
        retry: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate({ name, email, password });
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="form-control"
                        id="name"
                        placeholder="name@example.com"
                    />
                    <label htmlFor="name">Nombre</label>
                </div>
                <div className="form-floating mb-3">
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
                <div className="form-floating mb-3">
                    <input type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="form-control" id="floatingPassword" placeholder="Password" />
                    <label htmlFor="floatingPassword">Contraseña</label>
                </div>
                <LoadingButton loading={registerMutation.isPending} className="btn btn-primary btn-block w-100">Crear cuenta</LoadingButton>
                {
                    error ?
                        <p className="text-danger mt-2">{error}</p>
                        :
                        ''
                }
            </form>
        </div>
    );
}