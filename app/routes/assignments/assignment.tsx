import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import AssignmentSubmissionListing from "~/Components/AssignmentSubmissions/AssignmentSubmissionListing";
import ResourceListing from "~/Components/Courses/Course/ResourceListing";
import LoadingButton from "~/Components/LoadingButton";
import AddResourcesModal from "~/Components/Resource/AddResourcesModal";
import { AssignmentContext } from "~/context/AssignmentContext";
import { AuthContext } from "~/context/AuthContext";
import { CourseContext } from "~/context/CourseContext";
import type { AssignmentSubmission } from "~/types/assignment";
import { formatDate } from "~/utils/date";
import { getErrors } from "~/utils/error";

export default function Assignment() {
    const assignmentData = useContext(AssignmentContext);
    const currentUser = useContext(AuthContext);

    const [timeLeft, setTimeLeft] = useState(0);
    const [expired, setExpired] = useState(false);

    const [currentUserSubmitted, setCurrentUserSubmitted] = useState(false);
    const [userSubmission, setUserSubmission] = useState<AssignmentSubmission | null>(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const courseData = useContext(CourseContext);

    if (!courseData || !assignmentData) throw new Error("Hubo un error.");

    useEffect(() => {
        const dueDate = new Date(assignmentData.dueDate).getTime();
        const now = new Date().getTime();

        const diffInMs = dueDate - now;
        setTimeLeft(Math.floor(diffInMs / (1000 * 60 * 60 * 24)));

        if (now > dueDate) setExpired(true);

        if (assignmentData.assignmentSubmissions.some(a => a.sysUser.id == currentUser?.id)) {
            const submission = assignmentData.assignmentSubmissions.filter(a => a.sysUser.id == currentUser?.id);
            setCurrentUserSubmitted(true);
            setUserSubmission(submission[0]);
        }


    }, [assignmentData]);

    const deleteAssignmentMutation = useMutation<any, Error>({
        mutationKey: ['delete_assignment_command'],
        mutationFn: async () => {
            const response = await api.delete("/assignment/" + assignmentData.id);
            return response.data;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['getCourseQuery'] });
            navigate(`/cursos/${courseData?.id}`);
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);
            toast(error.message);
        },
        retry: 1
    });

    const deleteAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm("Esta seguro que quiere eliminar este trabajo práctico? Esta acción es irreversible")) {
            deleteAssignmentMutation.mutate();
        }
    }


    return (
        <div>
            <nav
                style={{
                    '--bs-breadcrumb-divider': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E\")"
                } as React.CSSProperties}
                aria-label="breadcrumb"
            >
                <ol className="breadcrumb">
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to="/" className="text-decoration-none text-muted">
                            <i className="bi bi-house-fill me-1" />
                        </NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to={`/cursos/${courseData!.id}`} className="text-decoration-none text-muted mx-1">{courseData?.title}</NavLink>
                    </li>
                    <li className="breadcrumb-item small fw-semibold">
                        <NavLink to={`/cursos/${courseData!.id}/a/${assignmentData.id}`} className="text-decoration-none text-muted mx-1">{assignmentData?.title}</NavLink>
                    </li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center">
                <h1>{assignmentData.title}</h1>
                {
                    courseData?.currentUserIsOwner &&
                    <div className="my-2 d-flex">
                        <AddResourcesModal
                            parentId={assignmentData.id}
                            courseId={assignmentData.courseId}
                            type="assignment"
                        />
                        <NavLink to="editar" className="btn btn-light mx-2"><i className="bi bi-pencil me-1" /> Editar</NavLink>
                        <LoadingButton
                            loading={deleteAssignmentMutation.isPending}
                            onClick={deleteAssignment}
                            className="btn btn-danger"
                        >
                            <i className="bi bi-trash me-1" />
                            Eliminar
                        </LoadingButton>
                    </div>
                }
            </div>
            <div className="mt-3">
                <div className="alert alert-warning alert-warning-custom">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-exclamation-triangle-fill text-warning fs-4"></i>
                        <div className="ms-2">
                            <strong>Fecha de vencimiento: {formatDate(assignmentData.dueDate)}</strong>
                            <p className="mb-0 small mt-1">Quedan {timeLeft} días para la entrega</p>
                        </div>
                    </div>
                </div>
            </div>
            {
                assignmentData.textContent &&
                <div className="mt-5 px-3 py-2 m-0 rounded-1 bg-body-tertiary">
                    <h3>Consigna</h3>
                    <p>
                        {assignmentData.textContent}
                    </p>
                </div>
            }
            {
                assignmentData.resources.length != 0 &&
                <div className="mt-5">
                    <h3>Recursos y materiales</h3>
                    {
                        assignmentData.resources.map(resource => (
                            <ResourceListing resource={resource} currentUserIsOwner={courseData.currentUserIsOwner} />
                        ))
                    }
                </div>
            }
            <div className="mt-4">
                <h3>Información del trabajo</h3>
                <ul className="list-group">
                    {
                        courseData.currentUserIsOwner &&
                        <li className="list-group-item">
                            <span className="subtitle small">Estado</span>
                            <div className="d-flex my-1">
                                <div className="badge rounded-pill text-bg-primary">
                                    {assignmentData.visible ?
                                        <>
                                            <i className="bi bi-eye" />
                                            <span className="ms-1">Visible</span>
                                        </> : <>
                                            <i className="bi bi-eye-slash" />
                                            <span className="ms-1">No visible</span>
                                        </>}
                                </div>
                                <div className="badge rounded-pill text-bg-success ms-2">
                                    {assignmentData.closed ?
                                        <>
                                            <i className="bi bi-lock-fill" />
                                            <span className="ms-1">Cerrado</span>
                                        </> : <>
                                            <i className="bi bi-unlock-fill" />
                                            <span className="ms-1">Abierto</span>
                                        </>}
                                </div>

                            </div>
                        </li>
                    }
                    <li className="list-group-item">
                        <span className="subtitle small">Nota maxima</span>
                        <div className="fs-4 fw-semibold">
                            {assignmentData.maxGrade}
                        </div>
                    </li>
                    {
                        !courseData.currentUserIsOwner &&
                        <li className="list-group-item">
                            <span className="subtitle small">Estado de entrega</span>
                            <div className={`fw-semibold fs-5 ${currentUserSubmitted ?
                                'text-success'
                                : expired ? 'text-danger' : 'text-warning'
                                }`}>
                                {
                                    currentUserSubmitted ?
                                        <div className="my-1">
                                            <i className="bi-check-circle-fill"></i>
                                            <span className="ms-2">Entregado</span>
                                        </div>
                                        :
                                        expired ?
                                            <div className="my-1">
                                                <i className="bi-exclamation-circle-fill"></i>
                                                <span className="ms-2">Tarde</span>
                                            </div>
                                            :
                                            <div className="my-1">
                                                <i className="bi-exclamation-triangle-fill"></i>
                                                <span className="ms-2">Pendiente</span>
                                            </div>
                                }
                            </div>
                        </li>
                    }
                    {
                        !courseData.currentUserIsOwner &&
                        <li className="list-group-item">
                            <span className="subtitle small">Hora de entrega</span>
                            {
                                !currentUserSubmitted ?
                                    <div className="my-1">
                                        <i className="text-muted">Todavía no hay entrega.</i>
                                    </div>
                                    :
                                    <div className="text-muted small my-1">
                                        <i className="bi bi-clock" />
                                        <span className="ms-2">{formatDate(userSubmission?.creationDate)}</span>
                                    </div>
                            }
                        </li>
                    }
                    {
                        !courseData.currentUserIsOwner &&
                        <li className="list-group-item">
                            <span className="subtitle small">Nota</span>
                            {
                                currentUserSubmitted ?
                                    userSubmission?.grade ?
                                        <div className="my-1 fs-4 fw-semibold text-primary">
                                            {userSubmission.grade}
                                        </div>
                                        :
                                        <div className="my-1">
                                            <i className="text-muted">Todavía no hay nota.</i>
                                        </div>
                                    :
                                    <div className="my-1">
                                        <i className="text-muted">Todavía no hay nota.</i>
                                    </div>
                            }
                        </li>
                    }
                    {
                        courseData.currentUserIsOwner &&
                        <li className="list-group-item">
                            <span className="subtitle small">Entregas por corregir</span>
                            <div className="my-1 fs-4 fw-semibold">
                                {assignmentData.assignmentSubmissions.filter(a => !a.grade).length}
                            </div>
                        </li>
                    }
                </ul>
            </div>

            {
                courseData.currentUserIsOwner &&
                <div className="my-5">
                    <h2>Entregas</h2>
                    {
                        assignmentData.assignmentSubmissions.length ?
                            <table className="table table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">Nro</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Hora de entrega</th>
                                        <th scope="col">Ultima actualizacion</th>
                                        <th scope="col">Nota</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        assignmentData.assignmentSubmissions.map((assignmentSubmission, i) => (
                                            <AssignmentSubmissionListing
                                                assignmentSubmission={assignmentSubmission}
                                                assignment={assignmentData}
                                                key={i}
                                            />
                                        ))
                                    }
                                </tbody>
                            </table>
                            :
                            <i className="text-muted">
                                <i className="bi bi-exclamation-triangle-fill"></i>
                                <span className="ms-2">Todavía no hay entregas para este trabajo.</span>
                            </i>
                    }
                    {/* {
                        assignmentData.assignmentSubmissions.map(assignmentSubmission => (
                            <AssignmentSubmissionListing assignmentSubmission={assignmentSubmission} />
                        ))
                    } */}
                </div>
            }
        </div>
    );
}