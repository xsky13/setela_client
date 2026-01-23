import { AxiosError } from "axios";


export default function ErrorSegment({ status = 400 }: { status: number | false | undefined }) {
    switch (status) {
        case 404:
            return (
                <div className="pt-5 d-flex justify-content-center align-items-center">
                    <div>
                        <h1>Error 404</h1>
                        <p>La pagina que esta buscando no existe.</p>
                    </div>
                </div>
            )
        default:
            return (
                <div className="pt-5 d-flex justify-content-center align-items-center">
                    <div>
                        <h1>Hubo un error</h1>
                        <p>Por favor, reinicie la página e intente de nuevo. Si el error persiste, contactese con el administrador.</p>
                    </div>
                </div>
            )
    }
}