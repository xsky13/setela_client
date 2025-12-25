export default function LoginForm() {
    return (
            <div >
                <form action="">
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label htmlFor="floatingInput">Correo electrónico</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword">Contraseña</label>
                    </div>
                    <div className="btn btn-primary btn-block w-100">Iniciar sesion</div>
                </form>
            </div>
    );
}