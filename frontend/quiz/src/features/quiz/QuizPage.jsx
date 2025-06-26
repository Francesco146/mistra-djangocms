import DomPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/QuizPage.css";

function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
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
        setSelectedAnswers((prev) => {
            const copy = [...prev];
            copy[currentIndex] = answerId;
            return copy;
        });
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

    return (
        <main
            className="quiz-container"
            style={{ display: "flex" }}
            aria-busy="false"
            aria-live="polite"
        >
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

                    {/* Answer tile group */}
                    <fieldset className="answer-section">
                        <legend className="sr-only">
                            Opzioni per “{question.name}”
                        </legend>
                        {question.answers.map((ans) => (
                            <label
                                key={ans.id}
                                htmlFor={`q${question.id}-a${ans.id}`}
                                className={`answer-option ${
                                    selectedAnswers[currentIndex] === ans.id
                                        ? "selected"
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    id={`q${question.id}-a${ans.id}`}
                                    name={`question-${question.id}`}
                                    value={ans.id}
                                    checked={
                                        selectedAnswers[currentIndex] === ans.id
                                    }
                                    onChange={() => handleAnswerSelect(ans.id)}
                                />
                                <span className="answer-text">{ans.text}</span>
                            </label>
                        ))}
                    </fieldset>
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
        </main>
    );
}

export default QuizPage;
