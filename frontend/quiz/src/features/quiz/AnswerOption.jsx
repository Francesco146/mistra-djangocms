const AnswerOption = ({
    answer,
    question,
    isSelected,
    submitted,
    onSelect,
}) => {
    let extraClass = "";

    if (submitted) {
        extraClass = answer.score === "1.00" ? "correct" : "incorrect";
    } else if (isSelected) {
        extraClass = "selected";
    }

    return (
        <label
            htmlFor={`q${question.id}-a${answer.id}`}
            className={`answer-option ${extraClass}`}
        >
            <input
                type="radio"
                id={`q${question.id}-a${answer.id}`}
                name={`question-${question.id}`}
                value={answer.id}
                checked={isSelected}
                onChange={() => onSelect(answer.id)}
                disabled={submitted}
            />
            <span className="answer-text">{answer.text}</span>
        </label>
    );
};

export default AnswerOption;
