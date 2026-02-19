import { useState } from "react";
import type { FullUser, User } from "~/types/user";
import LoadingButton from "../LoadingButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "~/api";
import { getErrors } from "~/utils/error";
import type { AxiosError } from "axios";

export default function EditUserPassword({ user }: { user: FullUser }) {
    const [password, setPassword] = useState('');
    const queryClient = useQueryClient();

    const updateUserMutation = useMutation<User, AxiosError, { name?: string, email?: string, password: string }>({
        mutationFn: async data => {
            const response = await api.put("user/" + user.id, data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Sus cambios fueron guardados.");
            queryClient.setQueryData(['get_users_query'], (old: FullUser[]) => {
                return [...old.map(u => u.id == data.id ? { ...u, name: data.name, email: data.email } : u)]
            })
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);
            const errorMessage = (error.response?.data as any)?.error || error.message;
            toast.error(errorMessage);
        }
    });

    const handlePasswordChange = () => {
        if (confirm("Esta seguro que quiere cambiar la contraseña?")) {
            updateUserMutation.mutate({ name: user.name, email: user.email, password });
        }
    }
    return (
        <div>
            <div className="">
                <div className="form-floating w-100">
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="form-control"
                        id="floatingName"
                        placeholder="name"
                    />
                    <label htmlFor="floatingName">Nueva contraseña</label>
                </div>
                <LoadingButton
                    className="btn btn-primary mt-2"
                    loading={updateUserMutation.isPending}
                    onClick={handlePasswordChange}
                >Cambiar contraseña</LoadingButton>
            </div>
        </div>
    )
} 