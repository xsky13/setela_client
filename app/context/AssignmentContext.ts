import { createContext } from "react";
import type { Assignment } from "~/types/assignment";

export const AssignmentContext = createContext<Assignment | undefined | null>(null);