import type { GradeType } from "./gradeTypes"
import type { UserSimple } from "./user"

export type Grade = {
    id: number,
    value: number,
    parentType: GradeType,
    parentId: number,
    sysUserId: number,
    sysUser: UserSimple,
    courseId: number,
}