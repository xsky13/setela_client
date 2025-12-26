import { createContext } from "react";
import type { FullUser, User } from "~/types/user";

export const AuthContext = createContext<FullUser | undefined | null>(null);