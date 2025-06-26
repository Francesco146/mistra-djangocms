import { QuizListPage, QuizPage } from "@features/pages";
import { HashRouter, Route, Routes } from "react-router-dom";

export default function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<QuizListPage />} />
                <Route path="/quiz/:id" element={<QuizPage />} />
                {/* <Route path="/quiz/:id/result" element={<ResultPage />} /> */}
                {/* TODO: add not found route */}
            </Routes>
        </HashRouter>
    );
}
