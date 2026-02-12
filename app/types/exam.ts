import type { CourseSimple, ResourceListing } from "./course";
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

export type ExamDataView = Exam & {
    currentUserIsOwner: boolean;
}

export type ExamSubmissionSimple = {
    id: number,
    sysUserId: number,
    sysUser: UserSimple,
    turnInTime: string,
    lastUpdated: string
}