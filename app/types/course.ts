export type CourseSimple = {
    id: number,
    courseTitle: string,
    courseDescription: string   
}

export type ProfessorCourse = {
    id: number,
    title: string,
    students: number,
    examsToGrade: number,   
    assignmentsToGrade: number   
}