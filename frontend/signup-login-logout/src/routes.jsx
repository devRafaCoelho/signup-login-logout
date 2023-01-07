import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import LogInPage from "./pages/LogIn";
import RegisterPage from "./pages/SignUp";
import { getItem } from "./utils/storage";

function ProtectedRoutes({ redirectTo }) {
    const isAuth = getItem("token");

    return isAuth ? <Outlet /> : <Navigate to={redirectTo} />;
}

export default function MainRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LogInPage />} />
            <Route path="/user" element={<RegisterPage />} />
            <Route element={<ProtectedRoutes redirectTo="/login" />}>
                <Route path="/home" element={<HomePage />} />
            </Route>
        </Routes>
    );
}
