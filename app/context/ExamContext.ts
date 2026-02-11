import { createContext } from "react";
import { type Exam } from "~/types/exam";

export const ExamContext = createContext<Exam | undefined | null>(null);