import { useCallback, useEffect, useState } from "react";

function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const LOCAL_STORAGE_KEY = (id) => `quizState_${id}`;

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
    const [stateRestored, setStateRestored] = useState(false);

    useEffect(() => {
        setUserAge(localStorage.getItem("quizUserAge") || "");
        setUserSex(localStorage.getItem("quizUserSex") || "");
    }, [id]);

    // restore state from localStorage if present
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY(id));
        if (saved) {
            try {
                const state = JSON.parse(saved);
                setSelectedAnswers(state.selectedAnswers || {});
                setCurrentIndex(state.currentIndex || 0);
                setSubmitted(state.submitted || false);
                setStartTimestamp(state.startTimestamp || Date.now());
                setSubmitTimestamp(state.submitTimestamp || null);
                setBackendResults(state.backendResults || {});
                setBackendScore(state.backendScore || null);
                setExecutionId(state.executionId || null);
                setStateRestored(true);
            } catch {
                // ignore parse errors
                setStateRestored(true);
            }
        } else {
            setStateRestored(true);
        }
    }, [id]);

    // save state to localStorage on change (only after restoration)
    useEffect(() => {
        if (!stateRestored) return;

        const state = {
            selectedAnswers,
            currentIndex,
            submitted,
            startTimestamp,
            submitTimestamp,
            backendResults,
            backendScore,
            executionId,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY(id), JSON.stringify(state));
    }, [
        stateRestored,
        id,
        selectedAnswers,
        currentIndex,
        submitted,
        startTimestamp,
        submitTimestamp,
        backendResults,
        backendScore,
        executionId,
    ]);

    useEffect(() => {
        if (!stateRestored) return;

        fetch(`http://localhost:8000/api/tests/${id}/`)
            .then((res) => res.json())
            .then((data) => {
                const shuffledQuestions = shuffle(
                    data.questions.map((q) => ({
                        ...q,
                        answers: shuffle([
                            ...q.answers,
                            {
                                id: -1,
                                text: "Non rispondo",
                                score: "0.00",
                                correction: "",
                            },
                        ]),
                    }))
                );
                setQuestions(shuffledQuestions);
                setLoading(false);

                const hasSavedState = localStorage.getItem(
                    LOCAL_STORAGE_KEY(id)
                );
                if (!hasSavedState) {
                    const now = Date.now();
                    setSelectedAnswers({});
                    setCurrentIndex(0);
                    setSubmitted(false);
                    setStartTimestamp(now);
                    setSubmitTimestamp(null);
                    setBackendResults({});
                    setBackendScore(null);
                    setExecutionId(null);
                } else {
                    setStartTimestamp((prev) =>
                        prev && prev > 0 ? prev : Date.now()
                    );
                }
            })
            .catch((err) => {
                console.error("Fetch questions error:", err);
                setLoading(false);
            });
    }, [id, stateRestored]);

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
            const response = await fetch(
                "http://localhost:8000/api/submit-quiz/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submissionData),
                }
            );

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
        localStorage.removeItem(LOCAL_STORAGE_KEY(id));
    }, [id]);

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
