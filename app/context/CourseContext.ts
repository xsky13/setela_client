import { createContext } from "react";
import type { FullCourse } from "~/types/course";

export const CourseContext = createContext<FullCourse | undefined | null>(null);