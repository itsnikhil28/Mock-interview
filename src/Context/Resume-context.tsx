import { createContext } from "react";
import { Resume } from "@/types";

interface ResumeContextType {
    initialdata: Resume | null;
}

export const ResumeContext = createContext<ResumeContextType | null>(null);
