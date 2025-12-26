import LoginForm from "~/Components/Auth/LoginForm";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "~/api";


export default function Authenticate() {
    const [active, setActive] = useState<string>("login");

    return (
        <div className="fullscreen">
            <div className="w-25">
                <ul className="nav nav-underline">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${active == "login" && "active"}`}
                            aria-current="page"
                            onClick={() => setActive("login")}
                        >
                            Iniciar sesión
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${active == "register" && "active"}`}
                            onClick={() => setActive("register")}
                        >
                            Registrarse
                        </button>
                    </li>
                </ul>

                <div className="my-3">
                    {
                        active == "login" ?
                            <LoginForm />
                            :
                            ''
                    }
                </div>
            </div>
        </div>
    )
}
