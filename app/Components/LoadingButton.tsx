interface LoadingButtonProps {
    children: React.ReactNode;
    loading?: boolean;
    className?: string;
    onClick?: void | any
}

export default function LoadingButton({ children, loading, className, onClick }: LoadingButtonProps) {
    return (
        <button onClick={onClick} className={className} disabled={loading}>
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