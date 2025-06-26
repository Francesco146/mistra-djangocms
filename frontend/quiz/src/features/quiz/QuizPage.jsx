import DomPurify from "dompurify";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import favicon from "../../assets/image.png";
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

    const handleSavePDF = () => {
        const pdf = new jsPDF({
            unit: "pt",
            format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 40;
        const lineHeight = 16;
        let cursorY = margin;

        // 1) Aggiungi il logo in alto a sinistra
        const img = new Image();
        img.src = favicon;
        img.onload = () => {
            const logoWidth = 50;
            const logoHeight = (img.height * logoWidth) / img.width;
            pdf.addImage(img, "PNG", margin, cursorY, logoWidth, logoHeight);

            // space after the logo
            cursorY += logoHeight + 20;

            // title
            pdf.setFontSize(18);
            pdf.text("Risultati del Quiz", pageWidth / 2, cursorY, {
                align: "center",
            });
            cursorY += 30;

            // for each question, save the question, answer, and result
            pdf.setFontSize(12);
            questions.forEach((q, idx) => {
                // add new page if needed
                if (cursorY + 3 * lineHeight > pageHeight - margin) {
                    pdf.addPage();
                    cursorY = margin;
                }

                pdf.setFont(undefined, "bold");
                pdf.text(`Domanda ${idx + 1}: ${q.name}`, margin, cursorY);
                cursorY += lineHeight;

                const ans = q.answers.find(
                    (a) => a.id === selectedAnswers[idx]
                );
                const givenText = ans ? ans.text : "—";
                pdf.setFont(undefined, "normal");
                pdf.text(
                    `Risposta fornita: ${givenText}`,
                    margin + 10,
                    cursorY
                );
                cursorY += lineHeight;

                const isCorrect = ans && ans.score === "1.00";
                pdf.text(
                    `Risultato: ${isCorrect ? "Corretto" : "Sbagliato"}`,
                    margin + 10,
                    cursorY
                );
                // extra padding
                cursorY += lineHeight + 10;
            });

            pdf.save(`risultati_quiz_${id}.pdf`);
        };
    };

    const getNavButtonClass = (idx) => {
        let classes = "nav-dot";

        if (currentIndex === idx) {
            classes += " active";
        }

        if (submitted) {
            // Check if the answer is correct
            const ansId = selectedAnswers[idx];
            const question = questions[idx];
            const answer = question.answers.find((a) => a.id === ansId);
            if (answer && answer.score === "1.00") {
                classes += " correct";
            } else {
                classes += " incorrect";
            }
        } else {
            // Check if question is answered (not submitted yet)
            if (selectedAnswers[idx] === null) {
                classes += " unanswered";
            } else {
                classes += " answered";
            }
        }

        return classes;
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
                            Opzioni per "{question.name}"
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
                                    className={getNavButtonClass(idx)}
                                    onClick={() => setCurrentIndex(idx)}
                                    aria-label={`Vai alla domanda ${idx + 1}${
                                        selectedAnswers[idx] === null &&
                                        !submitted
                                            ? " (non risposta)"
                                            : ""
                                    }`}
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
                        <div className="summary-buttons">
                            <button
                                className="retry-button"
                                onClick={handleRetry}
                            >
                                Riprova quiz
                            </button>
                            <button
                                className="save-button"
                                onClick={handleSavePDF}
                            >
                                Salva risultati PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default QuizPage;
