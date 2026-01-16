import { useMutation } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import { getErrors } from "~/utils/error";

export default function ModuleListing({ id, title, currentUserIsOwner, removeItemFromListing }: { id: number, title: string, currentUserIsOwner: boolean, removeItemFromListing: (itemKey: string) => void }) {

    const deleteModuleMutation = useMutation<any, Error>({
        mutationKey: ['delete_module_command'],
        mutationFn: async () => {
            const response = await api.delete("/module/" + id);
            return response.data;
        },
        onSuccess() {
            removeItemFromListing("m-" + id)
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);
            toast(error.message);
        },
        retry: 1
    });

    const deleteModule = () => {
        if (confirm("Esta seguro que quiere eliminar este modulo? Esta acción es irreversible")) {
            deleteModuleMutation.mutate();
        }
    }
    return (
        <div className="d-flex justify-content-between rounded-2 border border  p-4 my-3">
            <div>
                <div className="bg-white border-0 mb-2">
                    <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-primary-emphasis bg-primary-subtle text-uppercase small">
                        <i className="bi bi-book me-2"></i>
                        Modulo
                    </span>
                </div>
                <NavLink to={`./m/${id}`} className="h5 card-title text-decoration-none">{title}</NavLink>
            </div>
            <div>
                <button className="btn btn-light float-end mb-2">
                    <i className='bi bi-check-circle me-2'></i>
                    Marcar finalizado
                </button>
                {
                    currentUserIsOwner &&
                    <div className="dropdown">
                        <button
                            className="btn btn-primary dropdown-toggle d-flex align-items-center"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-gear-fill me-2" />
                            <span className="me-2">Configuraciones</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><NavLink className="dropdown-item" to="./m/crear">
                                <i className="bi bi-pencil me-2" />
                                Editar
                            </NavLink></li>
                            <li><button className="dropdown-item text-danger" onClick={deleteModule}>
                                <i className="bi bi-trash-fill me-2" />
                                Eliminar</button></li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
}