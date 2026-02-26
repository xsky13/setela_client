import { createContext, useContext } from "react";
import type { CourseItemType } from "~/types/CourseItemType";

type ContextType = {
    mode: 'course' | 'editing',
    moveUpwards:  (itemType: CourseItemType, itemId: number) => void,
    moveDownwards:  (itemType: CourseItemType, itemId: number) => void,
}

export const OrderingContext = createContext<ContextType | undefined>(undefined);

export const useOrdering = () => {
    const context = useContext(OrderingContext);
    if (!context) {
        throw new Error("useOrdering must be used within an OrderingContext.Provider");
    }
    return context;
};