import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import LoadingButton from "~/Components/LoadingButton";
import type { FullCourse } from "~/types/course";
import type { Exam, ExamSimple } from "~/types/exam";
import { formatDate, getMinutesDifference } from "~/utils/date";
import { getErrors } from "~/utils/error";

export default function ExamListing({
    exam,
    currentUserIsOwner,
}: {
    exam: ExamSimple,
    currentUserIsOwner: boolean,
}) {
    const queryClient = useQueryClient();

    const changeVisibilityMutation = useMutation<Exam, Error, { visible: boolean }>({
        mutationKey: ['edit_exam_visibility_command'],
        mutationFn: async data => {
            const response = await api.put('/exam/' + exam.id, data);
            return response.data;
        },
        onSuccess() {
            queryClient.setQueryData(['getCourseQuery', { courseId: Number(exam.courseId) }], (old: FullCourse) => {
                return {
                    ...old,
                    exams: old.exams.map((e: Exam) => e.id == exam.id ? {
                        ...e, visible: !exam.visible
                    } : e)
                }
            });
            queryClient.setQueryData(['getExamQuery', { examId: Number(exam.id) }], (old: Exam) => ({ ...old, visible: !exam.visible }))
        },
        onError(error) {
            const errors = getErrors(error);
            console.log(errors);
            toast(error.message);
        }
    });
    const deleteExamMutation = useMutation<any, Error>({
        mutationKey: ['delete_exam_from_course_command'],
        mutationFn: async () => {
            const response = await api.delete("/exam/" + exam.id);
            return response.data;
        },
        async onSuccess() {
            queryClient.setQueryData(['getCourseQuery', { courseId: Number(exam.courseId) }], (old: FullCourse) => {
                return { ...old, exams: old.exams.filter(e => e.id != exam.id) }
            });
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);
            toast(error.message);
        },
        retry: 1
    });

    const changeVisibility = () => {
        changeVisibilityMutation.mutate({ visible: !exam.visible })
    }

    const deleteExam = () => {
        if (confirm("Esta seguro que quiere eliminar este trabajo práctico? Esta acción es irreversible")) {
            deleteExamMutation.mutate();
        }
    }

    return (
        <div className="d-flex justify-content-between rounded-2 border border-2 border-danger  p-4 my-3">
            <div>
                <div className="bg-white border-0 mb-2">
                    <span className="d-inline-flex rounded-1 px-3 py-2 fw-semibold text-danger-emphasis bg-danger-subtle text-uppercase small">
                        <i className="bi bi-book me-2"></i>
                        Examen
                    </span>
                </div>
                <NavLink to={`./e/${exam.id}`} className="h5 card-title text-decoration-none">{exam.title}</NavLink>
                <div className="d-flex mt-2 small text-muted">
                    <p><i className='bi bi-calendar-week'></i> Apertura: <span className="fw-semibold">{exam.startTime ? formatDate(exam.startTime) : 'Sin fecha'}</span></p>
                    <div className="ms-3">
                        <i className='bi bi-clock'></i> Duracion: <span className="fw-semibold">{getMinutesDifference(exam.startTime, exam.endTime)}</span> minutos
                    </div>
                </div>
            </div>
            <div className={"d-flex flex-column " + (currentUserIsOwner && "justify-content-between")}>
                <button className="btn btn-light">
                    <i className='bi bi-check-circle me-2'></i>
                    Marcar finalizado
                </button>
                {
                    currentUserIsOwner &&
                    <div className="d-flex">
                        <LoadingButton onClick={changeVisibility} loading={changeVisibilityMutation.isPending} className="p-0 bg-white border-0 text-center small">
                            {
                                exam.visible ?
                                    <><i className="bi bi-eye" /><span className="d-block">Visible</span></>
                                    :
                                    <><i className="bi bi-eye-slash" /><span className="d-block">No visible</span></>

                            }
                        </LoadingButton>
                        <LoadingButton onClick={deleteExam} loading={deleteExamMutation.isPending} className="p-0 bg-white border-0 text-danger text-center small mx-4">
                            <i className="bi bi-trash-fill" />
                            <span className="d-block">Eliminar</span>
                        </LoadingButton>
                        <NavLink to={`./e/${exam.id}/editar`} className="text-center small text-decoration-none" role="button">
                            <i className="bi bi-pencil" />
                            <span className="d-block">Editar</span>
                        </NavLink>
                    </div>
                }
            </div>
        </div>
    );
}