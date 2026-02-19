"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import api from "~/api";
import { ResourceType } from "~/types/resourceTypes";
import LoadingButton from "../LoadingButton";
import { toast } from "sonner";
import { closeModal } from "~/utils/modal";
import type { FullCourse, Module, ResourceListing } from "~/types/course";
import { createPortal } from 'react-dom';
import { useSearchParams } from "react-router";
import type { Assignment, AssignmentSubmissionFull } from "~/types/assignment";
import type { ExamDataView } from "~/types/exam";
import { CourseContext } from "~/context/CourseContext";
import type { FullUser } from "~/types/user";
import { getErrors } from "~/utils/error";
import FormErrors from "../Error/FormErrors";

export default function EditUserModal({
    user
}: {
    user: FullUser
}) {
    const [errors, setErrors] = useState<string[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);
    const openModalRef = useRef<HTMLButtonElement>(null);

    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState(user.name);

    const updateUserMutation = useMutation<any, Error, { name?: string, email?: string }>({
        mutationFn: async data => {
            const response = await api.put("user/" + user.id, data);
            return response.data;
        },
        onSuccess: () => {
            toast("Sus cambios fueron guardados.");
            setErrors([]);
        },
        onError: error => {
            const errors = getErrors(error);
            setErrors(errors);
        }
    });


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
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={"editUserModal" + user.id + "Label"}>Editar usuario</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
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