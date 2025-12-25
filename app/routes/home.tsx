import LoginForm from "~/Components/Auth/LoginForm";
import type { Route } from "./+types/home";
import './home.css';
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const [active, setActive] = useState<string>("login");

	return (
		<div className="main">
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
