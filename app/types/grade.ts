import type { GradeType } from "./gradeTypes"
import type { UserSimple } from "./user"

export enum GradeParentType {
    AssignmentSubmission = 1,
    ExamSubmission = 2,
}

export type Grade = {
    id: number,
    value: number,
    parentType: GradeType,
    parentId: number,
    sysUserId: number,
    sysUser: UserSimple,
    courseId: number,
}

export type GradeParentHelper = {
    itemTitle: string,
    maxGrade: number,
    grandParentId: number
}

export type GradeListing = {
    id: number,
    value: number,
    parentType: GradeParentType,
    parentId: number,
    courseId: number,
    parentHelper: GradeParentHelper
}

export type GradeSimple = {
    id: number,
    value: number,
    sysUserId: number,
    sysUser?: UserSimple,
}