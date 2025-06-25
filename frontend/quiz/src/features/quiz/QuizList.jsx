import { useEffect, useState } from "react";
import "../../styles/QuizList.css";

function QuizList() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/tests/")
            .then((res) => res.json())
            .then((data) => {
                setTests(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch tests error:", err);
                setLoading(false);
            });
    }, []);

    const handleStartQuiz = async (testId) => {
        console.log(
            await fetch(`http://localhost:8000/api/tests/${testId}/`).then(
                (res) => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                }
            )
        );
        location.href = "http://localhost:5173/quiz/" + testId;
    };

    return (
        <main className="quiz-container" aria-busy={loading} aria-live="polite">
            <h1 className="quiz-title">Quiz Disponibili</h1>

            {loading ? (
                <div role="status">
                    <div className="loading" aria-hidden="true"></div>
                    <span className="sr-only">
                        Caricamento dei quiz in corso…
                    </span>
                </div>
            ) : (
                <ul className="quiz-list">
                    {tests.map((test) => (
                        <li className="quiz-card" key={test.id}>
                            <h2 className="quiz-name">{test.name}</h2>
                            <p className="quiz-description">
                                {test.description}
                            </p>
                            <button
                                className="quiz-button"
                                aria-label={`Inizia il quiz ${test.name}`}
                                onClick={() => handleStartQuiz(test.id)}
                            >
                                Inizia
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}

export default QuizList;
