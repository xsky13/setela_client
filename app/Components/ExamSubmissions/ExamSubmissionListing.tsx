import type { Exam, ExamSubmission, ExamSubmissionSimple } from "~/types/exam";
import { formatDate } from "~/utils/date";
import LoadingButton from "../LoadingButton";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import { toast } from "sonner";
import GradeExamModal from "../Grades/GradeExamModal";
// import GradeModal from "./GradeModal";

export default function ExamSubmissionListing({ examSubmission, exam }: { examSubmission: ExamSubmissionSimple, exam: Exam }) {
    // const [updateIsLate, setUpdateIsLate] = useState(false);
    const queryClient = useQueryClient();

    // useEffect(() => {
    //     const submissionTime = new Date(examSubmission.creationDate).getTime();
    //     const submissionUpdateTime = new Date(examSubmission.lastUpdateDate).getTime();
    //     const dueTime = new Date(exam.dueDate).getTime();

    //     if (submissionTime > dueTime) setIsLate(true);
    //     if (submissionUpdateTime > dueTime) setUpdateIsLate(true);
    // }, [examSubmission, exam]);

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
        onSuccess: () => {
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
                    <div className="text-danger mt-1">
                        <i className="bi-exclamation-triangle-fill"></i>
                        <span className="ms-2">Entregado tarde</span>
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
                <LoadingButton onClick={deleteexamSubmission} loading={deleteExamSubmissionMutation.isPending} className="p-0 bg-transparent border-0 text-danger text-center small me-4">
                    <i className="bi bi-trash-fill" />
                    <span className="ms-2">Eliminar</span>
                </LoadingButton>
                {examSubmission.finished && <GradeExamModal examSubmissionId={examSubmission.id} />}
            </td>
        </tr>
    );
}