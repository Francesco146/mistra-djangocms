import DomPurify from "dompurify";
import AnswerOption from "./AnswerOption";
import QuestionNavigation from "./QuestionNavigation";

const QuestionCard = ({
    question,
    questions,
    currentIndex,
    selectedAnswers,
    submitted,
    onAnswerSelect,
    onQuestionSelect,
}) => {
    const currentSelectionId = selectedAnswers[currentIndex];
    const currentAnswerObj =
        question.answers.find((a) => a.id === currentSelectionId) || {};
    const isCorrect = currentAnswerObj.score === "1.00";

    const answersToShow = submitted
        ? question.answers.filter((a) => a.id === currentSelectionId)
        : question.answers;

    return (
        <div
            className="question-card"
            role="group"
            aria-labelledby={`question-title-${question.id}`}
        >
            <h2 id={`question-title-${question.id}`} className="question-title">
                {question.name}
            </h2>
            <div
                className="question-text"
                dangerouslySetInnerHTML={{
                    __html: DomPurify.sanitize(question.text),
                }}
            />

            <fieldset className="answer-section">
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
            />

            {submitted && (
                <div
                    className={`correction-text ${
                        isCorrect ? "feedback-correct" : "feedback-incorrect"
                    }`}
                >
                    <strong>{isCorrect ? "Corretto!" : "Sbagliato!"}</strong>
                    <div>{currentAnswerObj.correction}</div>
                </div>
            )}

            <div className="progress-container" aria-hidden="true">
                <div
                    className="progress-bar"
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
