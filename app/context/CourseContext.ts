import { createContext } from "react";
import type { CourseDataView, FullCourse } from "~/types/course";

export const CourseContext = createContext<CourseDataView | undefined | null>(null);