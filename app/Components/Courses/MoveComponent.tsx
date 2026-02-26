import { useOrdering } from "~/context/OrderingContext";
import type { CourseItemType } from "~/types/CourseItemType";

export default function MoveComponent({ itemType, itemId }: {
    itemType: CourseItemType,
    itemId: number,
}) {
    const { moveUpwards, moveDownwards } = useOrdering();

    return (
        <div className="text-end">
            <button
                className="btn btn-primary"
                onClick={() => moveDownwards(itemType, itemId)}
            >
                <i className="bi bi-arrow-down"></i>
            </button>
            <button
                className="btn btn-primary ms-2"
                onClick={() => moveUpwards(itemType, itemId)}
            >
                <i className="bi bi-arrow-up"></i>
            </button>
        </div>
    );
}