import { Link, NavLink } from 'react-router';
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
                            <NavLink className="nav-link active" aria-current="page" to="/">Inicio</NavLink>
                        </li>
                        <li className="nav-item d-flex align-items-center ">
                            {/* <i className="bi bi-journal-text text-body-tertiary"></i> */}
                            <NavLink className="nav-link" to="/cursos">Cursos</NavLink>
                        </li>
                        <li className="nav-item d-flex align-items-center ">
                            {/* <i className="bi bi-calendar3 text-body-tertiary"></i> */}
                            <NavLink className="nav-link" to="/calendario">Calendario</NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/cuenta" className="mx-4 d-flex align-items-center nav-link">
                                <i className="bi bi-person-circle me-1 text-body-tertiary"></i>
                                Mi cuenta
                            </NavLink>
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