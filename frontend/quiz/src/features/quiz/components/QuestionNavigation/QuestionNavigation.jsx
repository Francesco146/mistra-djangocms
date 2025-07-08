import styles from "./QuestionNavigation.module.css";
const QuestionNavigation = ({
    questions,
    selectedAnswers,
    currentIndex,
    submitted,
    onQuestionSelect,
    backendResults = {},
}) => {
    const getNavButtonClass = (idx) => {
        let classes = styles.navDot;

        // "active" state:
        if (currentIndex === idx) {
            classes += ` ${styles.navDotActive}`;
        }

        const question = questions[idx];
        const ansId = selectedAnswers[question.id];

        if (submitted) {
            const isCorrect = backendResults[question.id] === true;
            if (isCorrect) {
                classes += ` ${styles.navDotActiveCorrect}`;
            } else {
                classes += ` ${styles.navDotActiveIncorrect}`;
            }
        } else {
            if (ansId == null) {
                classes += ` ${styles.navDotUnanswered}`;
            } else {
                classes += ` ${styles.navDotAnswered}`;
            }
        }

        return classes;
    };

    return (
        <nav
            className={styles.questionNav}
            aria-label="Navigazione tra le domande"
        >
            {questions.map((q, idx) => {
                let label = `Vai alla domanda ${idx + 1}`;
                const isUnanswered =
                    (selectedAnswers[q.id] === undefined ||
                        selectedAnswers[q.id] === null) &&
                    !submitted;
                if (isUnanswered) {
                    label += " (non risposta)";
                }
                if (submitted) {
                    if (backendResults[q.id] === true) {
                        label += " (risposta corretta)";
                    } else {
                        label += " (risposta sbagliata)";
                    }
                }
                return (
                    <button
                        key={q.id}
                        type="button"
                        className={getNavButtonClass(idx)}
                        onClick={() => onQuestionSelect(idx)}
                        aria-label={label}
                        aria-current={currentIndex === idx ? "step" : undefined}
                    >
                        {idx + 1}
                    </button>
                );
            })}
        </nav>
    );
};

export default QuestionNavigation;
