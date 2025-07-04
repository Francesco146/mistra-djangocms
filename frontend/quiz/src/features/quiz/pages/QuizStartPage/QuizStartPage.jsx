import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./QuizStartPage.module.css";
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
        const selectedSex = sexChoices.find(
            (choice) => String(choice.id) === sex
        );
        const sexLabel = selectedSex ? selectedSex.name : sex;
        localStorage.setItem("quizUserAge", age);
        localStorage.setItem("quizUserSex", sexLabel);
        localStorage.setItem("quizUserSexID", sex);
        navigate(`/quiz/${id}`);
    };

    if (loading) {
        return <div className={styles.quizStartLoading}>Caricamento…</div>;
    }
    if (error) {
        return <div className={styles.quizStartError}>{error}</div>;
    }
    
    return (
        <>
        <main className={styles.quizStartContainer}>
            <h1 className={styles.quizTitle}>Prima di iniziare…</h1>
            <form className={styles.quizStartForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
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
                <fieldset className={styles.formGroup}>
                    <legend>Sesso</legend>
                    {sexChoices.map((choice) => (
                        <label key={choice.id} className={styles.radioLabel}>
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
                    className={styles.quizStartButton}
                    disabled={!age || !sex}
                    >
                    Inizia quiz
                </button>
            </form>
        </main>
        </>
    );
}

export default QuizStartPage;
