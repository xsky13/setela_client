import axios, { AxiosError } from "axios";

// http://localhost:5182/api
// https://localhost:7111/api
const api = axios.create({
    baseURL: "http://localhost:5182/api",
});

api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        for (const [, value] of config.data.entries()) {
            if (value instanceof File && value.size > 100 * 1024 * 1024) {
                const error = new AxiosError("El archivo es demasiado grande. Maximo 100MB.");
                (error as any).isClientError = true;
                return Promise.reject(error);
            }
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 404:
                    error.message = "404 • El recurso que estaba buscando no se pudo encontrar";
                    break;
                case 401:
                    error.message = "401 • No está autorizado para realizar esta acción";
                    break;
                case 403:
                    error.message = "403 • No está autorizado para realizar esta acción";
                    break;
                case 500:
                    error.message = "500 • Ocurrió un error en el servidor";
                    break;
                default:
                    error.message = "400 • Ocurrió un error inesperado";
            }
        } else if (error.request) {
            error.message = "No se pudo conectar con el servidor";
        } else {
            if (!(error as any).isClientError) {
                error.message = "Error desconocido al realizar la solicitud";
            }
        }
        return Promise.reject(error);
    }
);


api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    } else {
        // Delete it to be safe, letting the browser set multipart/form-data + boundary
        delete config.headers["Content-Type"];
    }
    return config;
});

export default api;