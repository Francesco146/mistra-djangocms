import styles from "./LoadingSpinner.module.css";
const LoadingSpinner = () => {
    return (
        <main
            className={styles.quizContainer}
            aria-busy="true"
            aria-live="polite"
        >
            <div role="status">
                <div className={styles.loading} aria-hidden="true"></div>
                <span className={styles.srOnly}>
                    Caricamento del quiz in corso…
                </span>
            </div>
        </main>
    );
};

export default LoadingSpinner;
