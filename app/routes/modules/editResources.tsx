import { useContext } from "react";
import { ModuleContext } from "~/context/ModuleContext";

export default function AddResources() {
    const moduleData = useContext(ModuleContext)

    return (
        <div>
            <h1>Editar recursos para el modulo {moduleData?.title}</h1>
        </div>
    );
}