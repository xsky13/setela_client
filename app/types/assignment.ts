import type { ResourceListing } from "./course"
import type { User, UserSimple } from "./user"

export type Assignment = {
    id: number,
    title: string,
    textContent?: string,
    visible: boolean,
    closed: boolean,
    displayOrder: number,
    resources: ResourceListing[],
    dueDate: string,
    maxGrade: number,
    weight: number,
    courseId: number,
    assignmentSubmissions: AssignmentSubmission[]
}

export type AssignmentSubmission = {
    id: number,
    creationDate: string,
    lastUpdateDate: string,
    sysUser: UserSimple,
    sysUserId: number,
    assignmentId: number,
    grade: number,
    textContent: string
}