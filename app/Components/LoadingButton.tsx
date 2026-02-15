import type { ComponentPropsWithoutRef } from "react";

interface LoadingButtonProps extends ComponentPropsWithoutRef<"button"> {
    loading?: boolean;
}

export default function LoadingButton({ children, loading, ...props }: LoadingButtonProps) {
    return (
        <button {...props} disabled={loading || props.disabled}>
            {
                loading ?
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    :
                    children
            }
        </button>
    )
}