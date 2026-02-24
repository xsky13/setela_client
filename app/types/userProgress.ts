import type { CourseSimple } from "./course";
import type { UserSimple } from "./user";

export enum ProgressParentType {
    module = 1,
    assignment = 2,
    exam = 3,
    resource = 4
}

export type UserProgress = {
    id: number,
    parentType: ProgressParentType,
    parentId: number,
    sysUserId: number,
    sysUser: UserSimple,
    courseId: number,
    course: CourseSimple
}

export type ProgressQuery = {
    data: UserProgress[] | undefined,
    isLoading: boolean,
    isError: boolean
}