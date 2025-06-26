const LoadingSpinner = () => {
    return (
        <main className="quiz-container" aria-busy="true" aria-live="polite">
            <div role="status">
                <div className="loading" aria-hidden="true"></div>
                <span className="sr-only">Caricamento del quiz in corso…</span>
            </div>
        </main>
    );
};

export default LoadingSpinner;
