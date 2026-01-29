import type { Assignment } from "~/types/assignment"

function GradeDisplay({ maxGrade }: { maxGrade: number }) {
    return (
        <div>
            <span className="subtitle small">Nota maxima</span>
            <div className="fs-4 fw-semibold">
                {maxGrade.toString()}
            </div>
        </div>
    )
}

export default function AssignmentExtraInfo({
    currentUserIsOwner,
    assignmentData
}: {
    currentUserIsOwner: boolean,
    assignmentData: Assignment
}) {
    return (
        <div className="d-flex ">
            <div>
                {
                    currentUserIsOwner &&
                    <div className="badge rounded-pill text-bg-primary me-2 mb-2">
                        {assignmentData.visible ?
                            <>
                                <i className="bi bi-eye" />
                                <span className="ms-1">Visible</span>
                            </> : <>
                                <i className="bi bi-eye-slash" />
                                <span className="ms-1">No visible</span>
                            </>}
                    </div>
                }
                <div className={`badge d-block rounded-pill ${assignmentData.closed ? "text-bg-danger" : "text-bg-success"}`}>
                    {assignmentData.closed ?
                        <>
                            <i className="bi bi-lock-fill" />
                            <span className="ms-1">Cerrado</span>
                        </> : <>
                            <i className="bi bi-unlock-fill" />
                            <span className="ms-1">Abierto</span>
                        </>}
                </div>
                {
                    !currentUserIsOwner &&
                    <div className="mt-1">
                        <GradeDisplay maxGrade={assignmentData.maxGrade} />
                    </div>
                }
            </div>
            {
                currentUserIsOwner &&
                <div className="ms-3">
                    <GradeDisplay maxGrade={assignmentData.maxGrade} />
                </div>
            }
        </div>
    )
}