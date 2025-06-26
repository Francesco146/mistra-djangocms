const QuestionNavigation = ({
    questions,
    selectedAnswers,
    currentIndex,
    submitted,
    onQuestionSelect,
}) => {
    const getNavButtonClass = (idx) => {
        let classes = "nav-dot";

        if (currentIndex === idx) {
            classes += " active";
        }

        if (submitted) {
            const ansId = selectedAnswers[idx];
            const question = questions[idx];
            const answer = question.answers.find((a) => a.id === ansId);
            if (answer && answer.score === "1.00") {
                classes += " correct";
            } else {
                classes += " incorrect";
            }
        } else {
            if (selectedAnswers[idx] === null) {
                classes += " unanswered";
            } else {
                classes += " answered";
            }
        }

        return classes;
    };

    return (
        <nav className="question-nav" aria-label="Navigazione tra le domande">
            {questions.map((q, idx) => (
                <button
                    key={q.id}
                    type="button"
                    className={getNavButtonClass(idx)}
                    onClick={() => onQuestionSelect(idx)}
                    aria-label={`Vai alla domanda ${idx + 1}${
                        selectedAnswers[idx] === null && !submitted
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
