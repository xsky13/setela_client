import type { CourseSimple, ProfessorCourse, StudentCourse } from "./course";
import type { UserRole } from "./roles";

export type User = {
    id: number;
    name: string;
    email: string;
    roles: number[];
}

export type UserSimple = {
    id: number;
    name: string;
}

export type FullUser = {
    id: number;
    name: string;
    email: string;
    roles: UserRole[];
    professorCourses: ProfessorCourse[];
    enrollments: StudentCourse[];
}

export type Enrollment = {
    id: number;
    sysUser: UserSimple;
    enrollmentDate: string,
    valid: boolean;
    grade: number | null;
    courseId: number,
}

export type Profesor = {
    id: number;
    name: string;
}