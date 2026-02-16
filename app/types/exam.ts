import type { CourseSimple, ResourceListing } from "./course";
import type { Grade } from "./grade";
import type { UserSimple } from "./user";

export type Exam = {
    id: number,
    title: string,
    description: string,
    startTime: string,
    endTime: string,
    maxGrade: number,
    weight: number,
    visible: boolean,
    closed: boolean,
    creationDate: string,
    displayOrder: number,
    courseId: number,
    course: CourseSimple,
    resources: ResourceListing[],
    examSubmissions: ExamSubmissionSimple[]
}

export type ExamSimple = {
    id: number,
    title: string,
    visible: boolean,
    closed: boolean,
    courseId: number,
    displayOrder: number,
    startTime: string,
    endTime: string,
}

export type ExamDataView = Exam & {
    currentUserIsOwner: boolean;
}



export type ExamSubmission = {
    id: number,
    textContent: string,
    finished: boolean,
    examId: number,
    exam: ExamSimple,
    grade: Grade,
    resources: ResourceListing[],
    sysUserId: number,
    sysUser: UserSimple,
    startTime: string,  
    turnInTime: string,
    lastUpdated: string
}

export type ExamSubmissionSimple = {
    id: number,
    sysUserId: number,
    sysUser: UserSimple,
    turnInTime: string,
    lastUpdated: string
}