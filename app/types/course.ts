import type { Enrollment, Profesor } from "./user"

export type CourseSimple = {
    id: number,
    courseTitle: string,
    courseDescription: string
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
    progress: number
}

export type FullCourse = {
    id: number,
    title: string,
    description: string,
    enrollments: Enrollment[],
    professors: Profesor[],
    topicSeparators: TopicSeparator[],
    modules: Module[],
    assignments: Assignment[],
    exams: Exam[]
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
    displayOrder: number
}

export type Assignment = {
    id: number,
    title: string,
    visible: boolean,
    closed: boolean,
    displayOrder: number
}

export type Exam = {
    id: number,
    title: string,
    visible: boolean,
    startTime: string,
    endTime: string,
    displayOrder: number
}