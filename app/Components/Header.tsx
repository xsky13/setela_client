import './styles/HeaderStyles.css'

export default function Header() {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }
    return (
        <nav className="navbar fixed-top navbar-expand-lg bg-dark " data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand h1 mb-0" href="#">Setela</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Inicio</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Cursos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Calendario</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="/cuenta" className="mx-2 nav-link">
                                Mi cuenta
                            </a>
                        </li>
                        <li className="nav-item my-1">
                            <button onClick={logout} className="btn btn-secondary">Cerrar sesion</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}