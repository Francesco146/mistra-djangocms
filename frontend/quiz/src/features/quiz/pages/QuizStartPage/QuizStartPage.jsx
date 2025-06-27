import "@styles/QuizStartPage.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function QuizStartPage() {
    const { id } = useParams();
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [sexChoices, setSexChoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/api/sex/")
            .then((res) => res.json())
            .then((data) => {
                setSexChoices(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Errore nel caricamento delle opzioni di sesso.");
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!age || !sex) return;
        localStorage.setItem("quizUserAge", age);
        localStorage.setItem("quizUserSex", sex);
        navigate(`/quiz/${id}`);
    };

    if (loading) {
        return <div className="quiz-start-loading">Caricamento…</div>;
    }
    if (error) {
        return <div className="quiz-start-error">{error}</div>;
    }

    return (
        <main className="quiz-start-container">
            <h1>Prima di iniziare…</h1>
            <form className="quiz-start-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="age">Età</label>
                    <input
                        id="age"
                        type="number"
                        min="0"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>
                <fieldset className="form-group">
                    <legend>Sesso</legend>
                    {sexChoices.map((choice) => (
                        <label key={choice.id} className="radio-label">
                            <input
                                type="radio"
                                name="sex"
                                value={choice.id}
                                checked={sex === String(choice.id)}
                                onChange={() => setSex(String(choice.id))}
                                required
                            />
                            {choice.name}
                        </label>
                    ))}
                </fieldset>
                <button
                    type="submit"
                    className="quiz-start-button"
                    disabled={!age || !sex}
                >
                    Inizia quiz
                </button>
            </form>
        </main>
    );
}

export default QuizStartPage;
