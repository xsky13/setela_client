import { useParams, useSearchParams } from "react-router";

export default function AddResources() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <div>
            {
                searchParams.get("create") ?
                    <h1>Agregar recursos para el modulo {params.moduleId}</h1>
                    :
                    <h1>Editar recursos para el modulo {params.moduleId}</h1>

            }
        </div>
    );
}