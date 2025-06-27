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

    useEffect(() => {
        setUserAge(localStorage.getItem("quizUserAge") || "");
        setUserSex(localStorage.getItem("quizUserSex") || "");
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/tests/${id}/`)
            .then((res) => res.json())
            .then((data) => {
                setQuestions(data.questions);
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

    const handleSubmit = useCallback(() => {
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
        console.log("All questions answered:", selectedAnswers);
        console.log("User age:", userAge, "User sex:", sexID);
        let endTimestamp = Date.now();
        console.log(
            "Duration (minutes):",
            (endTimestamp - startTimestamp) / 60000
        );
        setSubmitted(true);
        setSubmitTimestamp(endTimestamp);
    }, [selectedAnswers, questions, startTimestamp, userAge, userSex]);

    const handleRetry = useCallback(() => {
        setSelectedAnswers({});
        setCurrentIndex(0);
        setSubmitted(false);
        setStartTimestamp(Date.now());
        setSubmitTimestamp(null);
        localStorage.removeItem("quizUserAge");
        localStorage.removeItem("quizUserSex");
        localStorage.removeItem("quizUserSexID");
        setUserAge("");
        setUserSex("");
    }, []);

    const correctCount = questions.reduce((acc, q) => {
        const ansId = selectedAnswers[q.id];
        if (!ansId) return acc;
        const ans = q.answers.find((a) => a.id === ansId);
        return acc + (ans && ans.score === "1.00" ? 1 : 0);
    }, 0);

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
    };
};
