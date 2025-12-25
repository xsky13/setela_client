import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<div>
			<div className="container">
				<div className="card">
					<div className="card-header">Featured</div>
					<div className="card-body">
						<h5 className="card-title">Special title treatment</h5>

						<div className="pt-2"><a href="#" className="btn btn-primary btn-sm">Go somewhere</a>
							<a href="#" className="btn btn-outline-primary  btn-sm">Marcar visto
							</a></div>

					</div>
				</div>
				<button className="btn btn-primary">Button</button>
				<div className="my-3">
					<label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
					<input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
				</div>
				<div className="my-3">
					<div className="form-floating mb-3">
						<input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
							<label htmlFor="floatingInput">Ingrese su email</label>
					</div>
				</div>
			</div>
		</div>
	)
}
