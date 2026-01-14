import type { CourseSimple, ProfessorCourse, StudentCourse } from "./course";

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
    user: UserSimple;
    enrollmentDate: string,
    valid: boolean;
    grade: number | null;
}

export type Profesor = {
    id: number;
    name: string;
}