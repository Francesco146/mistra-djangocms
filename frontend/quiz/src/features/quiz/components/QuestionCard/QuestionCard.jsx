import { AnswerOption, QuestionNavigation } from "@features/components";
import DomPurify from "dompurify";
import styles from "./QuestionCard.module.css";
const QuestionCard = ({
    question,
    questions,
    currentIndex,
    selectedAnswers,
    submitted,
    onAnswerSelect,
    onQuestionSelect,
    backendResults = {},
}) => {
    const currentSelectionId = selectedAnswers[question.id];
    const currentAnswerObj =
        question.answers.find((a) => a.id === currentSelectionId) || {};

    // Use backendResults for correction
    const isCorrect =
        submitted && backendResults && backendResults[question.id] === true;

    const answersToShow = submitted
        ? question.answers.filter((a) => a.id === currentSelectionId)
        : question.answers;

    return (
        <div
            className={styles.questionCard}
            role="group"
            aria-labelledby={`question-title-${question.id}`}
        >
            <h2
                id={`question-title-${question.id}`}
                className={styles.questionTitle}
            >
                {question.name}
            </h2>
            <div
                className={styles.questionText}
                dangerouslySetInnerHTML={{
                    __html: DomPurify.sanitize(question.text),
                }}
            />

            <fieldset className={styles.answerSection}>
                <legend className="sr-only">
                    Opzioni per "{question.name}"
                </legend>
                {answersToShow.map((ans) => (
                    <AnswerOption
                        key={ans.id}
                        answer={ans}
                        question={question}
                        isSelected={currentSelectionId === ans.id}
                        submitted={submitted}
                        onSelect={onAnswerSelect}
                    />
                ))}
            </fieldset>

            <QuestionNavigation
                questions={questions}
                selectedAnswers={selectedAnswers}
                currentIndex={currentIndex}
                submitted={submitted}
                onQuestionSelect={onQuestionSelect}
                backendResults={backendResults}
            />

            {submitted && (
                <div
                    className={`${styles.correctionText} ${
                        isCorrect
                            ? styles.feedbackCorrect
                            : styles.feedbackIncorrect
                    }`}
                >
                    <strong>{isCorrect ? "Corretto!" : "Sbagliato!"}</strong>
                    <div>{currentAnswerObj.correction}</div>
                </div>
            )}

            <div className={styles.progressContainer} aria-hidden="true">
                <div
                    className={styles.progressBar}
                    style={{
                        width: `${
                            ((currentIndex + 1) / questions.length) * 100
                        }%`,
                    }}
                />
            </div>
        </div>
    );
};

export default QuestionCard;
