import { HashRouter, Route, Routes } from "react-router-dom";
import QuizList from "./features/quiz/QuizList";
import QuizPage from "./features/quiz/QuizPage";

export default function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<QuizList />} />
                <Route path="/quiz/:id" element={<QuizPage />} />
                {/* <Route path="/quiz/:id/result" element={<ResultPage />} /> */}
                {/* TODO: add not found route */}
            </Routes>
        </HashRouter>
    );
}
