import DomPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/QuizPage.css";

function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:8000/api/tests/${id}/`)
            .then((res) => res.json())
            .then((data) => {
                setQuestions(data.questions);
                setSelectedAnswers(Array(data.questions.length).fill(null));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch questions error:", err);
                setLoading(false);
            });
    }, [id]);

    const prevQuestion = () => setCurrentIndex((i) => Math.max(i - 1, 0));
    const nextQuestion = () =>
        setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));

    const handleAnswerSelect = (answerId) => {
        if (submitted) return;
        setSelectedAnswers((prev) => {
            const copy = [...prev];
            copy[currentIndex] = answerId;
            return copy;
        });
    };

    const handleSubmit = () => {
        if (selectedAnswers.some((ans) => ans === null)) {
            alert("Per favore, rispondi a tutte le domande prima di inviare.");
            return;
        }
        setSubmitted(true);
    };

    const handleRetry = () => {
        setSelectedAnswers(Array(questions.length).fill(null));
        setCurrentIndex(0);
        setSubmitted(false);
    };

    if (loading) {
        return (
            <main
                className="quiz-container"
                aria-busy="true"
                aria-live="polite"
            >
                <div role="status">
                    <div className="loading" aria-hidden="true"></div>
                    <span className="sr-only">
                        Caricamento del quiz in corso…
                    </span>
                </div>
            </main>
        );
    }

    const question = questions[currentIndex];

    const currentSelectionId = selectedAnswers[currentIndex];
    const currentAnswerObj =
        question.answers.find((a) => a.id === currentSelectionId) || {};
    const isCorrect = currentAnswerObj.score === "1.00";

    const correctCount = selectedAnswers.reduce((acc, ansId, idx) => {
        const ans = questions[idx].answers.find((a) => a.id === ansId);
        return acc + (ans && ans.score === "1.00" ? 1 : 0);
    }, 0);

    return (
        <main className="quiz-container" aria-busy="false" aria-live="polite">
            <div className="quiz-grid">
                {/* Prev (desktop/tablet) */}
                <div className="nav-column nav-prev">
                    <button
                        className="nav-button"
                        onClick={prevQuestion}
                        disabled={currentIndex === 0}
                        aria-label="Domanda precedente"
                    >
                        ←
                    </button>
                </div>

                {/* Question + Answers */}
                <div
                    className="question-card"
                    role="group"
                    aria-labelledby={`question-title-${question.id}`}
                >
                    <h2
                        id={`question-title-${question.id}`}
                        className="question-title"
                    >
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
                            Opzioni per “{question.name}”
                        </legend>
                        {(submitted
                            ? question.answers.filter(
                                  (a) => a.id === currentSelectionId
                              )
                            : question.answers
                        ).map((ans) => {
                            let extraClass = "";
                            if (submitted) {
                                extraClass =
                                    ans.score === "1.00"
                                        ? "correct"
                                        : "incorrect";
                            } else if (currentSelectionId === ans.id) {
                                extraClass = "selected";
                            }

                            return (
                                <label
                                    key={ans.id}
                                    htmlFor={`q${question.id}-a${ans.id}`}
                                    className={`answer-option ${extraClass}`}
                                >
                                    <input
                                        type="radio"
                                        id={`q${question.id}-a${ans.id}`}
                                        name={`question-${question.id}`}
                                        value={ans.id}
                                        checked={currentSelectionId === ans.id}
                                        onChange={() =>
                                            handleAnswerSelect(ans.id)
                                        }
                                        disabled={submitted}
                                    />
                                    <span className="answer-text">
                                        {ans.text}
                                    </span>
                                </label>
                            );
                        })}
                    </fieldset>

                    {/* ── Navigation Grid ───────────────────────────────────────────────────────── */}
                    {questions.length > 0 && (
                        <nav
                            className="question-nav"
                            aria-label="Navigazione tra le domande"
                        >
                            {questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    type="button"
                                    className={`nav-dot ${
                                        currentIndex === idx ? "active" : ""
                                    }`}
                                    onClick={() => setCurrentIndex(idx)}
                                    aria-label={`Vai alla domanda ${idx + 1}`}
                                    aria-current={
                                        currentIndex === idx
                                            ? "step"
                                            : undefined
                                    }
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </nav>
                    )}

                    {/* after submit, show feedback */}
                    {submitted && (
                        <div
                            className={`correction-text ${
                                isCorrect
                                    ? "feedback-correct"
                                    : "feedback-incorrect"
                            }`}
                        >
                            <strong>
                                {isCorrect ? "Corretto!" : "Sbagliato!"}
                            </strong>
                            <div>{currentAnswerObj.correction}</div>
                        </div>
                    )}
                    <div className="progress-container" aria-hidden="true">
                        <div
                            className="progress-bar"
                            style={{
                                width: `${
                                    ((currentIndex + 1) / questions.length) *
                                    100
                                }%`,
                            }}
                        />
                    </div>
                </div>

                {/* Next (desktop/tablet) */}
                <div className="nav-column nav-next">
                    <button
                        className="nav-button"
                        onClick={nextQuestion}
                        disabled={currentIndex === questions.length - 1}
                        aria-label="Prossima domanda"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Sticky mobile nav */}
            <div className="mobile-nav" aria-hidden="false">
                <button
                    className="nav-button"
                    onClick={prevQuestion}
                    disabled={currentIndex === 0}
                    aria-label="Domanda precedente"
                >
                    ← Precedente
                </button>
                <button
                    className="nav-button"
                    onClick={nextQuestion}
                    disabled={currentIndex === questions.length - 1}
                    aria-label="Prossima domanda"
                >
                    Successiva →
                </button>
            </div>

            {/* Submit / Retry controls */}
            <div className="quiz-footer">
                {!submitted && currentIndex === questions.length - 1 && (
                    <button className="submit-button" onClick={handleSubmit}>
                        Invia risposte
                    </button>
                )}
                {submitted && (
                    <div className="summary">
                        <p>
                            Hai risposto correttamente a{" "}
                            <strong>{correctCount}</strong> domande su{" "}
                            <strong>{questions.length}</strong>. Score:{" "}
                            <strong>
                                {(correctCount / questions.length) * 100}%
                            </strong>
                        </p>
                        <button className="retry-button" onClick={handleRetry}>
                            Riprova quiz
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default QuizPage;
