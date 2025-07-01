import styles from "./QuizSummary.module.css";

const QuizSummary = ({
    correctCount,
    totalQuestions,
    onRetry,
    onSavePDF,
    backendScore,
}) => {
    return (
        <div className={styles.summary}>
            <p>
                Hai risposto correttamente a <strong>{correctCount}</strong>{" "}
                domande su <strong>{totalQuestions}</strong>. Score:{" "}
                <strong>
                    {backendScore}/{totalQuestions}
                </strong>
            </p>
            <div className={styles.summaryButtons}>
                <button className={styles.retryButton} onClick={onRetry}>
                    Riprova quiz
                </button>
                <button className={styles.saveButton} onClick={onSavePDF}>
                    Salva risultati PDF
                </button>
            </div>
        </div>
    );
};

export default QuizSummary;
