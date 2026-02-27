export default function FormErrors({ serverErrors }: { serverErrors: any[] }) {
    return <div className="rounded-2 bg-body-tertiary px-3 py-2 text-danger-emphasis bg-danger-subtle mt-3">
        <div className="d-flex gap-2 align-items-center">
            <i className="bi bi-exclamation-triangle-fill" />
            <span className="fw-semibold">Ocurrieron los siguientes errores:</span>
        </div>
        <ul>
            {
                serverErrors.map(err => <li className="my-1">{err}</li>)
            }
        </ul>

    </div>
}