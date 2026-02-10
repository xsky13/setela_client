import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import AssignmentExtraInfo from "~/Components/Assignments/AssignmentExtraInfo";
import AssignmentInfo from "~/Components/Assignments/AssignmentInfo";
import AssignmentUpload from "~/Components/Assignments/AssignmentUpload";
import AssignmentSubmissionListing from "~/Components/AssignmentSubmissions/AssignmentSubmissionListing";
import ResourceListing from "~/Components/Courses/Course/ResourceListing";
import LoadingButton from "~/Components/LoadingButton";
import AddResourcesModal from "~/Components/Resource/AddResourcesModal";
import { AssignmentContext } from "~/context/AssignmentContext";
import { AuthContext } from "~/context/AuthContext";
import { CourseContext } from "~/context/CourseContext";
import { formatDate } from "~/utils/date";
import { getErrors } from "~/utils/error";

export default function Assignment() {
    const assignmentData = useContext(AssignmentContext);
    const currentUser = useContext(AuthContext);
    const courseData = useContext(CourseContext);
    if (!assignmentData || !currentUser || !courseData) throw new Error("Hubo un error.");

    const [assignmentBlock, setAssignmentBlock] = useState<'total' | 'corrected' | 'pending'>('total');
    const [searchTerm, setSearchTerm] = useState('');

    const assignmentSubmissions = useMemo(() => {
        let list;
        switch (assignmentBlock) {
            case 'corrected':
                list = assignmentData.assignmentSubmissions.filter(a => a.grade?.value);
                break;
            case 'pending':
                list = assignmentData.assignmentSubmissions.filter(a => !a.grade?.value);
                break;
            case 'total':
            default:
                list = assignmentData.assignmentSubmissions;
                break;

        }

        if (searchTerm.trim() != "") {
            list = list.filter(a => a.sysUser.name.toLowerCase().includes(searchTerm));
        }
        return list;
    }, [assignmentBlock, assignmentData.assignmentSubmissions, searchTerm]);

    const dueDate = new Date(assignmentData.dueDate).getTime();
    const now = new Date().getTime();
    const expired = now > dueDate;
    const diffInMs = dueDate - now;
    const timeLeft = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const totalSubmissions = assignmentData.assignmentSubmissions.length;
    const totalCorrected = assignmentData.assignmentSubmissions.filter(a => a.grade?.value).length;
    const totalUncorrected = assignmentData.assignmentSubmissions.filter(a => !a.grade?.value).length;

    const sumGrades = assignmentData.assignmentSubmissions
        .reduce((acc, submission) => acc + (submission.grade ? submission.grade.value : 0), 0);
    const average = sumGrades / totalCorrected;

    const userSubmission = assignmentData.assignmentSubmissions.find(
        a => a.sysUserId === currentUser.id
    ) || null;

    const currentUserSubmitted = !!userSubmission;

    const navigate = useNavigate();
    const queryClient = useQueryClient();


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

    if (!courseData.currentUserIsOwner && !assignmentData.visible) {
        return (
            <div className="d-flex gap-4 align-items-center">
                <NavLink to={"/cursos/" + courseData.id} className="btn d-block btn-secondary">
                    <i className="bi bi-chevron-left me-2"></i>
                    Volver al curso
                </NavLink>
                <h1 style={{ margin: 0 }}>Esta asignatura no esta disponible.</h1>
            </div>
        )
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
            <div className="d-flex justify-content-between align-items-start">
                <h1>{assignmentData.title}</h1>
                <div className="my-2">
                    {
                        courseData?.currentUserIsOwner &&
                        <div className="d-flex">
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
            </div>



            <div className="mt-3 d-flex gap-4">
                <div className={`alert alert-${expired ? "danger" : "warning"} col`}>
                    <div className="d-flex align-items-center gap-2">
                        <i className={`bi bi-exclamation-${expired ? "circle" : "triangle"}-fill text-${expired ? "danger" : "warning"} fs-4`}></i>
                        <div className="ms-2">
                            <strong>Fecha de vencimiento: {formatDate(assignmentData.dueDate)}</strong>
                            <p className="mb-0 small mt-1">
                                {
                                    expired ?
                                        'Este trabajo esta vencido.'
                                        :
                                        <span>Quedan {timeLeft} días para la entrega</span>
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <AssignmentExtraInfo currentUserIsOwner={courseData.currentUserIsOwner} assignmentData={assignmentData} />
                </div>

            </div>
            <div className="mt-5 px-3 py-2 rounded-1 bg-body-tertiary border">
                <h3>Consigna</h3>
                <p>
                    {assignmentData.textContent}
                </p>
                {
                    assignmentData.resources.length != 0 &&
                    <div className="mt-4">
                        <div className="subtitle">Recursos y materiales</div>
                        {
                            assignmentData.resources.map(resource => (
                                <ResourceListing resource={resource} currentUserIsOwner={courseData.currentUserIsOwner} />
                            ))
                        }
                    </div>
                }
            </div>

            {
                !courseData.currentUserIsOwner &&
                <div className="mt-5">
                    <AssignmentUpload
                        assignmentData={assignmentData}
                        action="create"
                    />
                    <AssignmentInfo
                        assignmentData={assignmentData}
                        currentUserIsOwner={courseData.currentUserIsOwner}
                        currentUserSubmitted={currentUserSubmitted}
                        expired={expired}
                        userSubmission={userSubmission}
                    />
                </div>
            }

            {
                courseData.currentUserIsOwner &&
                <>
                    <div className="my-5 border border-2 border-primary rounded-3 px-4 py-3">
                        <h2>Entregas</h2>

                        {/* <div className="hstack gap-5 mb-3">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-people-fill text-primary fs-4"></i>
                                <div className="ms-3">
                                    <span className="fs-3 fw-bold text-primary-emphasis">{totalSubmissions}</span>
                                    <div className="small text-muted">Total entregas</div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <i className="bi bi-check-circle-fill text-success fs-4"></i>
                                <div className="ms-3">
                                    <span className="fs-3 fw-bold text-success-emphasis">{totalCorrected}</span>
                                    <div className="small text-muted">Entregas corregidas</div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <i className="bi bi-clock-history text-warning fs-4"></i>
                                <div className="ms-3">
                                    <span className="fs-3 fw-bold text-warning-emphasis">{totalUncorrected}</span>
                                    <div className="small text-muted">Pendientes</div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <i className="bi bi-graph-up text-info fs-4"></i>
                                <div className="ms-3">
                                    <span className="fs-3 fw-bold text-info-emphasis">{average}</span>
                                    <div className="small text-muted">Promedio</div>
                                </div>
                            </div>
                        </div> */}

                        <div className="row my-3">
                            <div className="btn-group col-4" role="group">
                                <button
                                    type="button"
                                    className={"btn btn-outline-primary btn-sm " + (assignmentBlock == 'total' ? 'active' : '')}
                                    onClick={() => setAssignmentBlock('total')}
                                >
                                    <i className="bi bi-grid-fill me-1"></i> Todas ({totalSubmissions})
                                </button>
                                <button
                                    type="button"
                                    className={"btn btn-outline-primary btn-sm " + (assignmentBlock == 'corrected' ? 'active' : '')}
                                    onClick={() => setAssignmentBlock('corrected')}
                                >
                                    <i className="bi bi-check-circle me-1"></i> Corregidas ({totalCorrected})
                                </button>
                                <button
                                    type="button"
                                    className={"btn btn-outline-primary btn-sm " + (assignmentBlock == 'pending' ? 'active' : '')}
                                    onClick={() => setAssignmentBlock('pending')}
                                >
                                    <i className="bi bi-clock me-1"></i> Pendientes ({totalUncorrected})
                                </button>
                            </div>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control w-100"
                                    placeholder="Buscar por alumno"
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
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
                                    assignmentSubmissions.length != 0 &&
                                    assignmentSubmissions.map((assignmentSubmission, i) => (
                                        <AssignmentSubmissionListing
                                            assignmentSubmission={assignmentSubmission}
                                            assignment={assignmentData}
                                            key={i}
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <p className="text-muted fst-italic">
                        <i className="bi bi-info-circle me-2" />
                        Si ve que una entrega que corrigió de la nada no tiene nota puede ser que el estudiante haya eliminado la entrega y la haya reenviado.
                    </p>
                </>
            }

        </div>
    );
}