import type { CourseSimple } from "./course";

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
    profesorCourses: CourseSimple[];
    enrollments: CourseSimple[];
}

export type Profesor = {
    id: number;
    name: string;
}