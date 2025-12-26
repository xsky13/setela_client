import './styles/HeaderStyles.css'

export default function Header() {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }
    return (
        <nav className="navbar fixed-top navbar-expand-lg bg-dark border-2 border-bottom border-secondary" data-bs-theme="dark">
            <div className="container-fluid">
                <div className="d-flex align-items-center">
                    <i className="bi bi-house-fill text-white me-1"></i>
                    <a className="navbar-brand h1 mb-0 me-2" href="#">Setela</a>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item d-flex align-items-center ">
                            {/* <i className="bi bi-house-fill text-white"></i> */}
                            <a className="nav-link active" aria-current="page" href="#">Inicio</a>
                        </li>
                        <li className="nav-item d-flex align-items-center ">
                            {/* <i className="bi bi-journal-text text-body-tertiary"></i> */}
                            <a className="nav-link" href="#">Cursos</a>
                        </li>
                        <li className="nav-item d-flex align-items-center ">
                            {/* <i className="bi bi-calendar3 text-body-tertiary"></i> */}
                            <a className="nav-link" href="#">Calendario</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="/cuenta" className="mx-4 d-flex align-items-center nav-link">
                                <i className="bi bi-person-circle me-1 text-body-tertiary"></i>
                                Mi cuenta
                            </a>
                        </li>
                        <li className="nav-item my-1">
                            <button onClick={logout} className="btn btn-secondary">
                                <i className="bi bi-box-arrow-right me-1"></i>Cerrar sesion</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}