import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import api from "~/api";
import LoadingButton from "../LoadingButton";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginMutation = useMutation<any, Error, { email: string, password: string }>({
        mutationFn: async data => {
            const response = await api.post("auth/login", data);
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

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    }
    return (
        <div>
            <form onSubmit={handleLoginSubmit}>
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
                <LoadingButton loading={loginMutation.isPending} className="btn btn-primary btn-block w-100">Iniciar sesion</LoadingButton>
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