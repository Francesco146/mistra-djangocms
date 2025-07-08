import DomPurify from "dompurify";
import styles from "./AnswerOption.module.css";

const AnswerOption = ({
    answer,
    question,
    isSelected,
    submitted,
    onSelect,
    backendResults = {},
}) => {
    let extraClass = "";

    if (submitted) {
        const isCorrect = backendResults[question.id] === true;
        extraClass = isCorrect
            ? styles["answerOption--correct"]
            : styles["answerOption--incorrect"];
    } else if (isSelected) {
        extraClass = styles["answerOption--selected"];
    }

    let ariaLabel = answer.text;
    if (submitted) {
        if (backendResults[question.id] === true && isSelected) {
            ariaLabel += " (risposta corretta)";
        } else if (isSelected) {
            ariaLabel += " (risposta sbagliata)";
        }
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
                aria-labelledby={`q${question.id}-a${answer.id}-label`}
                aria-label={ariaLabel}
                aria-checked={isSelected}
                aria-required="true"
            />
            <span
                id={`q${question.id}-a${answer.id}-label`}
                className={styles.answerText}
                dangerouslySetInnerHTML={{
                    __html: DomPurify.sanitize(answer.text),
                }}
            />
        </label>
    );
};

export default AnswerOption;
