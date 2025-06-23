import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import Home from './pages/home'
import QuizPage from './features/quiz/QuizPage';
import ResultPage from './features/quiz/ResultPage';
import NotFound from './pages/NotFound';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/quiz/:id/result" element={<ResultPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
