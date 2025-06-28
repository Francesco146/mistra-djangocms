import { useCallback, useEffect, useState } from "react";

export const useQuizLogic = (id) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [startTimestamp, setStartTimestamp] = useState(null);
    const [submitTimestamp, setSubmitTimestamp] = useState(null);
    const [userAge, setUserAge] = useState(
        () => localStorage.getItem("quizUserAge") || ""
    );
    const [userSex, setUserSex] = useState(
        () => localStorage.getItem("quizUserSex") || ""
    );
    const [backendResults, setBackendResults] = useState({});
    const [backendScore, setBackendScore] = useState(null);
    const [executionId, setExecutionId] = useState(null);

    useEffect(() => {
        setUserAge(localStorage.getItem("quizUserAge") || "");
        setUserSex(localStorage.getItem("quizUserSex") || "");
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/tests/${id}/`)
            .then((res) => res.json())
            .then((data) => {
                const questionsWithNoAnswer = data.questions.map((q) => ({
                    ...q,
                    answers: [
                        ...q.answers,
                        {
                            id: -1,
                            text: "Non rispondo",
                            score: "0.00",
                            correction: "",
                        },
                    ],
                }));
                setQuestions(questionsWithNoAnswer);
                setSelectedAnswers({});
                setLoading(false);
                setStartTimestamp(Date.now());
                setSubmitTimestamp(null);
            })
            .catch((err) => {
                console.error("Fetch questions error:", err);
                setLoading(false);
            });
    }, [id]);

    const prevQuestion = useCallback(() => {
        setCurrentIndex((i) => Math.max(i - 1, 0));
    }, []);

    const nextQuestion = useCallback(() => {
        setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
    }, [questions.length]);

    const handleAnswerSelect = useCallback(
        (answerId) => {
            if (submitted) return;
            setSelectedAnswers((prev) => {
                const copy = { ...prev };
                const qid = questions[currentIndex]?.id;
                if (qid !== undefined) {
                    copy[qid] = answerId;
                }
                return copy;
            });
        },
        [currentIndex, submitted, questions]
    );

    const handleSubmit = useCallback(async () => {
        const allAnswered =
            questions.length > 0 &&
            questions.every(
                (q) =>
                    selectedAnswers[q.id] !== undefined &&
                    selectedAnswers[q.id] !== null
            );
        if (!allAnswered) {
            alert("Per favore, rispondi a tutte le domande prima di inviare.");
            return;
        }
        let sexID = localStorage.getItem("quizUserSexID");
        if (!userAge || !userSex || !sexID) {
            alert(
                "Per favore, fornisci la tua età e sesso riavviando il quiz."
            );
            return;
        }

        let endTimestamp = Date.now();
        const durationMinutes = (endTimestamp - startTimestamp) / 60000;

        const submissionData = {
            quiz_id: parseInt(id),
            sex_id: parseInt(sexID),
            age: parseInt(userAge),
            start_time: new Date(startTimestamp).toISOString(),
            duration_minutes: durationMinutes,
            answers: selectedAnswers,
        };

        try {
            const response = await fetch("http://localhost:8000/api/submit-quiz/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit quiz");
            }

            const data = await response.json();

            setBackendResults(data.results);
            setBackendScore(data.score);
            setExecutionId(data.execution_id);
            setSubmitted(true);
            setSubmitTimestamp(endTimestamp);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Errore durante l'invio del quiz. Riprova.");
        }
    }, [selectedAnswers, questions, startTimestamp, userAge, userSex, id]);

    const handleRetry = useCallback(() => {
        setSelectedAnswers({});
        setCurrentIndex(0);
        setSubmitted(false);
        setStartTimestamp(Date.now());
        setSubmitTimestamp(null);
        setBackendResults({});
        setBackendScore(null);
        setExecutionId(null);
        localStorage.removeItem("quizUserAge");
        localStorage.removeItem("quizUserSex");
        localStorage.removeItem("quizUserSexID");
        setUserAge("");
        setUserSex("");
    }, []);

    const correctCount = Object.values(backendResults).filter(
        (result) => result === true
    ).length;

    return {
        questions,
        loading,
        currentIndex,
        selectedAnswers,
        submitted,
        correctCount,
        setCurrentIndex,
        prevQuestion,
        nextQuestion,
        handleAnswerSelect,
        handleSubmit,
        handleRetry,
        startTimestamp,
        submitTimestamp,
        userAge,
        userSex,
        backendResults,
        backendScore,
        executionId,
    };
};
