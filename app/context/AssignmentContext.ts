import { createContext } from "react";
import type { Assignment } from "~/types/course";

export const AssignmentContext = createContext<Assignment | undefined | null>(null);