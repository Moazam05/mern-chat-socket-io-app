// React Imports
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Custom Imports
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import SignUp from "./views/SignUp";
import Login from "./views/Login";
import Home from "./views/Home";
import Profile from "./views/Profile";
import NotFound from "./views/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoutes>
              <SignUp />
            </PublicRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
