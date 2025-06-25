import DomPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/QuizPage.css";

function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:8000/api/tests/${id}/`)
            .then((res) => res.json())
            .then((data) => {
                setQuestions(data.questions);
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

    return (
        <main
            className="quiz-container"
            style={{ display: "flex" }}
            aria-busy={loading}
            aria-live="polite"
        >
            {loading ? (
                <div role="status">
                    <div className="loading" aria-hidden="true"></div>
                    <span className="sr-only">
                        Caricamento del quiz in corso…
                    </span>
                </div>
            ) : (
                <>
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

                        {/* Question Tile */}
                        <div
                            className="question-card"
                            role="group"
                            aria-labelledby="question-title"
                        >
                            <h2 id="question-title" className="question-title">
                                {questions[currentIndex].name}
                            </h2>
                            <div
                                className="question-text"
                                dangerouslySetInnerHTML={{
                                    __html: DomPurify.sanitize(
                                        questions[currentIndex].text
                                    ),
                                }}
                            />
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
                </>
            )}
        </main>
    );
}

export default QuizPage;
