import { useParams } from "react-router";

export default function AddResources() {
    const params = useParams();

    return (
        <div>
            <h1>Agregar recursos para el modulo {params.moduleId}</h1>
        </div>
    );
}