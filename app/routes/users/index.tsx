import { useQuery } from "@tanstack/react-query"
import api from "~/api"
import ErrorSegment from "~/Components/Error/ErrorSegment";
import LoadingSegment from "~/Components/Loading/LoadingSegment";
import { UserRole } from "~/types/roles";
import type { FullUser } from "~/types/user";
import type { Route } from "./+types";
import { useContext } from "react";
import { AuthContext } from "~/context/AuthContext";
import { Navigate } from "react-router";
import EditUserModal from "~/Components/Users/EditUserModal";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Administrar usuarios | Setela" },
        { name: "description", content: "Cursos teologicos" },
    ];
}

export default function UserList() {
    const user = useContext(AuthContext);
    if (!user) throw new Error("Usuario no existe");

    if (!user.roles.includes(UserRole.admin)) return <Navigate to={"/"} />
    
    const { data: users, isError, error, isLoading } = useQuery<FullUser[]>({
        queryKey: ['get_users_query'],
        queryFn: async () => (await api.get("/user")).data,
        retry: 1
    });
    

    if (isLoading) return <LoadingSegment />;
    if (isError) return <ErrorSegment status={400} />

    return (
        <div className="container pt-4">
            <h1>Usuarios</h1>
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th scope="col" className="py-3 px-4 subtitle">Nombre</th>
                        <th scope="col" className="py-3 px-4 subtitle">Rol</th>
                        <th scope="col" className="py-3 px-4 text-center subtitle">Cursos inscriptos</th>
                        <th scope="col" className="py-3 px-4 text-center subtitle">Cursos dictados</th>
                        <th scope="col" className="py-3 px-4 subtitle">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users.length &&
                        users.map((u, i) => (
                            <tr className="" key={i}>
                                <td className="py-3 px-4 fw-semibold">{u.name}</td>
                                <td className="py-3 px-4 align-middle">
                                    <div className="d-inline-flex flex-wrap gap-2">
                                        {
                                            u.roles.map((role, j) => {
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
                                </td>
                                <td className="py-3 px-4 fs-5 text-center serif fw-bold">{u.enrollments.length}</td>
                                <td className="py-3 px-4 fs-5 text-center serif fw-bold">{u.professorCourses.length}</td>
                                <td className="py-3 px-4 ">
                                    <EditUserModal user={u} />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}