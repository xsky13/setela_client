import { useContext } from "react";
import type { Route } from "../+types/root";
import { AuthContext } from "~/context/AuthContext";
import ProfessorView from "~/Components/Views/Home/ProfessorView";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Setela" },
        { name: "description", content: "Cursos teologicos" },
    ];
}


export default function Home() {
    const user = useContext(AuthContext);
    console.log(user);


    return (
        <>
            <div className="p-5 bg-primary border-4 border-bottom border-secondary text-white">
                <div className="container">
                    <h1>Bienvenido {user?.name}</h1>
                    <p>Profesor/a • Panel de control académico</p>
                </div>
            </div>
            <div className="container my-4">
                {
                    user?.roles.includes(2) &&
                    <div>
                        <h2>Mis cursos</h2>
                        <p>Gestiona y accede a tus cursos académicos</p>
                        <ProfessorView courses={user.professorCourses} />
                    </div>
                }
            </div>
        </>
    );
}