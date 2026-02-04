import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingButton from "../LoadingButton";
import { useParams } from "react-router";
import type { Grade } from "~/types/grade";
import api from "~/api";
import { toast } from "sonner";
import type { Assignment } from "~/types/assignment";
import { useContext, useState } from "react";
import { AuthContext } from "~/context/AuthContext";

type GradeRequest = {
    value: number,
    parentType: string,
    parentId: number,
    studentId: number,
    courseId: number
}

export default function GradeForm({
    assignmentId,
    maxGrade,
    assignmentSubmissionId,
    grade
}: {
    assignmentId: number,
    maxGrade: number,
    assignmentSubmissionId: number,
    grade: number | undefined
}) {
    const user = useContext(AuthContext);
    if (!user) throw new Error("El usuario no existe");
    const params = useParams();
    const queryClient = useQueryClient();
    const [value, setValue] = useState<number | undefined>(grade);

    const gradeAssignmentMutation = useMutation<Grade, Error, GradeRequest>({
        mutationKey: ['create_grade_command'],
        mutationFn: async data => {
            const response = await api.post("/grade", data);
            return response.data;
        },
        onError(error) {
            console.log(error);
            toast(error.message);
        },
        async onSuccess(data) {
            queryClient.setQueryData(['getAssignmentQuery', { assignmentId: assignmentId }], (old: Assignment) => {
                return {
                    ...old, assignmentSubmissions: old.assignmentSubmissions.map(a => a.id == assignmentSubmissionId ? {
                        ...a, grade: data.value
                    } : a)
                }
            });
            toast("Se actualizado la nota del estudiante.");
        }
    });

    const gradeAssignment = () => {
        if (!value) {
            toast("El valor no puede ser nulo");
            return;
        }
        gradeAssignmentMutation.mutate({
            value,
            parentType: 'assignmentSubmission',
            parentId: assignmentSubmissionId,
            studentId: user.id,
            courseId: Number(params.id)
        });
    }


    return (
        <>
            <div className="modal-body">
                <div className="border border-2 border-primary rounded-3 p-4 bg-light">
                    <h5 className="d-flex gap-2 text-primary-emphasis ">
                        <i className="bi bi-star-fill"></i>
                        <h5>Calificación</h5>
                    </h5>

                    <div className="grade-input-group">
                        <div className="grade-input-wrapper">
                            <input
                                type="number"
                                className="form-control grading-input fs-3"
                                placeholder="0"
                                min="0"
                                max="100"
                                id="gradeInput"
                                value={value}
                                onChange={e => setValue(Number(e.target.value))}
                            />
                        </div>
                        <span className="fs-2 fw-bold text-body-tertiary">/</span>
                        <span className="fs-2 fw-bold text-body-tertiary">100</span>
                    </div>

                    <div className="bg-white rounded-3 p-3 border hstack gap-2 text-muted small">
                        <i className="bi bi-info-circle-fill"></i>
                        <span>Calificación máxima: <strong>{maxGrade} puntos</strong></span>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <LoadingButton
                    type="submit"
                    onClick={gradeAssignment}
                    className="btn btn-primary"
                    loading={gradeAssignmentMutation.isPending}
                >
                    Calificar
                </LoadingButton>
            </div>
        </>
    );
}