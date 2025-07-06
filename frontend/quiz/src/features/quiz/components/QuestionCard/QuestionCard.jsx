import { AnswerOption, QuestionNavigation } from "@features/components";
import DomPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import styles from "./QuestionCard.module.css";

const PREVIEW_LINES = 5;

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

    // read more toggle
    const [showToggle, setShowToggle] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const textRef = useRef(null);

    // after mount, check if content overflows our preview
    useEffect(() => {
        const el = textRef.current;
        if (el) {
            const isOverflowing = el.scrollHeight > el.clientHeight + 1;
            setShowToggle(isOverflowing);
        }
    }, [question.text]);

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

            <div className={styles.questionTextWrapper}>
                <div
                    id={`question-text-${question.id}`}
                    className={
                        `${styles.questionText} ` +
                        (expanded ? styles.expanded : "")
                    }
                    ref={textRef}
                    role="region"
                    aria-labelledby={`question-title-${question.id}`}
                    dangerouslySetInnerHTML={{
                        __html: DomPurify.sanitize(question.text),
                    }}
                />
                {showToggle && (
                    <button
                        className={styles.toggleButton}
                        onClick={() => setExpanded((e) => !e)}
                        aria-expanded={expanded}
                        aria-controls={`question-text-${question.id}`}
                    >
                        {expanded ? "Mostra meno" : "Leggi di più"}
                    </button>
                )}
            </div>

            <fieldset
                id={`answers-${question.id}`}
                className={styles.answerSection}
                aria-describedby={`question-text-${question.id}`}
                aria-required="true"
            >
                <legend className="sr-only">
                    Opzioni di risposta per la domanda "{question.name}"
                </legend>
                {answersToShow.map((ans) => (
                    <AnswerOption
                        key={ans.id}
                        answer={ans}
                        question={question}
                        isSelected={currentSelectionId === ans.id}
                        submitted={submitted}
                        onSelect={onAnswerSelect}
                        backendResults={backendResults}
                        aria-label={`Risposta: ${
                            ans.text || ans.label || ans.value
                        }`}
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
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DomPurify.sanitize(
                                currentAnswerObj.correction
                            ),
                        }}
                    />
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
