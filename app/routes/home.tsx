import { useContext } from "react";
import type { Route } from "../+types/root";
import { AuthContext } from "~/context/AuthContext";
import ProfessorView from "~/Components/Views/Home/ProfessorView";
import StudentView from "~/Components/Views/Home/StudentView";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Setela" },
        { name: "description", content: "Cursos teologicos" },
    ];
}


export default function Home() {
    const user = useContext(AuthContext);
    if (user == undefined) throw new Error("Hubo un error de servidor. Por favor intente de nuevo");

    const maxUserRole = (): number => Math.min(...user!.roles);

    const getMaxUserRole = (): string => {
        const maxUserRole = Math.min(...user!.roles);
        if (maxUserRole == 1) return "Admin • "
        if (maxUserRole == 2) return "Profesor/a • "
        else return "";
    }


    return (
        <>
            <div className="p-5 bg-primary border-4 border-bottom border-secondary text-white">
                <div className="container">
                    <h1>Bienvenido {user?.name}</h1>
                    <p>{getMaxUserRole()} Panel de control académico</p>
                </div>
            </div>
            <div className="container my-4">
                {
                    user?.roles.includes(2) &&
                    <div>
                        <h2>Materias enseñadas</h2>
                        <p>Gestiona y accede a tus cursos académicos</p>
                        <ProfessorView courses={user.professorCourses} />
                    </div>
                }
            </div>
            {
                maxUserRole() == 3 ?
                    <StudentView courses={user.enrollments} />
                    :
                    user?.enrollments.length != 0 && <StudentView courses={user.enrollments} />
            }
        </>
    );
}