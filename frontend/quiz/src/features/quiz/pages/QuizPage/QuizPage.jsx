import { LoadingSpinner, NavigationButton } from "@components/ui";
import {
    MobileNavigation,
    QuestionCard,
    QuizSummary,
} from "@features/components";
import { usePDFGenerator } from "@hooks/usePDFGenerator";
import { useQuizLogic } from "@hooks/useQuizLogic";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./QuizPage.module.css";

function QuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
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
        userAge,
        userSex,
        backendResults,
        backendScore,
        executionId,
        quizTitle,
    } = useQuizLogic(id);

    const { generatePDF } = usePDFGenerator();

    const handleSavePDF = () => {
        generatePDF(
            questions,
            selectedAnswers,
            executionId,
            userAge,
            userSex,
            backendResults,
            backendScore
        );
    };

    const handleRetryAndGoToStart = () => {
        handleRetry();
        navigate(`/quiz/${id}/start`);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const question = questions[currentIndex];

    return (
        <>
        <h1 className={styles.quizTitle}>{quizTitle || "Quiz"}</h1>
        <main
            className={styles.quizContainer}
            aria-busy="false"
            aria-live="polite"
        >
            <div className={styles.quizGrid}>
                {/* Previous navigation (desktop/tablet) */}
                <div className={`${styles.navColumn} ${styles.navPrev}`}>
                    <NavigationButton
                        direction="prev"
                        onClick={prevQuestion}
                        disabled={currentIndex === 0}
                    >
                        ←
                    </NavigationButton>
                </div>

                {/* Question + Answers */}
                <div className={styles.questionColumn}>
                    <QuestionCard
                        question={question}
                        questions={questions}
                        currentIndex={currentIndex}
                        selectedAnswers={selectedAnswers}
                        submitted={submitted}
                        onAnswerSelect={handleAnswerSelect}
                        onQuestionSelect={setCurrentIndex}
                        backendResults={backendResults}
                    />
                </div>

                {/* Next navigation (desktop/tablet) */}
                <div className={`${styles.navColumn} ${styles.navNext}`}>
                    <NavigationButton
                        direction="next"
                        onClick={nextQuestion}
                        disabled={currentIndex === questions.length - 1}
                    >
                        →
                    </NavigationButton>
                </div>
            </div>

            {/* Submit / Retry controls */}
            <div className={styles.quizFooter}>
                {!submitted && currentIndex === questions.length - 1 && (
                    <button
                        className={styles.submitButton}
                        onClick={handleSubmit}
                    >
                        Invia risposte
                    </button>
                )}
                <div role="status">
                    {submitted && (
                        <QuizSummary
                        correctCount={correctCount}
                        totalQuestions={questions.length}
                        onRetry={handleRetryAndGoToStart}
                        onSavePDF={handleSavePDF}
                        backendScore={backendScore}
                        />
                    )}
                </div>
            </div>
        </main>
        {/* Mobile navigation */}
        <MobileNavigation
            currentIndex={currentIndex}
            questionsLength={questions.length}
            onPrevious={prevQuestion}
            onNext={nextQuestion}
        />
        </>
    );
}

export default QuizPage;
