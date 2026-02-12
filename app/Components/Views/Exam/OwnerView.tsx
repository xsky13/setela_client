import { useMutation } from "@tanstack/react-query";
import { NavLink } from "react-router";
import ResourceListing from "~/Components/Courses/Course/ResourceListing";
import LoadingButton from "~/Components/LoadingButton";
import AddResourcesModal from "~/Components/Resource/AddResourcesModal";
import type { ExamDataView } from "~/types/exam";

export default function OwnerView({ exam }: { exam: ExamDataView }) {
    const deleteExamMutation = useMutation({});

    const deleteExam = () => {
        deleteExamMutation.mutate();
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