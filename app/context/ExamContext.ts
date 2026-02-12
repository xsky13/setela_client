import { createContext } from "react";
import { type ExamDataView } from "~/types/exam";

export const ExamContext = createContext<ExamDataView | undefined | null>(null);