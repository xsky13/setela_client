interface LoadingButtonProps {
    children: React.ReactNode;
    loading?: boolean;
    className?: string;
    onClick?: void | any;
    type?: "button" | "submit";
    form?: string;
}

export default function LoadingButton({ children, loading, className, onClick, type, form }: LoadingButtonProps) {
    return (
        <button onClick={onClick} className={className} disabled={loading} type={type} form={form}>
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