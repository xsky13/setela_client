import { NavLink } from "react-router";

export default function ResourceListing({
    id,
    url,
    linkText,
    resourceType
}: {
    id: number,
    url: string,
    linkText: string,
    resourceType: number
}) {
    return (
        <div className="d-flex justify-content-between rounded-2 border border  p-4 my-3">
            <div>
                <div className="bg-white border-0 mb-2">
                    <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-primary-emphasis bg-primary-subtle text-uppercase small">
                        {
                            (() => {
                                switch (resourceType) {
                                    case 1:
                                        return <>
                                            <i className="bi bi-box-arrow-up-right me-2"></i>
                                            Enlace
                                        </>
                                    case 2:
                                        return <>
                                            <i className="bi bi-file-earmark-image-fill me-2"></i>
                                            Imagen
                                        </>
                                    case 3:
                                        return <>
                                            <i className="bi bi-file-earmark me-2"></i>
                                            Recurso
                                        </>
                                    default:
                                        break;
                                }
                            })()
                        }
                    </span>
                </div>
                {
                    (() => {
                        switch (resourceType) {
                            case 1:
                                return <NavLink to={url} target="_blank" className="h5 card-title">{linkText || url}</NavLink>
                            case 2:
                                // should open up a popup with image
                                return <NavLink to={url} className="h5 card-title text-decoration-none">{linkText || url}</NavLink>
                            case 3:
                                return <NavLink to={url} target="_blank" className="h5 card-title text-decoration-none">{linkText || url}</NavLink>
                            default:
                                break;
                        }
                    })()
                }
            </div>
            <div>
                <button className="btn btn-light">
                    <i className='bi bi-check-circle me-2'></i>
                    Marcar finalizado
                </button>
            </div>
        </div>
    );
}