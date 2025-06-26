import { useCallback, useEffect, useState } from "react";

export const useQuizLogic = (id) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);

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
                const copy = [...prev];
                copy[currentIndex] = answerId;
                return copy;
            });
        },
        [currentIndex, submitted]
    );

    const handleSubmit = useCallback(() => {
        if (selectedAnswers.some((ans) => ans === null)) {
            alert("Per favore, rispondi a tutte le domande prima di inviare.");
            return;
        }
        setSubmitted(true);
    }, [selectedAnswers]);

    const handleRetry = useCallback(() => {
        setSelectedAnswers(Array(questions.length).fill(null));
        setCurrentIndex(0);
        setSubmitted(false);
    }, [questions.length]);

    const correctCount = selectedAnswers.reduce((acc, ansId, idx) => {
        if (!questions[idx]) return acc;
        const ans = questions[idx].answers.find((a) => a.id === ansId);
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
    };
};
