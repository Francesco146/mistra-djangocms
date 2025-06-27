import styles from "./AnswerOption.module.css";

const AnswerOption = ({
    answer,
    question,
    isSelected,
    submitted,
    onSelect,
}) => {
    let extraClass = "";

    if (submitted) {
        extraClass =
            answer.score === "1.00"
                ? styles["answerOption--correct"]
                : styles["answerOption--incorrect"];
    } else if (isSelected) {
        extraClass = styles["answerOption--selected"];
    }

    return (
        <label
            htmlFor={`q${question.id}-a${answer.id}`}
            className={`${styles.answerOption} ${extraClass}`}
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
            <span className={styles.answerText}>{answer.text}</span>
        </label>
    );
};

export default AnswerOption;
