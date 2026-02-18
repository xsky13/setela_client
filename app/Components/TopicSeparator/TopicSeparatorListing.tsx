import { useState } from "react";
import type { FullCourse, TopicSeparator } from "~/types/course";
import LoadingButton from "../LoadingButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import { toast } from "sonner";
import { useParams } from "react-router";

export default function TopicSeparatorListing({ topicSeparator, currentUserIsOwner }: { topicSeparator: TopicSeparator, currentUserIsOwner: boolean }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [title, setTitle] = useState(topicSeparator.title);
    const queryClient = useQueryClient();
    const params = useParams();

    const updateTopicSeparatorMutation = useMutation<TopicSeparator, Error, { newTitle: string }>({
        mutationFn: async data => (await api.put("/topicSeparator/" + topicSeparator.id, data)).data,
        onError: error => toast(error.message),
        onSuccess: data => {
            queryClient.setQueryData(['getCourseQuery', { courseId: Number(params.id)}], (old: FullCourse) => {
                return { ...old, topicSeparators: old.topicSeparators.map(ts => ts.id == topicSeparator.id ? 
                    data
                    : ts)}
            });

            setIsUpdating(false);
        }
    });

    const handleChange = () => {
        updateTopicSeparatorMutation.mutate({ newTitle: title });
    }

    return (
        <div className="d-flex align-items-center justify-content-between">
            {
                isUpdating ?
                    <div className="d-flex align-items-center gap-2">
                        <input
                            className="form-control"
                            placeholder="Titulo..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={{ maxWidth: '20rem' }}
                        />
                        <LoadingButton
                            className="btn btn-primary"
                            loading={updateTopicSeparatorMutation.isPending}
                            onClick={handleChange}
                        >
                            Guardar
                        </LoadingButton>
                    </div>
                    :
                    <h3>{topicSeparator.title}</h3>
            }
            {
                currentUserIsOwner &&
                <div>
                    <i
                        className={`bi bi-${isUpdating ? "x-circle-fill" : "pencil"}`}
                        role="button"
                        onClick={() => setIsUpdating(!isUpdating)}
                    />
                </div>
            }
        </div>
    );
}