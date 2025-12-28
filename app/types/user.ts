import type { CourseSimple, ProfessorCourse, StudentCourse } from "./course";

export type User = {
    id: number;
    name: string;
    email: string;
    roles: number[];
}

export type FullUser = {
    id: number;
    name: string;
    email: string;
    roles: UserRole[];
    professorCourses: ProfessorCourse[];
    enrollments: StudentCourse[];
}

export type Profesor = {
    id: number;
    name: string;
}