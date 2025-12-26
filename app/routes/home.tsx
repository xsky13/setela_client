import { useContext } from "react";
import type { Route } from "../+types/root";
import { AuthContext } from "~/context/AuthContext";
import LoadingButton from "~/Components/LoadingButton";

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
        <div className="container">
            <h1>Bienvenido {user?.name}</h1>
        </div>
    );
}