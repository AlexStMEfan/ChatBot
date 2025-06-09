import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import ResetPass from "./pages/ResetPass";
import Registration from "./pages/Registration";

const App = () => {
    const isAuthenticated = true; // заменить на логику проверки авторизации
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/app/*" element={isAuthenticated ? <MainPage /> : <Navigate to="/login" replace />} />
                <Route path="/reset" element={<ResetPass />} />
                    <Route path="/reg" element={<Registration />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
