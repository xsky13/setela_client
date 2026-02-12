import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import api from "~/api";
import ResourceListing from "~/Components/Courses/Course/ResourceListing";
import LoadingButton from "~/Components/LoadingButton";
import AddResourcesModal from "~/Components/Resource/AddResourcesModal";
import { CourseContext } from "~/context/CourseContext";
import type { FullCourse } from "~/types/course";
import type { ExamDataView } from "~/types/exam";
import { getErrors } from "~/utils/error";

export default function ExamOwnerView({ exam }: { exam: ExamDataView }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const courseData = useContext(CourseContext);

    const deleteExamMutation = useMutation({
        mutationKey: ['delete_exam_command'],
        mutationFn: async () => {
            const response = await api.delete("/exam/" + exam.id);
            return response.data;
        },
        async onSuccess() {
            queryClient.setQueryData(['getCourseQuery', { courseId: courseData?.id }], (old: FullCourse) => {
                return { ...old, exams: old.exams.filter(e => e.id != exam.id )}
            })
            navigate(`/cursos/${courseData?.id}`);
        },
        onError: error => {
            const errors = getErrors(error);
            console.log(errors);
            toast(error.message);
        },
        retry: 1
    });

    const deleteExam = () => {
        if (confirm("Esta seguro que quiere eliminar este examen? Esta acción es irreversible.")) {
            deleteExamMutation.mutate();
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-start">
                <h1>{exam.title}</h1>
                <div className="my-2">
                    <div className="d-flex">
                        <AddResourcesModal
                            parentId={exam.id}
                            courseId={exam.courseId}
                            type="exam"
                        />
                        <NavLink to="editar" className="btn btn-light mx-2"><i className="bi bi-pencil me-1" /> Editar</NavLink>
                        <LoadingButton
                            loading={deleteExamMutation.isPending}
                            onClick={deleteExam}
                            className="btn btn-danger"
                        >
                            <i className="bi bi-trash me-1" />
                            Eliminar
                        </LoadingButton>
                    </div>
                </div>
            </div>

            <div className="mt-5 px-3 py-2 rounded-1 bg-body-tertiary border">
                <p>
                    {exam.description}
                </p>
                {
                    exam.resources.length != 0 &&
                    <div className="mt-4">
                        <div className="subtitle">Recursos y materiales</div>
                        {
                            exam.resources.map((resource, i) => (
                                <ResourceListing key={i} resource={resource} currentUserIsOwner={exam.currentUserIsOwner} />
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    );
}