import { type ExamSubmission, type Exam, type ExamSubmissionSimple } from "~/types/exam";
import { formatDate } from "~/utils/date";
import LoadingButton from "../LoadingButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import { toast } from "sonner";
import GradeExamModal from "../Grades/GradeExamModal";
import { getErrors } from "~/utils/error";

export default function ExamSubmissionListing({ examSubmission, exam }: { examSubmission: ExamSubmissionSimple, exam: Exam }) {
    const queryClient = useQueryClient();

    const deleteExamSubmissionMutation = useMutation({
        mutationKey: ['delete_exam_submission_command'],
        mutationFn: async () => {
            const response = await api.delete("/examSubmission/" + examSubmission.id);
            return response.data;
        },
        onError(error) {
            console.log(error);
            toast(error.message);
        },
        onSuccess: (data) => {
            console.log(data);

            queryClient.setQueryData(['getExamQuery', { examId: exam.id }], (old: Exam) => {
                return { ...old, examSubmissions: old.examSubmissions.filter(e => e.id != examSubmission.id) }
            })
        }
    });

    const deleteexamSubmission = () => {
        if (confirm("Esta seguro que quiere borrar esta entrega? Esta acción es irreversible")) {
            deleteExamSubmissionMutation.mutate();
        }
    }

    const extendTimeMutation = useMutation<ExamSubmission, Error, { courseId: number }>({
        mutationFn: async data => (await api.post(`/examSubmission/${examSubmission.id}/add_time`, data)).data,
        onError(error) {
            const errors = getErrors(error);
            console.log(errors);
            toast.error(error.message);
        },
        onSuccess(data) {
            queryClient.setQueryData(['getExamQuery', { examId: exam.id }], (old: Exam) => {
                return {
                    ...old, examSubmissions: old.examSubmissions.map(e => e.id == data.id ?
                        {
                            ...e, adminExtendedTime: true, finished: false
                        } : e)
                };
            });
            toast("Cambios guardados");
        }
    })

    const handleTimeExtend = () => {
        if (confirm("Conferir tiempo extra ilimatado al estudiante. Esta seguro que quiere continuar?")) {
            extendTimeMutation.mutate({ courseId: exam.courseId })
        }
    }

    return (
        <tr className="">
            <th scope="row">1</th>
            <td className="fw-semibold">{examSubmission.sysUser.name}</td>
            <td className="text-muted small">
                {formatDate(examSubmission.startTime)}
            </td>
            <td className="text-muted small">
                {formatDate(examSubmission.turnInTime)}
                {
                    new Date(examSubmission.turnInTime).getTime() > new Date(exam.endTime).getTime() &&
                    <div className="mt-1">
                        {
                            examSubmission.adminExtendedTime ?
                                <div className="fst-italic">
                                    <i className="bi-info-circle"></i>
                                    <span className="ms-1">Tiempo extendido</span>
                                </div>
                                :
                                <div className="text-danger">
                                    <i className="bi-exclamation-triangle-fill"></i>
                                    <span className="ms-2">Entregado tarde</span>
                                </div>
                        }
                    </div>
                }
            </td>
            <td>
                <div>
                    {examSubmission.grade?.value || <i>Sin calificar</i>}
                </div>
                {examSubmission.grade ?
                    <span className="badge rounded-pill text-bg-primary">Corregida</span>
                    :
                    <span className="badge rounded-pill text-bg-danger">Pendiente</span>
                }</td>
            <td>{examSubmission.finished ?
                <span className="badge rounded-pill text-bg-primary">Finalizada</span>
                :
                <span className="badge rounded-pill text-bg-danger">En proceso</span>
            }</td>
            <td>
                <div className="vstack align-items-start gap-1">
                    <LoadingButton onClick={deleteexamSubmission} loading={deleteExamSubmissionMutation.isPending} className="button-unstyled text-danger">
                        <i className="bi bi-trash-fill" />
                        <span className="ms-2">Eliminar</span>
                    </LoadingButton>
                    {examSubmission.finished && <>
                        <GradeExamModal examSubmissionId={examSubmission.id} />
                        <LoadingButton
                            className="button-unstyled"
                            onClick={handleTimeExtend}
                        >
                            <i className="bi bi-stopwatch me-2"></i>
                            Extender tiempo
                        </LoadingButton>
                    </>}
                </div>
            </td>
        </tr>
    );
}