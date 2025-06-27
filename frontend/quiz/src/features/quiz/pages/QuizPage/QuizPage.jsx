import { LoadingSpinner, NavigationButton } from "@components/ui";
import {
    MobileNavigation,
    QuestionCard,
    QuizSummary,
} from "@features/components";
import { usePDFGenerator } from "@hooks/usePDFGenerator";
import { useQuizLogic } from "@hooks/useQuizLogic";
import "@styles/QuizPage.css";
import { useNavigate, useParams } from "react-router-dom";

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
    } = useQuizLogic(id);

    const { generatePDF } = usePDFGenerator();

    const handleSavePDF = () => {
        generatePDF(questions, selectedAnswers, id);
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
        <main className="quiz-container" aria-busy="false" aria-live="polite">
            <div className="quiz-grid">
                {/* Previous navigation (desktop/tablet) */}
                <div className="nav-column nav-prev">
                    <NavigationButton
                        direction="prev"
                        onClick={prevQuestion}
                        disabled={currentIndex === 0}
                    >
                        ←
                    </NavigationButton>
                </div>

                {/* Question + Answers */}
                <QuestionCard
                    question={question}
                    questions={questions}
                    currentIndex={currentIndex}
                    selectedAnswers={selectedAnswers}
                    submitted={submitted}
                    onAnswerSelect={handleAnswerSelect}
                    onQuestionSelect={setCurrentIndex}
                />

                {/* Next navigation (desktop/tablet) */}
                <div className="nav-column nav-next">
                    <NavigationButton
                        direction="next"
                        onClick={nextQuestion}
                        disabled={currentIndex === questions.length - 1}
                    >
                        →
                    </NavigationButton>
                </div>
            </div>

            {/* Mobile navigation */}
            <MobileNavigation
                currentIndex={currentIndex}
                questionsLength={questions.length}
                onPrevious={prevQuestion}
                onNext={nextQuestion}
            />

            {/* Submit / Retry controls */}
            <div className="quiz-footer">
                {!submitted && currentIndex === questions.length - 1 && (
                    <button className="submit-button" onClick={handleSubmit}>
                        Invia risposte
                    </button>
                )}
                {submitted && (
                    <QuizSummary
                        correctCount={correctCount}
                        totalQuestions={questions.length}
                        onRetry={handleRetryAndGoToStart}
                        onSavePDF={handleSavePDF}
                    />
                )}
            </div>
        </main>
    );
}

export default QuizPage;
