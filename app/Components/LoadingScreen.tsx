export default function LoadingScreen() {
    return (
        <div className="fullscreen">
            <div className="spinner-border m-5" style={{ width: '5rem', height: '5rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}