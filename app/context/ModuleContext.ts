import { createContext } from "react";
import type { Module } from "~/types/course";

export const ModuleContext = createContext<Module | undefined | null>(null);