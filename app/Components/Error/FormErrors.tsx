export default function FormErrors({ serverErrors }: { serverErrors: any[] }) {
    return <div className="rounded-2 bg-body-tertiary px-3 py-2 text-danger-emphasis bg-danger-subtle mt-3">
        <span className="fw-semibold">Ocurrieron los siguientes errores:</span>
        <ul>
            {
                serverErrors.map(err => <li>{err}</li>)
            }
        </ul>

    </div>
}