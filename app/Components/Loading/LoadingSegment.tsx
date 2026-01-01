export default function LoadingSegment() {
    return (
        <div className="pt-5 d-flex justify-content-center align-items-center">
            <div className="spinner-border m-5" style={{ width: '5rem', height: '5rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}