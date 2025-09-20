// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import HomePage from "./pages/HomePage";
import GetStartedPage from "./pages/GetStartedPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForumPage from "./pages/ForumPage";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          {/* Main content */}
          <div className="flex-grow">
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/forums/:forumId" element={<ForumPage />} />
              </Route>

              <Route element={<PublicRoute />}>
                <Route path="/get-started" element={<GetStartedPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              <Route
                path="/"
                element={<Navigate to="/get-started" replace />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
