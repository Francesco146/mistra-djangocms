import { QuizListPage, QuizPage, QuizStartPage } from "@features/pages";
import {
    HashRouter,
    Navigate,
    Route,
    Routes,
    useParams,
} from "react-router-dom";

function RequireQuizUserInfo({ children }) {
    const { id } = useParams();
    const age = localStorage.getItem("quizUserAge");
    const sex = localStorage.getItem("quizUserSex");
    const sexID = localStorage.getItem("quizUserSexID");
    if (!age || !sex || !sexID) {
        return <Navigate to={`/quiz/${id}/start`} replace />;
    }
    return children;
}

export default function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<QuizListPage />} />
                <Route path="/quiz/:id/start" element={<QuizStartPage />} />
                <Route
                    path="/quiz/:id"
                    element={
                        <RequireQuizUserInfo>
                            <QuizPage />
                        </RequireQuizUserInfo>
                    }
                />
                {/* <Route path="/quiz/:id/result" element={<ResultPage />} /> */}
                {/* TODO: add not found route */}
            </Routes>
        </HashRouter>
    );
}
