import styles from "./QuestionNavigation.module.css";
const QuestionNavigation = ({
    questions,
    selectedAnswers,
    currentIndex,
    submitted,
    onQuestionSelect,
}) => {
    const getNavButtonClass = (idx) => {
        let classes = styles.navDot;

        // “active” state:
        if (currentIndex === idx) {
            classes += ` ${styles.navDotActive}`;
        }

        const question = questions[idx];
        const ansId = selectedAnswers[question.id];

        if (submitted) {
            const answer = question.answers.find((a) => a.id === ansId);
            if (answer && answer.score === "1.00") {
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
            {questions.map((q, idx) => (
                <button
                    key={q.id}
                    type="button"
                    className={getNavButtonClass(idx)}
                    onClick={() => onQuestionSelect(idx)}
                    aria-label={`Vai alla domanda ${idx + 1}${
                        (selectedAnswers[q.id] === undefined ||
                            selectedAnswers[q.id] === null) &&
                        !submitted
                            ? " (non risposta)"
                            : ""
                    }`}
                    aria-current={currentIndex === idx ? "step" : undefined}
                >
                    {idx + 1}
                </button>
            ))}
        </nav>
    );
};

export default QuestionNavigation;
