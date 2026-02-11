import type { Assignment } from "./assignment"
import type { Exam } from "./exam"
import type { ResourceParentType } from "./resourceTypes"
import type { Enrollment, Profesor, UserSimple } from "./user"

export type CourseSimple = {
    id: number,
    title: string,
}

export type ProfessorCourse = {
    id: number,
    title: string,
    students: number,
    examsToGrade: number,
    assignmentsToGrade: number
}

export type StudentCourse = {
    id: number,
    courseId: number,
    courseTitle: string,
    year: number,
    progress: number,
    valid: boolean
}

export type FullCourse = {
    id: number,
    title: string,
    description: string,
    enrollments: Enrollment[],
    resources: ResourceListing[],
    professors: Profesor[],
    topicSeparators: TopicSeparator[],
    modules: Module[],
    assignments: Assignment[],
    exams: Exam[]
}

export type CourseDataView = FullCourse & {
    currentUserIsOwner: boolean;
}







export type TopicSeparator = {
    id: number,
    title: string,
    displayOrder: number
}

export type Module = {
    id: number,
    title: string,
    textContent: string,
    visible: boolean,
    creationDate: string,
    courseId: number,
    displayOrder: number,
    resources: ResourceListing[]
}

export type ResourceListing = {
    id: number,
    url: string,
    linkText: string,
    resourceType: number,
    parentType: ResourceParentType,
    parentId: number,
    creationDate: string,
    sysUser: UserSimple,
    displayOrder: number
}

