import type { CourseSimple, ProfessorCourse } from "./course";

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
    roles: number[];
    professorCourses: ProfessorCourse[];
    enrollments: CourseSimple[];
}

export type Profesor = {
    id: number;
    name: string;
}