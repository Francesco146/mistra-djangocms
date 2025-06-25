import DomPurify from "dompurify";
import { useEffect, useState } from "react";
import "../../styles/QuizList.css";

/*
{
    "id": 1,
    "name": "Test di Geografia",
    "description": "Un test base sulla geografia italiana",
    "min_score": 0.5,
    "questions": [
        {
            "id": 1,
            "name": "Capitale d'Italia",
            "text": "Qual'è la capitale d'Italia?",
            "id_category": 1
        },
        {
            "id": 2,
            "name": "question2",
            "text": "<p>domanda 2?<br />\r\n<br />\r\n&nbsp;</p>\r\n\r\n<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"width:100%\">\r\n\t<tbody>\r\n\t\t<tr>\r\n\t\t\t<td>dio</td>\r\n\t\t\t<td>cane</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td>dio</td>\r\n\t\t\t<td>porco</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td>dio</td>\r\n\t\t\t<td>merda</td>\r\n\t\t</tr>\r\n\t</tbody>\r\n</table>\r\n\r\n<p>&nbsp;</p>",
            "id_category": 1
        }
    ]
}*/
function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const testId = window.location.pathname.split("/").pop();
        fetch(`http://localhost:8000/api/tests/${testId}/`)
            .then((res) => res.json())
            .then((data) => {
                setQuestions(data.questions);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch questions error:", err);
                setLoading(false);
            });
    }, []);

    return (
        <main className="quiz-container" aria-busy={loading} aria-live="polite">
            <h1 className="quiz-title">Quiz</h1>

            {loading ? (
                <div role="status">
                    <div className="loading" aria-hidden="true"></div>
                    <span className="sr-only">
                        Caricamento del quiz in corso…
                    </span>
                </div>
            ) : (
                <ul className="quiz-list">
                    {questions.map((question) => (
                        <li className="quiz-card" key={question.id}>
                            <h2 className="quiz-name">{question.name}</h2>
                            <p className="quiz-description">
                                <span
                                    /* TODO: prevent XSS */
                                    dangerouslySetInnerHTML={{
                                        __html: DomPurify.sanitize(
                                            question.text
                                        ),
                                    }}
                                />
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}

export default QuizPage;
