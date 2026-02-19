"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import api from "~/api";
import LoadingButton from "../LoadingButton";
import { toast } from "sonner";
import { createPortal } from 'react-dom';
import type { FullUser, User } from "~/types/user";
import { getErrors } from "~/utils/error";
import FormErrors from "../Error/FormErrors";
import { UserRole } from "~/types/roles";
import EditUserCourses from "./EditUserCourses";
import EditUserEnrollments from "./EditUserEnrollments";
import EditUserPassword from "./EditUserPassword";

type tabType = 'basic' | 'role' | 'password' | 'courses' | 'enrollments';
export default function EditUserModal({
    user
}: {
    user: FullUser
}) {
    const queryClient = useQueryClient();

    const [errors, setErrors] = useState<string[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);
    const openModalRef = useRef<HTMLButtonElement>(null);

    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState(user.name);

    const [roleToAdd, setRoleToAdd] = useState<string>();
    const [roleToRemove, setRoleToRemove] = useState<string>();

    const [tab, setTab] = useState<tabType>('basic');

    const updateUserMutation = useMutation<User, Error, { name?: string, email?: string }>({
        mutationFn: async data => {
            const response = await api.put("user/" + user.id, data);
            return response.data;
        },
        onSuccess: (data) => {
            toast("Sus cambios fueron guardados.");
            setErrors([]);
            queryClient.setQueryData(['get_users_query'], (old: FullUser[]) => {
                return [...old.map(u => u.id == data.id ? { ...u, name: data.name, email: data.email } : u)]
            })
        },
        onError: error => {
            const errors = getErrors(error);
            setErrors(errors);
        }
    });

    const addRoleMutation = useMutation<User, Error, { role: UserRole }>({
        mutationFn: async data => {
            const response = await api.post(`/user/${user.id}/add_role`, data);
            return response.data;
        },
        onSuccess: (data) => {
            toast("Sus cambios fueron guardados.");
            setErrors([]);
            queryClient.setQueryData(['get_users_query'], (old: FullUser[]) => {
                return [...old.map(u => u.id == data.id ? { ...u, roles: data.roles } : u)]
            });
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);

            toast(error.message);
        }
    });

    const removeRoleMutation = useMutation<User, Error, { role: UserRole }>({
        mutationFn: async data => {
            const response = await api.post(`/user/${user.id}/remove_role`, data);
            return response.data;
        },
        onSuccess: (data) => {
            toast("Sus cambios fueron guardados.");
            setErrors([]);
            queryClient.setQueryData(['get_users_query'], (old: FullUser[]) => {
                return [...old.map(u => u.id == data.id ? { ...u, roles: data.roles } : u)]
            });
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);
            toast.error(error.message);
        }
    });

    const handleRoleAdd = () => {
        if (!roleToAdd) {
            toast.error("Por favor seleccione un rol");
            return;
        }

        addRoleMutation.mutate({ role: Number(roleToAdd) })
    }

    const handleRoleRemove = () => {
        if (!roleToRemove) {
            toast.error("Por favor seleccione un rol");
            return;
        }

        removeRoleMutation.mutate({ role: Number(roleToRemove) })
    }

    const changeTabs = (tab: tabType) => {
        setTab(tab);
        setErrors([]);
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name == "") {
            setErrors(["Su nombre no puede estar vacio"])
        } else if (email == "") {
            setErrors(["Su correo no puede estar vacio"])
        } else {
            setErrors([]);
            updateUserMutation.mutate({ email, name })

        }
    }

    const roleWord = (role: UserRole): string => {
        switch (role) {
            case UserRole.admin:
                return "Administrador"
            case UserRole.professor:
                return "Profesor"
            case UserRole.student:
                return "Estudiante"
            default:
                return "Estudiante"
        }
    }

    return (
        <div>
            <button
                ref={openModalRef}
                data-bs-toggle="modal"
                data-bs-target={"#editUserModal" + user.id}
                className="btn btn-secondary"
            >
                <i className="bi bi-pencil me-2" />
                Editar
            </button>
            {typeof document !== 'undefined' && createPortal(<div ref={modalRef} className="modal fade" id={"editUserModal" + user.id} tabIndex={-1} aria-labelledby={"editUserModal" + user.id + "Label"} aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={"editUserModal" + user.id + "Label"}>Editar usuario</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <ul className="nav nav-underline nav-fill mb-4">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${tab === 'basic' && 'active'}`}
                                        onClick={() => setTab('basic')}
                                    >
                                        Informacion
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${tab === 'role' && 'active'}`}
                                        onClick={() => setTab('role')}
                                    >
                                        Rol
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${tab === 'password' && 'active'}`}
                                        onClick={() => setTab('password')}
                                    >
                                        Contrasena
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${tab === 'courses' && 'active'}`}
                                        onClick={() => setTab('courses')}
                                    >
                                        Cursos dictados
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${tab === 'enrollments' && 'active'}`}
                                        onClick={() => setTab('enrollments')}
                                    >
                                        Cursos inscriptos
                                    </button>
                                </li>
                            </ul>
                            {
                                (() => {
                                    switch (tab) {
                                        case 'basic':
                                            return (
                                                <form onSubmit={handleFormSubmit}>
                                                    <div className="form-floating mb-3">
                                                        <input type="text"
                                                            value={name}
                                                            onChange={e => setName(e.target.value)}
                                                            className="form-control"
                                                            id="floatingName"
                                                            placeholder="name"
                                                        />
                                                        <label htmlFor="floatingName">Nombre</label>
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

                                                    <LoadingButton
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        loading={updateUserMutation.isPending}
                                                    >
                                                        Guardar cambios
                                                    </LoadingButton>
                                                    {
                                                        errors.length != 0 && <FormErrors serverErrors={errors} />
                                                    }
                                                </form>
                                            )
                                        case 'role':
                                            return (
                                                <div className="mt-3">
                                                    <h5>Roles</h5>
                                                    <div className="hstack gap-2 mb-2">
                                                        {
                                                            user.roles.map((role, j) => {
                                                                switch (role) {
                                                                    case UserRole.admin:
                                                                        return <div className="badge rounded-pill text-bg-danger">
                                                                            Administrador
                                                                        </div>
                                                                    case UserRole.professor:
                                                                        return <div className="badge rounded-pill text-bg-success">
                                                                            Profesor
                                                                        </div>
                                                                    case UserRole.student:
                                                                        return <div className="badge rounded-pill text-bg-primary">
                                                                            Estudiante
                                                                        </div>
                                                                    default:
                                                                        break;
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <select onChange={e => setRoleToAdd(e.target.value)} className="form-select" aria-label="Default select example">
                                                            <option value="" selected>Seleccionar rol</option>
                                                            <option value={UserRole.admin}>Administrador</option>
                                                            <option value={UserRole.professor}>Profesor</option>
                                                            <option value={UserRole.student}>Estudiante</option>
                                                        </select>
                                                        <LoadingButton
                                                            onClick={handleRoleAdd}
                                                            loading={addRoleMutation.isPending}
                                                            className="btn btn-primary flex-shrink-0"
                                                        >
                                                            Agregar rol
                                                        </LoadingButton>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="subtitle">Eliminar rol</div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <select onChange={e => setRoleToRemove(e.target.value)} className="form-select" aria-label="Default select example">
                                                                <option value="" selected>Seleccionar rol a elminar</option>
                                                                {
                                                                    user.roles.map((role, j) => (
                                                                        <option value={role}>{roleWord(role)}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                            <LoadingButton
                                                                onClick={handleRoleRemove}
                                                                loading={removeRoleMutation.isPending}
                                                                className="btn btn-outline-danger flex-shrink-0"
                                                            >
                                                                Eliminar rol
                                                            </LoadingButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        case 'password':
                                            return <EditUserPassword user={user} />
                                        case 'courses':
                                            return <EditUserCourses user={user} />
                                        case 'enrollments':
                                            return <EditUserEnrollments user={user} />
                                        default:
                                            break;
                                    }
                                })()
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>, document.body)}

        </div>
    )
}