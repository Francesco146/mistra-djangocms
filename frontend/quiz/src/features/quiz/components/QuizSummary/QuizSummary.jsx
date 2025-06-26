const QuizSummary = ({ correctCount, totalQuestions, onRetry, onSavePDF }) => {
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return (
        <div className="summary">
            <p>
                Hai risposto correttamente a <strong>{correctCount}</strong>{" "}
                domande su <strong>{totalQuestions}</strong>. Score:{" "}
                <strong>{percentage}%</strong>
            </p>
            <div className="summary-buttons">
                <button className="retry-button" onClick={onRetry}>
                    Riprova quiz
                </button>
                <button className="save-button" onClick={onSavePDF}>
                    Salva risultati PDF
                </button>
            </div>
        </div>
    );
};

export default QuizSummary;
