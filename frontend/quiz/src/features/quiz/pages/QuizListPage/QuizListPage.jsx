import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuizListPage.module.css";
function QuizListPage() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        navigate(`/quiz/${testId}/start`);
    };

    return (
        <main className={styles.quizContainer} aria-busy={loading} aria-live="polite">
            <h1 className={styles.quizTitle}>Quiz Disponibili</h1>

            {loading ? (
                <div role="status">
                    <div className={styles.loading} aria-hidden="true"></div>
                    <span className="sr-only">
                        Caricamento dei quiz in corso…
                    </span>
                </div>
            ) : (
                <ul className={styles.quizList}>
                    {tests.map((test) => (
                        <li className={styles.quizCard} key={test.id}>
                            <h2 className={styles.quizName}>{test.name}</h2>
                            <p className={styles.quizDescription}>
                                {test.description}
                            </p>
                            <button
                                className={styles.quizButton}
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

export default QuizListPage;
