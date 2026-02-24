import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "~/api";
import { ProgressParentType, type ProgressQuery, type UserProgress } from "~/types/userProgress";
import LoadingButton from "../LoadingButton";

export default function ToggleFinishedButton({
    parentType,
    parentId,
    courseId,
    progressItems
}: {
    parentType: ProgressParentType,
    parentId: number,
    courseId: number,
    progressItems: ProgressQuery
}) {
    const queryClient = useQueryClient();

    const toggleItemMutation = useMutation<UserProgress, Error, { parentType: ProgressParentType, parentId: number, courseId: number }>({
        mutationFn: async data => (await api.post('/userProgress', data)).data,
        onError: (err) => toast.error(err.message),
        onSuccess: async data => {
            queryClient.setQueryData(['get_progress_items', { courseId: courseId }], (old: UserProgress[]) => {
                if (!data) {
                    return old.filter(p => !(p.parentType == parentType && p.parentId == parentId));
                }
                return [...old, data];
            });
            await queryClient.invalidateQueries({ queryKey: ['get_progress_for_course', { courseId: courseId }] })
        }
    });

    const toggleFinished = () => {
        toggleItemMutation.mutate({ parentType: parentType, parentId, courseId });
    }

    if (progressItems.isLoading) {
        return <p className="card-text placeholder-glow">
            <span className="placeholder placeholder-custom col-12"></span>
        </p>
    }
    else if (progressItems.isError) {
        return;
    }
    else {
        const isFinished = progressItems.data?.some(item => item.parentType == parentType && item.parentId == parentId);

        return (
            <LoadingButton
                className={`btn btn-${isFinished ? 'dark' : 'light'} mb-2`}
                onClick={toggleFinished}
                loading={toggleItemMutation.isPending}
            >
                <i className={`bi bi-check-circle${isFinished ? '-fill' : ''} me-2`}></i>
                {isFinished ? 'Desmarcar' : 'Marcar'} finalizado
            </LoadingButton>
        )
    }
}